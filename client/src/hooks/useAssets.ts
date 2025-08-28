import { useState, useEffect, useCallback } from 'react';
import type { Asset, AssetFormData, AssetQuery, AssetStats } from '../types/asset';
import assetService from '../services/assetService';
import { handleApiError } from '../utils/errorHandler';

interface UseAssetsState {
  assets: Asset[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface UseAssetsStatsState {
  stats: AssetStats | null;
  loading: boolean;
  error: string | null;
}

export const useAssets = (initialQuery: AssetQuery = {}) => {
  const [state, setState] = useState<UseAssetsState>({
    assets: [],
    loading: true,
    error: null,
    pagination: {
      page: 1,
      limit: 10,
      total: 0,
      pages: 0
    }
  });

  const [query, setQuery] = useState<AssetQuery>(initialQuery);

  const fetchAssets = useCallback(async (queryParams: AssetQuery) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await assetService.getAssets(queryParams);
      setState(prev => ({
        ...prev,
        assets: response.assets,
        pagination: response.pagination,
        loading: false,
        error: null
      }));
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: handleApiError(error)
      }));
    }
  }, []);

  const createAsset = useCallback(async (data: AssetFormData): Promise<Asset> => {
    try {
      const newAsset = await assetService.createAsset(data);
      await fetchAssets(query);
      return newAsset;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }, [fetchAssets, query]);

  const updateAsset = useCallback(async (id: string, data: AssetFormData): Promise<Asset> => {
    try {
      const updatedAsset = await assetService.updateAsset(id, data);
      await fetchAssets(query);
      return updatedAsset;
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }, [fetchAssets, query]);

  const deleteAsset = useCallback(async (id: string): Promise<void> => {
    try {
      await assetService.deleteAsset(id);
      await fetchAssets(query);
    } catch (error: any) {
      throw new Error(handleApiError(error));
    }
  }, [fetchAssets, query]);

  const updateQuery = useCallback((newQuery: Partial<AssetQuery>) => {
    setQuery(prev => ({ ...prev, ...newQuery }));
  }, []);

  const refresh = useCallback(() => {
    fetchAssets(query);
  }, [fetchAssets, query]);

  useEffect(() => {
    fetchAssets(query);
  }, [query, fetchAssets]);

  return {
    ...state,
    query,
    updateQuery,
    refresh,
    createAsset,
    updateAsset,
    deleteAsset
  };
};

export const useAssetStats = () => {
  const [state, setState] = useState<UseAssetsStatsState>({
    stats: null,
    loading: true,
    error: null
  });

  const fetchStats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const stats = await assetService.getAssetStats();
      setState({
        stats,
        loading: false,
        error: null
      });
    } catch (error: any) {
      setState(prev => ({
        ...prev,
        loading: false,
        error: handleApiError(error)
      }));
    }
  }, []);

  const refresh = useCallback(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  return {
    ...state,
    refresh
  };
};
