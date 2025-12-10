import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Maximize, Heart, User, Eye, BadgeCheck, Wifi, ParkingCircle } from 'lucide-react';
import { Avatar, Tag, Tooltip } from 'antd';
import { IArticle } from '@/types/Article';

interface ArticleCardProps {
  article: IArticle;
}

const ArticleCard = ({ article }: ArticleCardProps) => {
  const [isSaved, setIsSaved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Helper format giá
  const formatPrice = (price: number) => {
    if (!price) return 'Thỏa thuận';
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)} triệu`;
    return `${price.toLocaleString()} đ`;
  };

  // Helper format thời gian
  const getTimeAgo = (dateInput?: string | Date) => {
    if (!dateInput) return 'Mới đăng';
    const date = new Date(dateInput);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hôm nay';
    if (diffDays === 1) return 'Hôm qua';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} tuần trước`;
    return date.toLocaleDateString('vi-VN');
  };

  // Check if new (within 3 days)
  const isNew = () => {
    if (!article.createdAt) return false;
    const date = new Date(article.createdAt);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = diffTime / (1000 * 60 * 60 * 24);
    return diffDays <= 3;
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 relative">
      {/* --- IMAGE SECTION --- */}
      <Link
        to={`/detail/${article.id}`}
        className="relative block aspect-[4/3] overflow-hidden bg-gray-100"
      >
        {/* Image with Loading State */}
        <img
          alt={article.title}
          src={article.thumbnail || 'https://via.placeholder.com/400x300?text=No+Image'}
          className={`w-full h-full object-cover transition-all duration-700 ${
            imageLoaded ? 'scale-100 opacity-100' : 'scale-110 opacity-0'
          } group-hover:scale-110`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/20" />

        {/* Badges Container */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {/* VIP/Featured Badge */}
          {(article as any).isFeatured && (
            <span className="flex items-center gap-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-wide">
              <BadgeCheck size={12} />
              Nổi Bật
            </span>
          )}

          {/* New Badge */}
          {isNew() && (
            <span className="bg-green-500 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg shadow-md uppercase">
              Mới
            </span>
          )}

          {/* Category Badge */}
          {article.categoryID?.categoryName && (
            <Tag
              color="default"
              className="bg-black/40 backdrop-blur-md text-white text-[10px] font-medium border-0 rounded-lg"
            >
              {article.categoryID.categoryName}
            </Tag>
          )}
        </div>

        {/* Heart Button */}
        <Tooltip title={isSaved ? 'Bỏ lưu' : 'Lưu tin'}>
          <button
            onClick={(e) => {
              e.preventDefault();
              setIsSaved(!isSaved);
            }}
            className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-lg transition-all hover:bg-white hover:scale-110 active:scale-95 z-10 group/heart"
          >
            <Heart
              size={18}
              className={`transition-all ${
                isSaved
                  ? 'fill-red-500 text-red-500 scale-110'
                  : 'text-gray-600 group-hover/heart:text-red-500'
              }`}
            />
          </button>
        </Tooltip>

        {/* Price Tag - Bottom Left */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-3 py-1.5 shadow-lg">
            <span className="text-lg font-bold text-orange-600">{formatPrice(article.price)}</span>
            <span className="text-[10px] text-gray-500 ml-1">/tháng</span>
          </div>
        </div>

        {/* Views Counter - Bottom Right */}
        <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
          <Eye size={12} />
          <span>{(article as any).views || 0}</span>
        </div>
      </Link>

      {/* --- CONTENT SECTION --- */}
      <div className="flex flex-col flex-1 p-4">
        {/* Title */}
        <Link to={`/detail/${article.id}`} className="block mb-3 group/title">
          <h3 className="text-[15px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover/title:text-orange-600 transition-colors">
            {article.title}
          </h3>
        </Link>

        {/* Location & Area */}
        <div className="flex items-center justify-between mb-3 pb-3 border-b border-gray-100">
          <div className="flex items-center gap-1.5 overflow-hidden flex-1 mr-2">
            <MapPin size={14} className="shrink-0 text-gray-400" />
            <span className="text-xs text-gray-600 truncate">
              {article.summary || 'Khu vực trung tâm'}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2.5 py-1 rounded-lg shrink-0 font-semibold text-xs border border-orange-100">
            <Maximize size={12} />
            {article.area}m²
          </div>
        </div>

        {/* Amenities Icons */}
        <div className="flex items-center gap-3 mb-3">
          {[
            { icon: Wifi, label: 'Wifi' },
            { icon: ParkingCircle, label: 'Gửi xe' },
          ].map((amenity, index) => (
            <Tooltip key={index} title={amenity.label}>
              <div className="flex items-center gap-1 text-gray-400 hover:text-orange-500 transition-colors cursor-pointer">
                <amenity.icon size={14} />
              </div>
            </Tooltip>
          ))}
        </div>

        {/* Footer: Author & Time */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <Link
            to={`/profile/${article.authorID?.id}`}
            className="flex items-center gap-2 hover:opacity-75 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <Avatar
              size={28}
              src={article.authorID?.avatar}
              icon={<User size={14} />}
              className="bg-gradient-to-br from-orange-400 to-pink-400 border-2 border-white shadow"
            />
            <div className="flex flex-col leading-tight">
              <span className="text-xs font-semibold text-gray-700 truncate max-w-[100px]">
                {article.authorID?.fullName || 'Chủ nhà'}
              </span>
              {(article.authorID as any)?.isVerified && (
                <span className="text-[10px] text-green-600 flex items-center gap-0.5">
                  <BadgeCheck size={10} />
                  Đã xác minh
                </span>
              )}
            </div>
          </Link>

          <span className="text-[11px] text-gray-400 font-medium">
            {getTimeAgo(article.createdAt)}
          </span>
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-2xl border-2 border-orange-500 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
    </div>
  );
};

export default ArticleCard;
