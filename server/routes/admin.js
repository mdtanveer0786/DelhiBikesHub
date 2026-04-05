import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth, requireAdmin } from '../middleware/auth.js';

const router = Router();

// All admin routes require auth + admin role
router.use(requireAuth, requireAdmin);

/**
 * GET /api/admin/stats
 * Dashboard statistics
 */
router.get('/stats', async (req, res) => {
  try {
    // Total bikes
    const { count: totalBikes } = await supabaseAdmin
      .from('bikes')
      .select('*', { count: 'exact', head: true });

    // Active bikes
    const { count: activeBikes } = await supabaseAdmin
      .from('bikes')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    // Total users
    const { count: totalUsers } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    // Total market value
    const { data: valueBikes } = await supabaseAdmin
      .from('bikes')
      .select('price')
      .eq('status', 'active');

    const totalValue = valueBikes?.reduce((acc, b) => acc + (b.price || 0), 0) || 0;

    // Bikes by type
    const { data: bikesByType } = await supabaseAdmin
      .from('bikes')
      .select('type')
      .eq('status', 'active');

    const typeStats = bikesByType?.reduce((acc, b) => {
      acc[b.type] = (acc[b.type] || 0) + 1;
      return acc;
    }, {}) || {};

    // Bikes by brand
    const { data: bikesByBrand } = await supabaseAdmin
      .from('bikes')
      .select('brand')
      .eq('status', 'active');

    const brandStats = bikesByBrand?.reduce((acc, b) => {
      acc[b.brand] = (acc[b.brand] || 0) + 1;
      return acc;
    }, {}) || {};

    // Recent activity (last 7 days)
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const { count: newBikesThisWeek } = await supabaseAdmin
      .from('bikes')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo);

    const { count: newUsersThisWeek } = await supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', weekAgo);

    res.json({
      stats: {
        totalBikes: totalBikes || 0,
        activeBikes: activeBikes || 0,
        totalUsers: totalUsers || 0,
        totalValue,
        typeStats,
        brandStats,
        newBikesThisWeek: newBikesThisWeek || 0,
        newUsersThisWeek: newUsersThisWeek || 0,
      },
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

/**
 * GET /api/admin/users
 * List all users with their listing counts
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabaseAdmin
      .from('profiles')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (search) {
      query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%`);
    }

    const { data: users, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch users' });
    }

    // Get listing counts for each user
    const usersWithCounts = await Promise.all(
      users.map(async (user) => {
        const { count: bikeCount } = await supabaseAdmin
          .from('bikes')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        return { ...user, listingCount: bikeCount || 0 };
      })
    );

    res.json({
      users: usersWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('Users fetch error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/admin/users/:id/role
 * Change user role
 */
router.put('/users/:id/role', async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be "user" or "admin"' });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to update role' });
    }

    res.json({ user: data });
  } catch (err) {
    console.error('Role update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/admin/users/:id
 * Delete a user and their listings
 */
router.delete('/users/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Don't allow self-deletion
    if (id === req.user.id) {
      return res.status(400).json({ error: 'Cannot delete your own account' });
    }

    // Delete from Supabase Auth (cascades to profile via FK)
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);

    if (authError) {
      return res.status(400).json({ error: 'Failed to delete user' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('User delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/admin/bikes
 * All listings with advanced filters (including non-active)
 */
router.get('/bikes', async (req, res) => {
  try {
    const { page = 1, limit = 20, status, search } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabaseAdmin
      .from('bikes')
      .select('*, profiles!bikes_user_id_fkey(name, email)', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + parseInt(limit) - 1);

    if (status) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`model.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    const { data: bikes, error, count } = await query;

    if (error) {
      return res.status(500).json({ error: 'Failed to fetch bikes' });
    }

    const formattedBikes = bikes.map(bike => ({
      ...bike,
      sellerName: bike.profiles?.name || 'Unknown',
      sellerEmail: bike.profiles?.email || '',
      profiles: undefined,
    }));

    res.json({
      bikes: formattedBikes,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: count,
        totalPages: Math.ceil(count / parseInt(limit)),
      },
    });
  } catch (err) {
    console.error('Admin bikes error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/admin/bikes/:id/status
 * Change bike listing status (approve/reject/sold)
 */
router.put('/bikes/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!['active', 'pending', 'rejected', 'sold'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const { data, error } = await supabaseAdmin
      .from('bikes')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to update status' });
    }

    res.json({ bike: data });
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/admin/bikes/:id
 * Force-delete any listing
 */
router.delete('/bikes/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabaseAdmin
      .from('bikes')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      return res.status(400).json({ error: 'Failed to delete listing' });
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Admin bike delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
