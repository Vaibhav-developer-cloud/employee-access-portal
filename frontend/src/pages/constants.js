// Access Types
export const ACCESS_TYPES = [
  { value: 'VPN', label: 'VPN Access' },
  { value: 'DATABASE', label: 'Database Access' },
  { value: 'ADMIN_PORTAL', label: 'Admin Portal Access' },
  { value: 'SERVER', label: 'Server Access' },
];

// Priority Levels
export const PRIORITY_LEVELS = [
  { value: 'LOW', label: 'Low' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'HIGH', label: 'High' },
  { value: 'URGENT', label: 'Urgent' },
];

// Request Status
export const REQUEST_STATUS = {
  PENDING: 'PENDING',
  APPROVED: 'APPROVED',
  REJECTED: 'REJECTED',
};

export const STATUS_COLORS = {
  PENDING: '#ff9800',
  APPROVED: '#4caf50',
  REJECTED: '#f44336',
};

export const STATUS_LABELS = {
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};

// Timeline Actions
export const TIMELINE_ACTIONS = {
  REQUEST_CREATED: 'Request Created',
  PENDING: 'Pending',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
};
