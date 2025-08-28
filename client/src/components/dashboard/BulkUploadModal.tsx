import React, { useState, useRef } from 'react';
import { X, Upload, FileText, Download } from 'lucide-react';

interface BulkUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (file: File) => Promise<void>;
}

const BulkUploadModal: React.FC<BulkUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (selectedFile: File | null) => {
    if (!selectedFile) return;

    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv'
    ];

    if (!validTypes.includes(selectedFile.type)) {
      setError('Please select a valid Excel (.xlsx, .xls) or CSV file');
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) { 
      setError('File size must be less than 10MB');
      return;
    }

    setFile(selectedFile);
    setError('');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFile = e.dataTransfer.files[0];
    handleFileSelect(droppedFile);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null;
    handleFileSelect(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await onUpload(file);
      setFile(null);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  const downloadTemplate = () => {
    const csvContent = `Asset Name,Category,Serial Number,Purchase Date,Purchase Price,Vendor,Location,Condition,Notes
MacBook Pro 13",Computers & Laptops,MBP123456,2024-01-15,1299.99,Apple,Office Floor 1,Excellent,Sample asset
Dell Monitor 24",Monitors & Displays,DM789012,2024-01-20,299.99,Dell,Office Floor 2,Good,Sample monitor`;

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'asset_template.csv';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-lg">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Bulk Upload Assets</h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Template Download */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="w-5 h-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-medium text-blue-900">Download Template</h3>
                <p className="text-sm text-blue-700 mt-1">
                  Download the CSV template with sample data and required columns
                </p>
                <button
                  onClick={downloadTemplate}
                  className="mt-3 flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
                >
                  <Download className="w-4 h-4" />
                  Download Template
                </button>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* File Upload Area */}
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragOver
                ? 'border-blue-400 bg-blue-50'
                : file
                ? 'border-green-400 bg-green-50'
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
          >
            {file ? (
              <div className="space-y-2">
                <FileText className="w-12 h-12 text-green-600 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-green-900">{file.name}</p>
                  <p className="text-sm text-green-700">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
                <button
                  onClick={() => setFile(null)}
                  className="text-sm text-green-600 hover:text-green-700"
                >
                  Remove file
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                <div>
                  <p className="text-lg font-medium text-gray-900">
                    Drop your file here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supports Excel (.xlsx, .xls) and CSV files up to 10MB
                  </p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Choose File
                </button>
              </div>
            )}
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileInputChange}
            className="hidden"
          />

          {/* Instructions */}
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-medium text-gray-900 mb-2">File Requirements:</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Use the provided CSV template</li>
              <li>• Required fields: Asset Name, Category, Serial Number</li>
              <li>• Date format: YYYY-MM-DD</li>
              <li>• Price format: Numbers only (e.g., 1299.99)</li>
              <li>• Maximum 1000 assets per upload</li>
            </ul>
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleUpload}
              disabled={!file || loading}
              className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Uploading...' : 'Upload Assets'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkUploadModal;