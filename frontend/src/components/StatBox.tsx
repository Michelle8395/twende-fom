import React from 'react';

interface StatBoxProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color?: string;
}

const StatBox: React.FC<StatBoxProps> = ({ label, value, icon, color = 'var(--text-main)' }) => {
  return (
    <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
        {icon && <div style={{ color: color, opacity: 0.8 }}>{icon}</div>}
      </div>
      <div style={{ fontSize: '1.5rem', fontWeight: '800', color: color }}>{value}</div>
    </div>
  );
};

export default StatBox;
