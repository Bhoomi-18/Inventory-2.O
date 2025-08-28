import React, { useState } from 'react';
import { Plus, RefreshCw } from 'lucide-react';
import AssignmentStats from './AssignmentStats';
import AssignmentTable from './AssignmentTable';
import AssignmentModal from './AssignmentModal';
import ReturnAssetModal from './ReturnAssetModal';
import AssignmentDetailsModal from './AssignmentDetailsModal';
import { useAssignments } from '../../hooks/useAssignments';
import type { Assignment } from '../../types/assignment';

const Assignments: React.FC = () => {
  const {
    assignments,
    stats,
    pagination,
    loading,
    error,
    filters,
    setFilters,
    refreshAssignments,
    createAssignment,
    returnAsset,
    deleteAssignment
  } = useAssignments();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isReturnModalOpen, setIsReturnModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const handleCreateAssignment = async (data: any) => {
    setActionLoading(true);
    try {
      await createAssignment(data);
      setIsCreateModalOpen(false);
    } catch (error) {
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleReturnAsset = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsReturnModalOpen(true);
    setIsDetailsModalOpen(false);
  };

  const handleConfirmReturn = async (notes?: string) => {
    if (!selectedAssignment) return;
    
    setActionLoading(true);
    try {
      await returnAsset(selectedAssignment.id, notes);
      setIsReturnModalOpen(false);
      setSelectedAssignment(null);
    } catch (error) {
      throw error;
    } finally {
      setActionLoading(false);
    }
  };

  const handleViewDetails = (assignment: Assignment) => {
    setSelectedAssignment(assignment);
    setIsDetailsModalOpen(true);
  };

  const handleDeleteAssignment = async (assignment: Assignment) => {
    if (!confirm(`Are you sure you want to delete the assignment for ${assignment.asset}?`)) {
      return;
    }

    setActionLoading(true);
    try {
      await deleteAssignment(assignment.id);
    } catch (error) {
    } finally {
      setActionLoading(false);
    }
  };

  const handleRefresh = () => {
    refreshAssignments();
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
          <p className="text-gray-600">Track asset assignments and returns</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleRefresh}
            disabled={loading}
            className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Assignment
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <div className="text-red-600">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <h3 className="text-red-800 font-medium">Error loading assignments</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Statistics */}
      <AssignmentStats stats={stats} loading={loading} />

      {/* Assignment Table */}
      <AssignmentTable
        assignments={assignments}
        loading={loading}
        filters={filters}
        onFiltersChange={setFilters}
        pagination={pagination}
        onViewDetails={handleViewDetails}
        onReturnAsset={handleReturnAsset}
        onDeleteAssignment={handleDeleteAssignment}
      />

      {/* Create Assignment Modal */}
      <AssignmentModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreateAssignment}
        loading={actionLoading}
      />

      {/* Return Asset Modal */}
      <ReturnAssetModal
        isOpen={isReturnModalOpen}
        onClose={() => {
          setIsReturnModalOpen(false);
          setSelectedAssignment(null);
        }}
        onConfirm={handleConfirmReturn}
        assignment={selectedAssignment}
        loading={actionLoading}
      />

      {/* Assignment Details Modal */}
      <AssignmentDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedAssignment(null);
        }}
        assignment={selectedAssignment}
        onReturn={handleReturnAsset}
      />
    </div>
  );
};

export default Assignments;