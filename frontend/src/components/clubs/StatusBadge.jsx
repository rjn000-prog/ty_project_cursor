import React from 'react';

const StatusBadge = ({ status }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return { color: 'status-approved' };
      case 'pending':
      case 'registered':
        return { color: 'status-pending' };
      case 'rejected':
        return { color: 'status-rejected' };
      default:
        return { color: 'status-default' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`status-badge ${config.color}`}>
      {status}
    </span>
  );
};

export default StatusBadge;
