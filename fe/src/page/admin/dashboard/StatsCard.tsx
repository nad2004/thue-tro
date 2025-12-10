import React from 'react';
import { Card, Statistic } from 'antd';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: string;
}

const StatsCard: React.FC<StatsCardProps> = ({ title, value, icon, color }) => {
  return (
    <Card bordered={false} className="shadow-sm hover:shadow-md transition-shadow">
      <Statistic
        title={title}
        value={value}
        prefix={<span style={{ color: color, marginRight: 8 }}>{icon}</span>}
        valueStyle={{ fontWeight: 'bold' }}
      />
    </Card>
  );
};

export default StatsCard;
