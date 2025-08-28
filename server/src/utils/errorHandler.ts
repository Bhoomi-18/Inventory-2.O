export const handleApiError = (error: any): string => {
  if (error.name === 'ValidationError') {
    return Object.values(error.errors || {}).map((val: any) => val.message).join(', ');
  }
  
  if (error.code === 11000) {
    return 'Duplicate field value entered';
  }
  
  if (error.name === 'CastError') {
    return 'Invalid ID format';
  }
  
  return error.message || 'Internal server error';
};