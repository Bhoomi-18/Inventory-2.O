export interface SystemSettings {
  general: GeneralSettings;
  notifications: NotificationSettings;
  security: SecuritySettings;
  backup: BackupSettings;
  integration: IntegrationSettings;
}

export interface GeneralSettings {
  companyName: string;
  companyLogo?: string;
  timezone: string;
  dateFormat: string;
  currency: string;
  language: string;
  defaultAssignmentPeriod: number;
  lowStockThreshold: number;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
  pushNotifications: boolean;
  assignmentReminders: boolean;
  returnReminders: boolean;
  repairUpdates: boolean;
  lowStockAlerts: boolean;
}

export interface SecuritySettings {
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expirationDays: number;
  };
  twoFactorAuth: boolean;
  sessionTimeout: number; 
  maxLoginAttempts: number;
  auditLogs: boolean;
}

export interface BackupSettings {
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  retentionPeriod: number; 
  cloudStorage: boolean;
  lastBackup?: string;
}

export interface IntegrationSettings {
  activeDirectory: boolean;
  googleWorkspace: boolean;
  slackIntegration: boolean;
  teamsIntegration: boolean;
  customWebhooks: string[];
}