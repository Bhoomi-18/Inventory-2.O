import React from 'react';
import type { Office } from '../../types';
import OfficeCard from './OfficeCard';

interface OfficeListProps {
  offices: Office[];
  onViewDetails: (office: Office) => void;
  onEdit: (office: Office) => void;
}

const OfficeList: React.FC<OfficeListProps> = ({ offices, onViewDetails, onEdit }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {offices.map((office) => (
      <OfficeCard 
        key={office.id}
        office={office}
        onViewDetails={onViewDetails}
        onEdit={onEdit}
      />
    ))}
  </div>
);

export default OfficeList;