import httpClient from '../utils/httpClient';
import type { Office } from '../types/office';

export const getOffices = () => httpClient.get<Office[]>('/offices');
export const createOffice = (office: Partial<Office>) => httpClient.post<Office>('/offices', office);
export const updateOffice = (id: string, office: Partial<Office>) => httpClient.put<Office>(`/offices/${id}`, office);
export const deleteOffice = (id: string) => httpClient.delete(`/offices/${id}`);
export const getOffice = (id: string) => httpClient.get<Office>(`/offices/${id}`);