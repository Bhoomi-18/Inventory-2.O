import React from 'react';
import { Building } from 'lucide-react';
import type { Office } from '../../types/office';
import OfficeCard from './OfficeCard';

interface OfficeListProps {
  offices: Office[];
  onViewDetails: (office: Office) => void;
  onEdit: (office: Office) => void;
}

const OfficeList: React.FC<OfficeListProps> = ({ offices, onViewDetails, onEdit }) => {
  if (offices.length === 0) {
    return (
      <div className="text-center py-12">
        <Building className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">No offices found</h3>
        <p className="mt-1 text-sm text-gray-500">Get started by creating your first office.</p>
      </div>
    );
  }

  const sortedOffices = [...offices].sort((a, b) => {
    if (a.isMain && !b.isMain) return -1;
    if (!a.isMain && b.isMain) return 1;
    return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
  });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sortedOffices.map((office) => (
        <OfficeCard 
          key={office.id}
          office={office}
          onViewDetails={onViewDetails}
          onEdit={onEdit}
        />
      ))}
    </div>
  );
};

export default OfficeList;