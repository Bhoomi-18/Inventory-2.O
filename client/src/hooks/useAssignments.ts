import { useState } from 'react';
import type { Assignment } from '../types';
import { sampleAssignments } from '../data/mockData';

export const useAssignments = () => {
  const [assignments, setAssignments] = useState<Assignment[]>(sampleAssignments);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createAssignment = (assignment: Omit<Assignment, 'id'>) => {
    const newAssignment = {
      ...assignment,
      id: String(assignments.length + 1)
    };
    setAssignments(prev => [...prev, newAssignment]);
  };

  const updateAssignmentStatus = (id: string, status: Assignment['status']) => {
    setAssignments(prev => prev.map(assignment => 
      assignment.id === id ? { ...assignment, status } : assignment
    ));
  };

  const returnAsset = (assignmentId: string) => {
    updateAssignmentStatus(assignmentId, 'Returned');
  };

  const getActiveAssignments = () => 
    assignments.filter(a => a.status === 'Active');
    
  const getOverdueAssignments = () => 
    assignments.filter(a => a.status === 'Overdue');

  return {
    assignments,
    loading,
    error,
    createAssignment,
    updateAssignmentStatus,
    returnAsset,
    getActiveAssignments,
    getOverdueAssignments
  };
};