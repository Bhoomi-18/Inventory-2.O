export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

export const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};

export const getStatusColor = (status: string): string => {
  const statusColors: Record<string, string> = {
    'Active': 'bg-green-100 text-green-800',
    'Available': 'bg-blue-100 text-blue-800',
    'Assigned': 'bg-green-100 text-green-800',
    'Under Repair': 'bg-orange-100 text-orange-800',
    'In Progress': 'bg-orange-100 text-orange-800',
    'Complete': 'bg-green-100 text-green-800',
    'Overdue': 'bg-red-100 text-red-800',
    'Returned': 'bg-gray-100 text-gray-800',
    'Review': 'bg-yellow-100 text-yellow-800',
    'Cancelled': 'bg-red-100 text-red-800',
    'Awaiting Parts': 'bg-blue-100 text-blue-800'
  };
  
  return statusColors[status] || 'bg-gray-100 text-gray-800';
};