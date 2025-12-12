import React from 'react';
import { TrendingUp, Clock, MapPin, DollarSign } from 'lucide-react';

interface QuickStatsProps {
  totalArticles?: number;
}

const QuickStats: React.FC<QuickStatsProps> = ({ totalArticles = 0 }) => {
  const stats = [
    {
      icon: TrendingUp,
      label: 'Tổng tin đăng',
      value: totalArticles.toLocaleString(),
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      icon: Clock,
      label: 'Tin mới trong tuần',
      value: 'N/A',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      icon: DollarSign,
      label: 'Giá TB (triệu/tháng)',
      value: 'N/A',
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
    {
      icon: MapPin,
      label: 'Khu vực',
      value: '63+',
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 -mt-8 relative z-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer hover:-translate-y-1"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl ${stat.bgColor} flex items-center justify-center group-hover:scale-110 transition-transform`}
              >
                <stat.icon className={stat.textColor} size={20} />
              </div>
            </div>

            <div className="space-y-1">
              <div className={`text-2xl md:text-3xl font-bold ${stat.textColor}`}>{stat.value}</div>
              <div className="text-xs md:text-sm text-gray-500 font-medium">{stat.label}</div>
            </div>

            <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full bg-linear-to-r ${stat.color} transition-all duration-1000 ease-out`}
                style={{ width: '75%' }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default QuickStats;
