import React from 'react';
import { Package, Download } from 'lucide-react';
import type { Asset } from '../../types';

interface AssetTableProps {
  assets: Asset[];
  onBulkAssign: () => void;
  onExport: () => void;
}

const AssetTable: React.FC<AssetTableProps> = ({ assets, onBulkAssign, onExport }) => (
  <div className="bg-white rounded-lg border border-gray-200">
    <div className="p-4 border-b border-gray-200 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <input type="checkbox" className="rounded" />
        <span className="text-sm text-gray-600">Select All</span>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={onBulkAssign}
          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700"
        >
          Bulk Assign
        </button>
        <button 
          onClick={onExport}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>
    </div>
    
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ASSET</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ASSET ID</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">CATEGORY</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">STATUS</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">ASSIGNED TO</th>
            <th className="text-left p-4 text-sm font-medium text-gray-900">OFFICE</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {assets.map((asset) => (
            <tr key={asset.id} className="hover:bg-gray-50">
              <td className="p-4">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="rounded" />
                  <Package className="w-8 h-8 text-gray-400" />
                  <div>
                    <p className="font-medium text-gray-900">{asset.name}</p>
                    <p className="text-sm text-gray-500">{asset.description}</p>
                  </div>
                </div>
              </td>
              <td className="p-4 text-sm text-gray-900">{asset.id}</td>
              <td className="p-4 text-sm text-gray-900">{asset.category}</td>
              <td className="p-4">
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                  asset.status === 'Assigned' 
                    ? 'bg-green-100 text-green-800'
                    : asset.status === 'Available'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-orange-100 text-orange-800'
                }`}>
                  {asset.status}
                </span>
              </td>
              <td className="p-4">
                {asset.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-medium">
                      {asset.assignedTo.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-sm text-gray-900">{asset.assignedTo}</span>
                  </div>
                ) : (
                  <span className="text-sm text-gray-500">-</span>
                )}
              </td>
              <td className="p-4 text-sm text-gray-900">{asset.office}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AssetTable;