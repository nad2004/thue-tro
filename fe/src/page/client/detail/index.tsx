import { useParams, useNavigate } from 'react-router-dom';
import { 
  Row, Col, Button, Typography, Tag, 
  Breadcrumb, Carousel, 
  Image, Skeleton, message, Card 
} from 'antd';
import { 
  MapPin, Clock, Heart, Share2, 
  Maximize2, ShieldCheck, Home, 
  Info, ChevronLeft 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { useState } from 'react';
import { useArticle } from '@/hooks/useArticles';
import OwnerInfo from './OwnerInfo';
import QuickChatBar from './QuickChatBar';

const { Title, Text } = Typography;

export default function DetailPage() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data: article, isLoading } = useArticle(id || '');
  const [messageApi, contextHolder] = message.useMessage();

  // --- Helpers ---
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 1000000).toFixed(1)} triệu/tháng`;
    }
    return `${price.toLocaleString('vi-VN')} đ/tháng`;
  };

  const getTimeAgo = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: vi });
    } catch (e) {
      return 'Vừa xong';
    }
  };

  const handleSave = () => messageApi.success('Đã lưu tin vào danh sách quan tâm');
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    messageApi.success('Đã sao chép liên kết');
  };

  // --- Loading State ---
  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    );
  }

  // --- Not Found ---
  if (!article) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <Title level={3}>Không tìm thấy tin đăng</Title>
        <Text type="secondary">Tin đăng này có thể đã bị xóa hoặc không tồn tại.</Text>
        <Button type="primary" className="mt-4" onClick={() => navigate(-1)} icon={<ChevronLeft size={16}/>}>
          Quay lại
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-24 md:pb-10">
      {contextHolder}
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Breadcrumb */}
        <Breadcrumb 
          className="mb-4"
          items={[
            { title: <a href="/" className="flex items-center gap-1"><Home size={14}/> Trang chủ</a> },
            { title: article.categoryID?.categoryName || 'Chi tiết' },
            { title: <span className="text-gray-500 truncate max-w-[200px] inline-block align-bottom">{article.title}</span> },
          ]}
        />

        <Row gutter={[24, 24]}>
          {/* --- LEFT COLUMN (Main Content) --- */}
          <Col xs={24} lg={16}>
            
            {/* 1. Image Carousel & Gallery */}
            <div className="rounded-xl overflow-hidden shadow-sm mb-6 bg-white relative group">
              {article.images && article.images.length > 0 ? (
                 <Image.PreviewGroup>
                    <Carousel autoplay effect="fade" dotPosition="bottom">
                      {article.images.map((img, index) => (
                        <div key={index} className="relative h-[300px] md:h-[450px]">
                          <Image 
                            src={img} 
                            alt={article.title}
                            className="object-cover w-full h-full"
                           
                            preview={{ mask: <div className="text-white flex items-center gap-2"><Maximize2 size={16}/> Xem phóng to</div> }}
                          />
                        </div>
                      ))}
                    </Carousel>
                 </Image.PreviewGroup>
              ) : (
                <div className="h-[300px] bg-gray-200 flex items-center justify-center text-gray-400">
                  Chưa có hình ảnh
                </div>
              )}
              <div className="absolute bottom-4 right-4 z-10">
                <Tag color="rgba(0,0,0,0.6)" className="text-white border-0 backdrop-blur-md">
                   {article.images?.length || 0} ảnh
                </Tag>
              </div>
            </div>

            {/* 2. Main Info */}
            <Card bordered={false} className="shadow-sm rounded-xl mb-6">
               <div className="mb-2">
                 {article.status === 'Published' && (
                    <Tag color="blue" className="mb-2">TIN ĐANG HIỂN THỊ</Tag>
                 )}
                 <Title level={3} style={{ margin: 0, color: '#222' }}>{article.title}</Title>
               </div>

               {/* Meta line */}
               <div className="flex items-center gap-4 text-gray-500 text-sm mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin size={16} className="text-gray-400" />
                    <span>{article.categoryID?.categoryName}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock size={16} className="text-gray-400" />
                    <span>{getTimeAgo(article.createdAt)}</span>
                  </div>
               </div>

               {/* Price & Area Blocks */}
               <div className="flex flex-wrap items-center gap-6 md:gap-12 p-4 bg-gray-50 rounded-lg border border-gray-100 mb-6">
                  <div>
                    <Text type="secondary" className="block text-xs uppercase mb-1">Mức giá</Text>
                    <Text className="text-[#e03c31] text-2xl font-bold">{formatPrice(article.price)}</Text>
                  </div>
                  <div className="w-px h-10 bg-gray-200 hidden md:block" />
                  <div>
                    <Text type="secondary" className="block text-xs uppercase mb-1">Diện tích</Text>
                    <Text strong className="text-xl">{article.area} m²</Text>
                  </div>
                  <div className="w-px h-10 bg-gray-200 hidden md:block" />
                  <div>
                    <Text type="secondary" className="block text-xs uppercase mb-1">Mã tin</Text>
                    <Text type="secondary">#{article.id.slice(-6).toUpperCase()}</Text>
                  </div>
               </div>

               {/* Actions */}
               <div className="flex gap-3">
                 <Button icon={<Heart size={16} />} onClick={handleSave} size="large">Lưu tin</Button>
                 <Button icon={<Share2 size={16} />} onClick={handleShare} size="large">Chia sẻ</Button>
               </div>
            </Card>

            {/* 3. Description */}
            <Card bordered={false} className="shadow-sm rounded-xl mb-6">
              <Title level={4}>Thông tin mô tả</Title>
              
              <div className={`relative ${!isExpanded ? 'max-h-[150px] overflow-hidden' : ''}`}>
                <div 
                  className="text-gray-700 text-base leading-relaxed article-content"
                  // Render HTML tại đây
                  dangerouslySetInnerHTML={{ __html: article.content }} 
                />
                
                {/* Hiệu ứng mờ dần khi chưa mở rộng */}
                {!isExpanded && (
                  <div className="absolute bottom-0 left-0 w-full h-12 bg-linear-to-t from-white to-transparent" />
                )}
              </div>

              {/* Nút bấm Xem thêm / Thu gọn */}
              <div className="mt-2 text-center md:text-left">
                <Button 
                  type="link" 
                  className="p-0 font-medium"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? 'Thu gọn' : 'Xem thêm'}
                </Button>
              </div>
            </Card>

            {/* 4. Amenities */}
            {article.tags && article.tags.length > 0 && (
              <Card bordered={false} className="shadow-sm rounded-xl mb-6">
                <Title level={4}>Tiện ích</Title>
                <div className="flex flex-wrap gap-2 mt-4">
                  {article.tags.map((tag) => (
                    <Tag 
                      key={tag.id} 
                      className="px-3 py-1 text-sm bg-gray-50 border-gray-200 rounded-full flex items-center gap-2"
                    >
                      <Info size={14} className="text-blue-500"/> {tag.tagName}
                    </Tag>
                  ))}
                </div>
              </Card>
            )}
          </Col>

          {/* --- RIGHT COLUMN (Sidebar) --- */}
          <Col xs={24} lg={8}>
            <div className="sticky top-6 space-y-6">
              {/* Owner Info Component */}
              <OwnerInfo author={article.authorID} />

              {/* Safe Tips */}
              <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                <Text strong className="text-blue-800 flex items-center gap-2 mb-2">
                   <ShieldCheck size={18} /> Lưu ý an toàn
                </Text>
                <Text className="text-blue-800 text-sm block">
                  Không đặt cọc khi chưa xem nhà. Kiểm tra giấy tờ chính chủ kỹ lưỡng trước khi ký hợp đồng thuê trọ.
                </Text>
              </div>
            </div>
          </Col>
        </Row>
      </div>

      {/* Mobile Sticky Action Bar */}
      {article.authorID && <QuickChatBar author={article.authorID} />}
    </div>
  );
}