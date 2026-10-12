export const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
};

export const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString;
};

export const getStatusColorClass = (status) => {
  const s = String(status || '').toLowerCase();
  if (s.includes('normal') || s.includes('reviewed') || s.includes('taken') || s.includes('safe')) {
    return 'status-badge-green';
  }
  if (s.includes('attention') || s.includes('upcoming') || s.includes('borderline') || s.includes('moderate')) {
    return 'status-badge-amber';
  }
  if (s.includes('abnormal') || s.includes('missed') || s.includes('high') || s.includes('severe')) {
    return 'status-badge-red';
  }
  return 'status-badge-neutral';
};
