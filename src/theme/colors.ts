export const colors = {
  cream: '#FBF7F1',
  paper: '#FFFDF9',
  brown: '#4A2C1A',
  brownMuted: '#6B4A35',
  brownLight: '#8B6B52',
  gold: '#C2410C',
  goldSoft: '#EA580C',
  sand: '#F3E6D6',
  white: '#FFFFFF',
  border: '#E8D9C8',
  success: '#15803D',
  warning: '#B45309',
  info: '#1D4ED8',
  danger: '#B91C1C',
  muted: '#9A8474',
};

export const statusColors: Record<string, { bg: string; text: string; label: string }> = {
  pending: { bg: '#FEF3C7', text: '#92400E', label: 'Pending' },
  preparing: { bg: '#DBEAFE', text: '#1E40AF', label: 'Preparing' },
  completed: { bg: '#DCFCE7', text: '#166534', label: 'Completed' },
  cancelled: { bg: '#F3F4F6', text: '#4B5563', label: 'Cancelled' },
};
