import React from 'react'

const SaveStatusIndicator = ({ status }: { status: 'saved' | 'pending' | 'saving' | 'error' }) => {
    const getStatusColor = () => {
      switch (status) {
        case 'saved': return 'bg-green-500';
        case 'pending': return 'bg-orange-500';
        case 'saving': return 'bg-blue-500';
        case 'error': return 'bg-red-500';
      }
    };
  
    return (
      <div className="flex items-center space-x-2">
        <div className={`w-2 h-2 rounded-full ${getStatusColor()}`}></div>
        <span>{status.charAt(0).toUpperCase() + status.slice(1)}</span>
      </div>
    );
  };

export default SaveStatusIndicator