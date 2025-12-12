import React, { useMemo } from 'react';
import { IArticleBackend } from '@/types/Article';
import { TrendingUp, MapPin, DollarSign, Calendar } from 'lucide-react';

interface SavedArticlesStatsProps {
  articles: IArticleBackend[];
}

const SavedArticlesStats: React.FC<SavedArticlesStatsProps> = React.memo(({ articles }) => {
  const stats = useMemo(() => {
    if (articles.length === 0) {
      return {
        total: 0,
        avgPrice: 0,
        locations: 0,
        recent: 0,
      };
    }

    // Calculate average price
    const avgPrice = Math.round(
      articles.reduce((sum, article) => sum + article.price, 0) / articles.length / 1000000,
    );

    // Count unique locations (based on category or summary)
    const locations = new Set(articles.map((article) => article.categoryID?.categoryName || 'Khác'))
      .size;

    // Count recent articles (last 7 days)
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const recent = articles.filter((article) => new Date(article.createdAt) > weekAgo).length;

    return {
      total: articles.length,
      avgPrice,
      locations,
      recent,
    };
  }, [articles]);

  const statCards = [
    {
      icon: TrendingUp,
      label: 'Tổng tin đã lưu',
      value: stats.total,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      icon: DollarSign,
      label: 'Giá TB (triệu)',
      value: stats.avgPrice > 0 ? `${stats.avgPrice}` : 'N/A',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      icon: MapPin,
      label: 'Khu vực',
      value: `${stats.locations}`,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      icon: Calendar,
      label: 'Mới trong tuần',
      value: stats.recent,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
    },
  ];

  if (articles.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
      {statCards.map((stat, index) => (
        <div
          key={index}
          className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 group cursor-pointer hover:-translate-y-1"
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

          {/* Progress indicator */}
          <div className="mt-3 h-1 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full bg-linear-to-r ${stat.color} transition-all duration-1000 ease-out`}
              style={{ width: '75%' }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
});

SavedArticlesStats.displayName = 'SavedArticlesStats';

export default SavedArticlesStats;
