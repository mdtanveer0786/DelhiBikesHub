import { Router } from 'express';
import { supabaseAdmin } from '../config/supabase.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

/**
 * GET /api/bikes
 * List bikes with pagination, filtering, sorting
 */
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 12,
      type,
      brand,
      locality,
      minPrice,
      maxPrice,
      search,
      sort = 'newest',
      status = 'active',
    } = req.query;

    const offset = (parseInt(page) - 1) * parseInt(limit);

    let query = supabaseAdmin
      .from('bikes')
      .select('*, profiles!bikes_user_id_fkey(name, phone, email, avatar_url, location)', { count: 'exact' });

    // Status filter
    if (status) {
      query = query.eq('status', status);
    }

    // Type filter
    if (type) {
      const types = type.split(',');
      query = query.in('type', types);
    }

    // Brand filter
    if (brand) {
      const brands = brand.split(',');
      query = query.in('brand', brands);
    }

    // Locality filter
    if (locality) {
      const localities = locality.split(',');
      query = query.in('locality', localities);
    }

    // Price range
    if (minPrice) {
      query = query.gte('price', parseInt(minPrice));
    }
    if (maxPrice) {
      query = query.lte('price', parseInt(maxPrice));
    }

    // Search
    if (search) {
      query = query.or(`model.ilike.%${search}%,brand.ilike.%${search}%`);
    }

    // Sorting
    switch (sort) {
      case 'price-low':
        query = query.order('price', { ascending: true });
        break;
      case 'price-high':
        query = query.order('price', { ascending: false });
        break;
      case 'oldest':
        query = query.order('created_at', { ascending: true });
        break;
      default: // newest
        query = query.order('created_at', { ascending: false });
    }

    // Pagination
    query = query.range(offset, offset + parseInt(limit) - 1);

    const { data: bikes, error, count } = await query;

    if (error) {
      console.error('Bikes fetch error:', error);
      return res.status(500).json({ error: 'Failed to fetch bikes' });
    }

    // Flatten seller info
    const formattedBikes = bikes.map(bike => ({
      ...bike,
      sellerName: bike.profiles?.name || 'Unknown',
      sellerPhone: bike.profiles?.phone || '',
      sellerEmail: bike.profiles?.email || '',
      sellerAvatar: bike.profiles?.avatar_url || null,
      sellerLocation: bike.profiles?.location || '',
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
    console.error('Bikes listing error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * GET /api/bikes/:id
 * Get single bike with seller info
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const { data: bike, error } = await supabaseAdmin
      .from('bikes')
      .select('*, profiles!bikes_user_id_fkey(name, phone, email, avatar_url, location)')
      .eq('id', parseInt(id))
      .single();

    if (error || !bike) {
      return res.status(404).json({ error: 'Bike not found' });
    }

    const formattedBike = {
      ...bike,
      sellerName: bike.profiles?.name || 'Unknown',
      sellerPhone: bike.profiles?.phone || '',
      sellerEmail: bike.profiles?.email || '',
      sellerAvatar: bike.profiles?.avatar_url || null,
      sellerLocation: bike.profiles?.location || '',
      profiles: undefined,
    };

    res.json({ bike: formattedBike });
  } catch (err) {
    console.error('Bike detail error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * POST /api/bikes
 * Create a new bike listing (auth required)
 */
router.post('/', requireAuth, async (req, res) => {
  try {
    const { type, brand, model, year, km, price, description, locality, images } = req.body;

    if (!type || !brand || !model || !year || !km || !price || !locality) {
      return res.status(400).json({ error: 'All required fields must be provided' });
    }

    const { data: bike, error } = await supabaseAdmin
      .from('bikes')
      .insert({
        user_id: req.user.id,
        type,
        brand,
        model,
        year: parseInt(year),
        km: parseInt(km),
        price: parseInt(price),
        description: description || '',
        city: 'Delhi',
        locality,
        images: images || [],
        status: 'active',
      })
      .select()
      .single();

    if (error) {
      console.error('Bike creation error:', error);
      return res.status(400).json({ error: 'Failed to create listing' });
    }

    res.status(201).json({ bike });
  } catch (err) {
    console.error('Bike creation error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * PUT /api/bikes/:id
 * Update a bike listing (owner or admin)
 */
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership or admin
    const { data: existing } = await supabaseAdmin
      .from('bikes')
      .select('user_id')
      .eq('id', parseInt(id))
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Bike not found' });
    }

    if (existing.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to update this listing' });
    }

    const allowedFields = ['type', 'brand', 'model', 'year', 'km', 'price', 'description', 'locality', 'images', 'status'];
    const updates = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        if (['year', 'km', 'price'].includes(field)) {
          updates[field] = parseInt(req.body[field]);
        } else {
          updates[field] = req.body[field];
        }
      }
    }

    updates.updated_at = new Date().toISOString();

    const { data: bike, error } = await supabaseAdmin
      .from('bikes')
      .update(updates)
      .eq('id', parseInt(id))
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: 'Failed to update listing' });
    }

    res.json({ bike });
  } catch (err) {
    console.error('Bike update error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * DELETE /api/bikes/:id
 * Delete a bike listing (owner or admin)
 */
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Check ownership or admin
    const { data: existing } = await supabaseAdmin
      .from('bikes')
      .select('user_id')
      .eq('id', parseInt(id))
      .single();

    if (!existing) {
      return res.status(404).json({ error: 'Bike not found' });
    }

    if (existing.user_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }

    const { error } = await supabaseAdmin
      .from('bikes')
      .delete()
      .eq('id', parseInt(id));

    if (error) {
      return res.status(400).json({ error: 'Failed to delete listing' });
    }

    res.json({ message: 'Listing deleted successfully' });
  } catch (err) {
    console.error('Bike delete error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
