import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, Download, Trash2 } from 'lucide-react';
import { useRepairs } from '../../hooks/useRepair';
import RepairTable from './RepairTable';
import RepairStats from './RepairStats';
import CreateRepairModal from './CreateRepairModal';
import ViewRepairModal from './ViewRepairModal';
import UpdateStatusModal from './UpdateStatusModal';
import type { RepairQuery, RepairTicket } from '../../types/repair';

const Repairs: React.FC = () => {
  const {
    repairs,
    stats,
    loading,
    error,
    pagination,
    fetchRepairs,
    createRepair,
    updateRepair,
    deleteRepair,
    completeRepair,
    refresh
  } = useRepairs();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedRepair, setSelectedRepair] = useState<RepairTicket | null>(null);
  const [selectedRepairs, setSelectedRepairs] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');

  const handleSearch = () => {
    const query: RepairQuery = {
      page: 1,
      limit: 10
    };

    if (searchTerm.trim()) {
      query.search = searchTerm.trim();
    }
    if (statusFilter) {
      query.status = statusFilter as any;
    }
    if (priorityFilter) {
      query.priority = priorityFilter as any;
    }

    fetchRepairs(query);
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPriorityFilter('');
    fetchRepairs({ page: 1, limit: 10 });
  };

  const handleViewRepair = (repair: RepairTicket) => {
    setSelectedRepair(repair);
    setShowViewModal(true);
  };

  const handleUpdateStatus = (repair: RepairTicket) => {
    setSelectedRepair(repair);
    setShowUpdateModal(true);
  };

  const handleDeleteRepair = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this repair ticket?')) {
      try {
        await deleteRepair(id);
        alert('Repair ticket deleted successfully');
      } catch (err: any) {
        alert(err.message || 'Failed to delete repair ticket');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (selectedRepairs.length === 0) {
      alert('Please select repairs to delete');
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${selectedRepairs.length} repair ticket(s)?`)) {
      try {
        await Promise.all(selectedRepairs.map(id => deleteRepair(id)));
        setSelectedRepairs([]);
        alert('Repairs deleted successfully');
      } catch (err: any) {
        alert(err.message || 'Failed to delete repairs');
      }
    }
  };

  const handlePageChange = (page: number) => {
    const query: RepairQuery = { page, limit: 10 };
    
    if (searchTerm.trim()) query.search = searchTerm.trim();
    if (statusFilter) query.status = statusFilter as any;
    if (priorityFilter) query.priority = priorityFilter as any;

    fetchRepairs(query);
  };

  const handleExport = async () => {
    try {
      const query: RepairQuery = {};
      if (searchTerm.trim()) query.search = searchTerm.trim();
      if (statusFilter) query.status = statusFilter as any;
      if (priorityFilter) query.priority = priorityFilter as any;
      
      alert('Export functionality would be implemented here');
    } catch (err: any) {
      alert(err.message || 'Failed to export repairs');
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'n') {
        e.preventDefault();
        setShowCreateModal(true);
      }
      if (e.key === 'Escape') {
        setShowCreateModal(false);
        setShowViewModal(false);
        setShowUpdateModal(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
          <button 
            onClick={refresh}
            className="ml-4 text-red-800 hover:text-red-900 underline"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Repair Management</h1>
          <p className="text-gray-600">Track asset repairs and maintenance</p>
        </div>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="bg-orange-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-orange-700 transition-colors"
          title="Create Repair (Ctrl+N)"
        >
          <Plus className="w-4 h-4" />
          Report Issue
        </button>
      </div>

      {/* Stats */}
      <RepairStats stats={stats} loading={loading} />

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search repairs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Statuses</option>
            <option value="In Progress">In Progress</option>
            <option value="Awaiting Parts">Awaiting Parts</option>
            <option value="Complete">Complete</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
          >
            <option value="">All Priorities</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
            <option value="Critical">Critical</option>
          </select>

          <button
            onClick={handleSearch}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
          >
            <Filter className="w-4 h-4" />
            Filter
          </button>

          <button
            onClick={handleClearFilters}
            className="text-gray-600 hover:text-gray-800 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Action Bar */}
      {selectedRepairs.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <span className="text-blue-800 font-medium">
              {selectedRepairs.length} repair(s) selected
            </span>
            <div className="flex gap-2">
              <button
                onClick={handleBulkDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Delete Selected
              </button>
              <button
                onClick={handleExport}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repair Table */}
      <RepairTable
        repairs={repairs}
        loading={loading}
        pagination={pagination}
        selectedRepairs={selectedRepairs}
        onSelectionChange={setSelectedRepairs}
        onViewRepair={handleViewRepair}
        onUpdateStatus={handleUpdateStatus}
        onDeleteRepair={handleDeleteRepair}
        onPageChange={handlePageChange}
      />

      {/* Modals */}
      {showCreateModal && (
        <CreateRepairModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={() => {
            setShowCreateModal(false);
            refresh();
          }}
          createRepair={createRepair}
        />
      )}

      {showViewModal && selectedRepair && (
        <ViewRepairModal
          isOpen={showViewModal}
          onClose={() => {
            setShowViewModal(false);
            setSelectedRepair(null);
          }}
          repair={selectedRepair}
        />
      )}

      {showUpdateModal && selectedRepair && (
        <UpdateStatusModal
          isOpen={showUpdateModal}
          onClose={() => {
            setShowUpdateModal(false);
            setSelectedRepair(null);
          }}
          repair={selectedRepair}
          onSuccess={() => {
            setShowUpdateModal(false);
            setSelectedRepair(null);
            refresh();
          }}
          updateRepair={updateRepair}
          completeRepair={completeRepair}
        />
      )}
    </div>
  );
};

export default Repairs;