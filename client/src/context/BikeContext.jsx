import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { bikesAPI, uploadAPI } from '../lib/api';

const BikeContext = createContext();

export const useBikes = () => useContext(BikeContext);

// Demo data fallback
const sampleBikes = [
  {
    id: 1, type: "Scooty", brand: "Honda", model: "Activa 125", year: 2019, km: 15000, price: 45000,
    description: "Well maintained Honda Activa 125 in excellent condition. Single owner, regularly serviced at authorized service center.",
    city: "Delhi", locality: "Karol Bagh", sellerName: "Rahul Sharma", sellerPhone: "8252574386",
    sellerEmail: "rahul@example.com", images: [], status: 'active', created_at: "2023-05-15T10:30:00Z", user_id: 'demo-1'
  },
  {
    id: 2, type: "Bike", brand: "Hero", model: "Splendor Plus", year: 2020, km: 12000, price: 38000,
    description: "Hero Splendor Plus in very good condition. Second owner, well maintained, gives excellent mileage.",
    city: "Delhi", locality: "Lajpat Nagar", sellerName: "Priya Singh", sellerPhone: "9876543211",
    sellerEmail: "priya@example.com", images: [], status: 'active', created_at: "2023-06-20T14:45:00Z", user_id: 'demo-2'
  },
  {
    id: 3, type: "Bike", brand: "Royal Enfield", model: "Classic 350", year: 2018, km: 25000, price: 120000,
    description: "Royal Enfield Classic 350 in perfect condition. Custom modifications done. Selling as moving abroad.",
    city: "Delhi", locality: "Rohini", sellerName: "Amit Kumar", sellerPhone: "9876543212",
    sellerEmail: "amit@example.com", images: [], status: 'active', created_at: "2023-07-10T09:15:00Z", user_id: 'demo-3'
  },
  {
    id: 4, type: "Scooty", brand: "TVS", model: "Jupiter", year: 2021, km: 8000, price: 55000,
    description: "TVS Jupiter like new condition. First owner, used occasionally. Complete service history available.",
    city: "Delhi", locality: "Dwarka", sellerName: "Neha Gupta", sellerPhone: "9876543213",
    sellerEmail: "neha@example.com", images: [], status: 'active', created_at: "2023-08-05T11:20:00Z", user_id: 'demo-4'
  },
  {
    id: 5, type: "Bike", brand: "Bajaj", model: "Pulsar 150", year: 2017, km: 30000, price: 40000,
    description: "Bajaj Pulsar 150 in good running condition. Well maintained, recent servicing done.",
    city: "Delhi", locality: "Shahdara", sellerName: "Vikram Mehta", sellerPhone: "9876543214",
    sellerEmail: "vikram@example.com", images: [], status: 'active', created_at: "2023-08-25T16:10:00Z", user_id: 'demo-5'
  },
  {
    id: 6, type: "Scooty", brand: "Suzuki", model: "Access 125", year: 2020, km: 18000, price: 52000,
    description: "Suzuki Access 125 in excellent condition. Single owner, all original parts.",
    city: "Delhi", locality: "Connaught Place", sellerName: "Anjali Reddy", sellerPhone: "9876543215",
    sellerEmail: "anjali@example.com", images: [], status: 'active', created_at: "2023-09-12T13:30:00Z", user_id: 'demo-6'
  }
];

export const BikeProvider = ({ children }) => {
  const isDemo = !supabase;

  const [bikes, setBikes] = useState(() => {
    if (isDemo) {
      const saved = localStorage.getItem('delhibikeshub_bikes');
      return saved ? JSON.parse(saved) : sampleBikes;
    }
    return [];
  });

  const [loading, setLoading] = useState(!isDemo);
  const [pagination, setPagination] = useState({ page: 1, limit: 12, total: 0, totalPages: 0 });

  // Persist demo mode
  useEffect(() => {
    if (isDemo) {
      localStorage.setItem('delhibikeshub_bikes', JSON.stringify(bikes));
    }
  }, [bikes, isDemo]);

  // Fetch bikes from API
  const fetchBikes = useCallback(async (params = {}) => {
    if (isDemo) return;
    try {
      setLoading(true);
      const { data } = await bikesAPI.list(params);
      setBikes(data.bikes);
      setPagination(data.pagination);
    } catch (err) {
      console.error('Failed to fetch bikes:', err);
    } finally {
      setLoading(false);
    }
  }, [isDemo]);

  // Initial fetch
  useEffect(() => {
    if (!isDemo) {
      fetchBikes();
    }
  }, [isDemo, fetchBikes]);

  const addBike = useCallback(async (bikeData) => {
    try {
      if (isDemo) {
        const newBike = {
          ...bikeData,
          id: bikes.length > 0 ? Math.max(...bikes.map(b => b.id)) + 1 : 1,
          status: 'active',
          created_at: new Date().toISOString(),
          images: bikeData.images || [],
        };
        setBikes(prev => [newBike, ...prev]);
        return { success: true, bike: newBike };
      } else {
        const { data } = await bikesAPI.create(bikeData);
        await fetchBikes();
        return { success: true, bike: data.bike };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [isDemo, bikes, fetchBikes]);

  const deleteBike = useCallback(async (id) => {
    try {
      if (isDemo) {
        setBikes(prev => prev.filter(b => b.id !== id));
        return { success: true };
      } else {
        await bikesAPI.delete(id);
        await fetchBikes();
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [isDemo, fetchBikes]);

  const updateBike = useCallback(async (id, updatedBike) => {
    try {
      if (isDemo) {
        setBikes(prev => prev.map(b => b.id === id ? { ...b, ...updatedBike } : b));
        return { success: true };
      } else {
        await bikesAPI.update(id, updatedBike);
        await fetchBikes();
        return { success: true };
      }
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [isDemo, fetchBikes]);

  const getBikeById = useCallback(async (id) => {
    if (isDemo) {
      return bikes.find(b => b.id === parseInt(id)) || null;
    }
    try {
      const { data } = await bikesAPI.getById(id);
      return data.bike;
    } catch (err) {
      console.error('Failed to fetch bike:', err);
      return null;
    }
  }, [isDemo, bikes]);

  const uploadImages = useCallback(async (files) => {
    try {
      const formData = new FormData();
      files.forEach(file => formData.append('images', file));

      if (isDemo) {
        // Demo: create object URLs
        return {
          success: true,
          images: files.map((f, i) => ({
            url: URL.createObjectURL(f),
            public_id: `demo-${Date.now()}-${i}`,
            thumbnail: URL.createObjectURL(f),
          })),
        };
      }

      const { data } = await uploadAPI.uploadImages(formData);
      return { success: true, images: data.images };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [isDemo]);

  return (
    <BikeContext.Provider value={{
      bikes,
      loading,
      pagination,
      isDemo,
      fetchBikes,
      addBike,
      deleteBike,
      updateBike,
      getBikeById,
      uploadImages,
    }}>
      {children}
    </BikeContext.Provider>
  );
};
