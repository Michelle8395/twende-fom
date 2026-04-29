import React from 'react';
import { CreditCard, Star, UserPlus, Info } from 'lucide-react';

interface ActivityItemProps {
  activity: {
    type: string;
    message: string;
    timestamp: string;
  };
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  const getIcon = () => {
    switch (activity.type) {
      case 'payment': return <CreditCard size={16} className="text-secondary" />;
      case 'milestone': return <Star size={16} className="text-primary" />;
      case 'info': return <UserPlus size={16} className="text-muted" />;
      default: return <Info size={16} className="text-muted" />;
    }
  };

  const getIconBg = () => {
    switch (activity.type) {
      case 'payment': return 'rgba(0, 229, 255, 0.1)';
      case 'milestone': return 'rgba(255, 87, 34, 0.1)';
      default: return 'rgba(255, 255, 255, 0.05)';
    }
  };

  return (
    <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', alignItems: 'flex-start' }}>
      <div style={{ 
        background: getIconBg(), 
        padding: '10px', 
        borderRadius: '12px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        flexShrink: 0
      }}>
        {getIcon()}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '2px' }}>{activity.message}</p>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
          {new Date(activity.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );
};

export default ActivityItem;
