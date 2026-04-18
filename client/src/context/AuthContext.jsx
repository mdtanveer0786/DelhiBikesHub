import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { authAPI } from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Demo users fallback when Supabase is not configured
const demoUsers = [
  {
    id: 'demo-1',
    name: "Rahul Sharma",
    phone: "8252574386",
    email: "rahul@example.com",
    location: "Karol Bagh",
    role: 'user',
    created_at: "2022-03-15T10:30:00Z"
  },
  {
    id: 'demo-2',
    name: "Priya Singh",
    phone: "9876543211",
    email: "priya@example.com",
    location: "Lajpat Nagar",
    role: 'user',
    created_at: "2022-05-20T14:45:00Z"
  },
  {
    id: 'demo-admin',
    name: "Admin User",
    phone: "9999999999",
    email: "admin@delhibikeshub.com",
    location: "Delhi",
    role: 'admin',
    created_at: "2022-01-01T00:00:00Z"
  }
];

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isDemo] = useState(!supabase);

  // Initialize — check Supabase session or use demo mode
  useEffect(() => {
    const init = async () => {
      if (supabase) {
        try {
          const { data: { session } } = await supabase.auth.getSession();
          if (session) {
            const { data } = await authAPI.getProfile();
            setCurrentUser(data.user);
          }
        } catch (err) {
          console.error('Session restore failed:', err);
        }

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (event === 'SIGNED_IN' && session) {
            try {
              const { data } = await authAPI.getProfile();
              setCurrentUser(data.user);
            } catch (err) {
              console.error('Profile fetch on auth change failed:', err);
            }
          } else if (event === 'SIGNED_OUT') {
            setCurrentUser(null);
          }
        });

        setLoading(false);
        return () => subscription?.unsubscribe();
      } else {
        // Demo mode
        const savedUser = localStorage.getItem('delhibikeshub_currentUser');
        if (savedUser) {
          setCurrentUser(JSON.parse(savedUser));
        }
        setLoading(false);
      }
    };

    init();
  }, []);

  // Persist demo mode user
  useEffect(() => {
    if (isDemo) {
      if (currentUser) {
        localStorage.setItem('delhibikeshub_currentUser', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('delhibikeshub_currentUser');
      }
    }
  }, [currentUser, isDemo]);

  const login = useCallback(async (email, password) => {
    try {
      if (supabase) {
        const { data } = await authAPI.login({ email, password });
        if (data.session) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });
        }
        setCurrentUser(data.user);
        return { success: true };
      } else {
        // Demo mode
        const user = demoUsers.find(u => u.email === email);
        if (user && password === 'password123') {
          setCurrentUser(user);
          return { success: true };
        }
        return { success: false, message: 'Invalid email or password' };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const signup = useCallback(async (userData) => {
    try {
      if (supabase) {
        const { data } = await authAPI.signup(userData);
        if (data.session) {
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });
        }
        setCurrentUser(data.user);
        return { success: true };
      } else {
        // Demo mode
        const newUser = {
          ...userData,
          id: `demo-${Date.now()}`,
          role: 'user',
          created_at: new Date().toISOString(),
        };
        demoUsers.push(newUser);
        setCurrentUser(newUser);
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (supabase) {
        await supabase.auth.signOut();
      }
      setCurrentUser(null);
    } catch (err) {
      console.error('Logout error:', err);
      setCurrentUser(null);
    }
  }, []);

  const updateUser = useCallback(async (updatedData) => {
    try {
      if (supabase) {
        const { data } = await authAPI.updateProfile(updatedData);
        setCurrentUser(data.user);
        return { success: true };
      } else {
        setCurrentUser(prev => ({ ...prev, ...updatedData }));
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, []);

  const isAdmin = currentUser?.role === 'admin';

  return (
    <AuthContext.Provider value={{
      currentUser,
      loading,
      isDemo,
      isAdmin,
      login,
      signup,
      logout,
      updateUser,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
