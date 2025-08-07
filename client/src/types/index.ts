export * from './asset';
export * from './assignment';
export * from './vendor';
export * from './repair';
export * from './report';
export * from './user';
export * from './office'; 
export * from './invoice';
export * from './settings';

export interface ChartData {
  name: string;
  value: number;
  color?: string;
}

export interface TrendData {
  month: string;
  newAssignments: number;
  returns: number;
}

export interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  icon: React.ComponentType<any>;
  color: string;
}