import React, { createContext, useContext, useState, useEffect } from 'react';
import { penguinService } from '../services/penguinService';
import { INITIAL_FORM_DATA } from '../utils/constants';

const PenguinContext = createContext();

export const usePenguinContext = () => {
  const context = useContext(PenguinContext);
  if (!context) {
    throw new Error('usePenguinContext must be used within PenguinProvider');
  }
  return context;
};

export const PenguinProvider = ({ children }) => {
  const [message, setMessage] = useState('');
  const [penguins, setPenguins] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Initialize data on mount
    fetchBackendData();
    fetchPenguins();
  }, []);

  const fetchBackendData = async () => {
    const result = await penguinService.fetchBackendData();
    if (result.success) {
      setMessage(result.data.message);
    } else {
      setMessage(result.error);
    }
  };

  const fetchPenguins = async () => {
    const penguinResult = await penguinService.fetchPenguins();
    if (penguinResult.success) {
      setPenguins(penguinResult.data);
    }
    
    // Also fetch stats
    const statsResult = await penguinService.fetchStats();
    if (statsResult.success) {
      setStats(statsResult.data);
    }
  };

  const addPenguin = async (penguinData) => {
    setLoading(true);
    
    const result = await penguinService.addPenguin(penguinData);
    
    if (result.success) {
      alert(result.data.message);
      await fetchPenguins(); // Refresh the list
      setLoading(false);
      return true;
    } else {
      alert('Error: ' + result.error);
      setLoading(false);
      return false;
    }
  };

  const deletePenguin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this penguin?')) return;
    
    const result = await penguinService.deletePenguin(id);
    
    if (result.success) {
      alert(result.data.message);
      await fetchPenguins(); // Refresh the list
    } else {
      alert('Error: ' + result.error);
    }
  };

  const value = {
    message,
    penguins,
    stats,
    loading,
    addPenguin,
    deletePenguin,
    refreshData: fetchPenguins
  };

  return (
    <PenguinContext.Provider value={value}>
      {children}
    </PenguinContext.Provider>
  );
};