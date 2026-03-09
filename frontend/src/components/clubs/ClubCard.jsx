import React from 'react';
import { Link } from 'react-router-dom';

const ClubCard = ({ club }) => {
  const getTypeBadgeColor = (type) => {
    switch (type) {
      case 'Technical': return 'bg-blue-100 text-blue-800';
      case 'Cultural': return 'bg-purple-100 text-purple-800';
      case 'Social': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300 overflow-hidden">
      <div 
        className="h-2 w-full"
        style={{ backgroundColor: club.bannerColor || '#3B82F6' }}
      ></div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">{club.logo}</div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{club.name}</h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeColor(club.type)}`}>
                {club.type}
              </span>
            </div>
          </div>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{club.description}</p>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">President:</span>
            <span className="ml-1">{club.president}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
            </svg>
            <span>{club.location}</span>
          </div>
          
          <div className="flex items-center text-gray-700">
            <svg className="w-4 h-4 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" clipRule="evenodd" />
            </svg>
            <span>{club.memberCount} members</span>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-100">
          <Link
            to={`/clubs/${club.id}`}
            className="block w-full text-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ClubCard;