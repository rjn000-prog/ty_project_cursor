import React from 'react';

export const ClubCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden animate-pulse">
    <div className="h-2 bg-gray-200"></div>
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div>
            <div className="h-5 w-32 bg-gray-200 rounded mb-2"></div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded"></div>
        <div className="h-4 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
);

export const EventCardSkeleton = () => (
  <div className="events-event-card events-skeleton">
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
      <div className="skeleton-line" style={{ height: 20, width: '70%' }} />
      <div className="skeleton-line" style={{ height: 24, width: 70, borderRadius: 20 }} />
    </div>
    <div className="skeleton-line" style={{ height: 14, width: 120, marginBottom: 16 }} />
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
      <div className="skeleton-line" style={{ height: 14, width: '90%' }} />
      <div className="skeleton-line" style={{ height: 14, width: '75%' }} />
      <div className="skeleton-line" style={{ height: 14, width: '60%' }} />
    </div>
    <div className="skeleton-line" style={{ height: 14, width: '85%', marginBottom: 20, flex: 1 }} />
    <div className="skeleton-line" style={{ height: 44, width: '100%', borderRadius: 10 }} />
  </div>
);