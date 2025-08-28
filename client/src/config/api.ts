const API_BASE_URL = import.meta.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    SIGNUP: '/auth/signup',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    CHECK_COMPANY: '/auth/check-company',
    REFRESH: '/auth/refresh'
  },
  DASHBOARD: {
    STATS: '/dashboard/stats'
  },
  ASSETS: {
    LIST: '/assets',
    CREATE: '/assets',
    UPDATE: (id: string) => `/assets/${id}`,
    DELETE: (id: string) => `/assets/${id}`,
    GET: (id: string) => `/assets/${id}`,
    STATS: '/assets/stats',
    EXPORT: '/assets/export',
    BULK_UPDATE: '/assets/bulk',
    BULK_DELETE: '/assets/bulk',
    BULK_UPLOAD: '/assets/bulk-upload'
  },
  INVOICES: {
    LIST: '/invoices',
    CREATE: '/invoices',
    UPDATE: (id: string) => `/invoices/${id}`,
    DELETE: (id: string) => `/invoices/${id}`,
    GET: (id: string) => `/invoices/${id}`,
    STATS: '/invoices/stats',
    MARK_PAID: (id: string) => `/invoices/${id}/mark-paid`,
    EXPORT: '/invoices/export',
    BULK_DELETE: '/invoices/bulk-delete'
  },
  ROLES: {
    LIST: '/roles',
    CREATE: '/roles',
    UPDATE: (id: string) => `/roles/${id}`,
    DELETE: (id: string) => `/roles/${id}`,
    GET: (id: string) => `/roles/${id}`
  },
  USERS: {
    LIST: '/users',
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    DELETE: (id: string) => `/users/${id}`,
    GET: (id: string) => `/users/${id}`,
    PROFILE: '/users/profile'
  },
  OFFICES: {
    LIST: '/offices',
    CREATE: '/offices',
    UPDATE: (id: string) => `/offices/${id}`,
    DELETE: (id: string) => `/offices/${id}`,
    GET: (id: string) => `/offices/${id}`
  },
  VENDORS: {
    LIST: '/vendors',
    CREATE: '/vendors',
    UPDATE: (id: string) => `/vendors/${id}`,
    DELETE: (id: string) => `/vendors/${id}`,
    GET: (id: string) => `/vendors/${id}`
  },
  ASSIGNMENTS: {
    LIST: '/assignments',
    CREATE: '/assignments',
    UPDATE: (id: string) => `/assignments/${id}`,
    DELETE: (id: string) => `/assignments/${id}`,
    GET: (id: string) => `/assignments/${id}`,
    RETURN: (id: string) => `/assignments/${id}/return`
  },
  REPAIRS: {
    LIST: '/repairs',
    CREATE: '/repairs',
    UPDATE: (id: string) => `/repairs/${id}`,
    DELETE: (id: string) => `/repairs/${id}`,
    GET: (id: string) => `/repairs/${id}`,
    COMPLETE: (id: string) => `/repairs/${id}/complete`
  },
  REPORTS: {
    LIST: '/reports',
    CREATE: '/reports',
    STATS: '/reports/stats',
    DOWNLOAD: (id: string) => `/reports/${id}/download`,
    DELETE: (id: string) => `/reports/${id}`
  }
} as const;

export { API_BASE_URL };