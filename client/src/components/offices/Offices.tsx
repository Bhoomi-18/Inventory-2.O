import React, { useState } from 'react';
import { Plus, Building } from 'lucide-react';
import { useOffices } from '../../hooks/useOffice';
import OfficeList from './OfficeList';
import OfficeForm from './OfficeForm';
import OfficeDetails from './OfficeDetails';
import type { Office } from '../../types/office';

const Offices: React.FC = () => {
  const { offices, loading, error, createOffice, updateOffice, deleteOffice } = useOffices();
  const [selectedOffice, setSelectedOffice] = useState<Office | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [editingOffice, setEditingOffice] = useState<Office | null>(null);

  const handleViewDetails = (office: Office) => {
    setSelectedOffice(office);
    setShowDetails(true);
  };

  const handleEdit = (office: Office) => {
    setEditingOffice(office);
    setShowForm(true);
    setShowDetails(false);
  };

  const handleDelete = async (office: Office) => {
    if (office.isMain) {
      alert('Cannot delete main office');
      return;
    }

    if (window.confirm(`Are you sure you want to delete "${office.name}"? This action cannot be undone.`)) {
      const success = await deleteOffice(office.id);
      if (success) {
        setShowDetails(false);
        setSelectedOffice(null);
      }
    }
  };

  const handleFormSubmit = async (officeData: Partial<Office>) => {
    let success = false;
    
    if (editingOffice) {
      success = await updateOffice(editingOffice.id, officeData);
    } else {
      success = await createOffice(officeData);
    }

    if (success) {
      setShowForm(false);
      setEditingOffice(null);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingOffice(null);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedOffice(null);
  };

  const handleAddOffice = () => {
    setEditingOffice(null);
    setShowForm(true);
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Offices</h1>
          <p className="text-gray-600 mt-1">Manage your company offices and locations</p>
        </div>
        <button
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
          onClick={handleAddOffice}
        >
          <Plus className="w-4 h-4" />
          Add Office
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading offices...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error loading offices</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      ) : offices.length === 0 ? (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No offices found</h3>
          <p className="mt-1 text-sm text-gray-500">Get started by creating your first office.</p>
          <div className="mt-6">
            <button
              onClick={handleAddOffice}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Office
            </button>
          </div>
        </div>
      ) : (
        <OfficeList
          offices={offices}
          onViewDetails={handleViewDetails}
          onEdit={handleEdit}
        />
      )}

      {/* Office Form Popover */}
      <OfficeForm
        initial={editingOffice || undefined}
        onSubmit={handleFormSubmit}
        onCancel={handleCloseForm}
        isOpen={showForm}
      />

      {/* Office Details Popover */}
      <OfficeDetails
        office={selectedOffice}
        onClose={handleCloseDetails}
        onEdit={handleEdit}
        onDelete={handleDelete}
        isOpen={showDetails}
      />
    </div>
  );
};

export default Offices;