export * from './asset';
export * from './assignment';
export * from './vendor';
export * from './repair';

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