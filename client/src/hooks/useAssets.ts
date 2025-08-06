import { useState, useEffect } from 'react';
import type { Asset, AssetFilters } from '../types';
import { sampleAssets } from '../data/mockData';

export const useAssets = (filters?: AssetFilters) => {
  const [assets, setAssets] = useState<Asset[]>(sampleAssets);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filteredAssets = assets.filter(asset => {
    if (!filters) return true;
    
    return (
      (!filters.search || asset.name.toLowerCase().includes(filters.search.toLowerCase())) &&
      (!filters.category || asset.category.includes(filters.category)) &&
      (!filters.status || asset.status === filters.status) &&
      (!filters.office || asset.office === filters.office) &&
      (!filters.vendor || asset.vendor === filters.vendor)
    );
  });

  const addAsset = (asset: Omit<Asset, 'id'>) => {
    const newAsset = {
      ...asset,
      id: `EMP-${new Date().getFullYear()}-${String(assets.length + 1).padStart(3, '0')}`
    };
    setAssets(prev => [...prev, newAsset]);
  };

  const updateAsset = (id: string, updates: Partial<Asset>) => {
    setAssets(prev => prev.map(asset => 
      asset.id === id ? { ...asset, ...updates } : asset
    ));
  };

  const deleteAsset = (id: string) => {
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  return {
    assets: filteredAssets,
    loading,
    error,
    addAsset,
    updateAsset,
    deleteAsset
  };
};