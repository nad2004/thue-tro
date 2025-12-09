import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Maximize, Heart, User } from 'lucide-react';
import { Avatar } from 'antd'; // Hoặc dùng thẻ img thường nếu ko muốn cài antd
import { IArticle } from '@/types/Article';
// Interface tạm thời khớp với dữ liệu bạn đang có
interface ArticleCardProps {
  article: IArticle;
}
const ArticleCard = ({article}: ArticleCardProps) => {
  const [isSaved, setIsSaved] = useState(false);

  // Helper format giá
  const formatPrice = (price: number) => {
    if (!price) return 'Thỏa thuận';
    if (price >= 1000000) return `${(price / 1000000).toFixed(1)} triệu/tháng`;
    return `${price.toLocaleString()} đ/tháng`;
  };

  // Helper format thời gian
  const getTimeAgo = (dateInput?: string | Date) => {
    if (!dateInput) return 'Mới đăng';
    const date = new Date(dateInput);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 1) return 'Hôm nay';
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  return (
    <div className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* --- PHẦN HÌNH ẢNH (IMAGE COVER) --- */}
      <Link
        to={`/detail/${article.id}`}
        className="relative block aspect-4/3 overflow-hidden"
      >
        <img
          alt={article.title}
          src={
            article.thumbnail ||
            'https://via.placeholder.com/400x300?text=No+Image'
          }
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-linear-to-t from-black/50 to-transparent opacity-60" />

        {/* --- BADGE MẶC ĐỊNH (LUÔN HIỆN) --- */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {/* Badge Tin Nổi Bật / VIP */}
          <span className="bg-red-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md shadow-lg uppercase tracking-wide backdrop-blur-none">
            Tin Nổi Bật
          </span>

          {/* Badge Danh mục (Optional) */}
          {article.category?.categoryName && (
            <span className="bg-black/50 backdrop-blur-md text-white text-[10px] font-medium px-2.5 py-1 rounded-md w-fit">
              {article.category.categoryName}
            </span>
          )}
        </div>

        {/* Nút Yêu Thích (Heart) */}
        <button
          onClick={(e) => {
            e.preventDefault();
            setIsSaved(!isSaved);
          }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-md transition-all hover:bg-white hover:scale-110 z-10"
        >
          <Heart
            size={16}
            className={`transition-colors ${
              isSaved ? 'fill-red-500 text-red-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Giá tiền hiển thị đè lên ảnh (Góc dưới trái) - Style kiểu Airbnb/Agoda */}
        <div className="absolute bottom-3 left-3 text-white z-10">
          <span className="text-lg font-bold text-shadow-sm">
            {formatPrice(article.price)}
          </span>
        </div>
      </Link>

      {/* --- PHẦN NỘI DUNG (CONTENT BODY) --- */}
      <div className="flex flex-col flex-1 p-4">
        {/* Tiêu đề */}
        <Link to={`/detail/${article.id}`} className="block mb-2">
          <h3 className="text-[15px] font-bold text-gray-800 leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
            {article.title}
          </h3>
        </Link>

        {/* Thông tin: Địa chỉ & Diện tích */}
        <div className="flex items-center justify-between text-gray-500 text-xs mb-4">
          <div className="flex items-center gap-1 overflow-hidden">
            <MapPin size={14} className="shrink-0 text-gray-400" />
            <span className="truncate">
              {article.summary || 'Khu vực trung tâm'}
            </span>
          </div>
          <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded border border-gray-100 shrink-0 font-medium text-gray-600">
            <Maximize size={12} />
            {article.area} m²
          </div>
        </div>

        {/* Footer: User & Ngày đăng */}
        <div className="mt-auto pt-3 border-t border-gray-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Avatar User */}
            <Avatar
              size={24}
              src={article.author?.avatarUrl}
              icon={<User size={14} />}
              className="bg-gray-200"
            />
            <span className="text-xs font-medium text-gray-700 truncate max-w-[120px]">
              {article.author?.fullName || 'Người đăng'}
            </span>
          </div>
          <span className="text-[11px] text-gray-400">
            {getTimeAgo(article.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ArticleCard;
