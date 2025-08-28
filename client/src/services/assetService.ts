import httpClient from '../utils/httpClient';
import { API_ENDPOINTS } from '../config/api';
const BASE_URL = import.meta.env.REACT_APP_API_BASE_URL || 'http://localhost:3000';
import type { 
  Asset, 
  AssetFormData, 
  AssetQuery, 
  AssetListResponse, 
  AssetStats 
} from '../types/asset';

class AssetService {
  async getAssets(params: AssetQuery = {}): Promise<AssetListResponse> {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryString.append(key, value.toString());
      }
    });
    const endpoint = queryString.toString() 
      ? `${API_ENDPOINTS.ASSETS.LIST}?${queryString.toString()}`
      : API_ENDPOINTS.ASSETS.LIST;
    const response = await httpClient.get<AssetListResponse>(endpoint);
    if (response.data) {
      return response.data;
    }
    throw new Error(response.message || 'Failed to fetch assets');
  }

  async getAssetById(id: string): Promise<Asset> {
    const response = await httpClient.get<{ asset: Asset }>(API_ENDPOINTS.ASSETS.GET(id));
    if (response.data && response.data.asset) {
      return response.data.asset;
    }
    throw new Error(response.message || 'Failed to fetch asset');
  }

  async createAsset(data: AssetFormData): Promise<Asset> {
    const response = await httpClient.post<{ asset: Asset }>(API_ENDPOINTS.ASSETS.CREATE, data);
    if (response.data && response.data.asset) {
      return response.data.asset;
    }
    throw new Error(response.message || 'Failed to create asset');
  }

  async updateAsset(id: string, data: AssetFormData): Promise<Asset> {
    const response = await httpClient.put<{ asset: Asset }>(API_ENDPOINTS.ASSETS.UPDATE(id), data);
    if (response.data && response.data.asset) {
      return response.data.asset;
    }
    throw new Error(response.message || 'Failed to update asset');
  }

  async deleteAsset(id: string): Promise<void> {
    const response = await httpClient.delete(API_ENDPOINTS.ASSETS.DELETE(id));
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete asset');
    }
  }

  async getAssetStats(): Promise<AssetStats> {
    const response = await httpClient.get<{ stats: AssetStats }>(API_ENDPOINTS.ASSETS.STATS);
    if (response.data && response.data.stats) {
      return response.data.stats;
    }
    throw new Error(response.message || 'Failed to fetch asset statistics');
  }

  async getAvailableAssets(): Promise<Asset[]> {
    const response = await this.getAssets({ 
      status: 'Available',
      limit: 1000
    });
    return response.assets || [];
  }

  async getAssetsByIds(assetIds: string[]): Promise<Asset[]> {
    if (!assetIds.length) return [];
    const promises = assetIds.map(id => this.getAssetById(id));
    const results = await Promise.allSettled(promises);
    return results
      .filter((result): result is PromiseFulfilledResult<Asset> => result.status === 'fulfilled')
      .map(result => result.value);
  }

  async getAssetsForSelection(): Promise<Array<{
    _id: string;
    name: string;
    category: string;
  }>> {
    try {
      const assets = await this.getAvailableAssets();
      return assets.map(asset => ({
        _id: asset._id,
        name: asset.name,
        category: asset.category
      }));
    } catch (error) {
      console.error('Error fetching assets for selection:', error);
      return [];
    }
  }

  async bulkUpdateAssets(assetIds: string[], updates: Partial<AssetFormData>): Promise<void> {
    const response = await httpClient.put('/assets/bulk', {
      assetIds,
      updates
    });
    if (!response.success) {
      throw new Error(response.message || 'Failed to update assets');
    }
  }

  async bulkDeleteAssets(assetIds: string[]): Promise<void> {
    const response = await httpClient.delete('/assets/bulk', {
      body: JSON.stringify({ assetIds })
    });
    if (!response.success) {
      throw new Error(response.message || 'Failed to delete assets');
    }
  }

  async exportAssets(params: AssetQuery = {}): Promise<Blob> {
    const queryString = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryString.append(key, value.toString());
      }
    });
    const endpoint = queryString.toString() 
      ? `/assets/export?${queryString.toString()}`
      : '/assets/export';
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('empcare_token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to export assets');
    }
    return response.blob();
  }
}

const assetService = new AssetService();
export default assetService;
export type { Asset, AssetFormData, AssetQuery, AssetListResponse, AssetStats };