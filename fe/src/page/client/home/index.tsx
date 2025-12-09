import React, { useState, useMemo } from 'react';
import { Typography, Spin, Empty, Button } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';

// Import Components
import ArticleCard from './ArticleCard';
import FilterBar from './FilterBar';

// Import Hooks & Types
import { useArticles } from '@/hooks/useArticles';
// Giả sử bạn có hook lấy categories, nếu chưa có thì cần tạo hoặc fetch
// import { useCategories } from '@/hooks/useCategories'; 
import { IArticle } from '@/types/Article';
import { ICategory } from '@/types/Category';

const { Title } = Typography;

const Home: React.FC = () => {
  // 1. STATE QUẢN LÝ BỘ LỌC (Thay vì dùng Store)
  const [searchText, setSearchText] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  // 2. FETCH DỮ LIỆU
  // Nếu API hỗ trợ filter server-side, bạn truyền params vào đây: useArticles({ title: searchText, ... })
  // Ở đây mình làm Client-side filter để mượt mà theo code cũ của bạn
  const { data: responseData, isLoading, isError, refetch } = useArticles();
  
  // Fake dữ liệu categories (Bạn cần thay bằng hook useCategories thực tế)
  // const { data: categories = [] } = useCategories(); 
  const categories: ICategory[] = []; // Tạm thời để mảng rỗng để không lỗi

  // 3. XỬ LÝ DỮ LIỆU AN TOÀN (Fix lỗi Type như trong ảnh)
  // API có thể trả về { data: [...] } hoặc { articles: [...] } hoặc mảng trực tiếp
  const allArticles: IArticle[] = useMemo(() => {
    if (!responseData) return [];
    
    // Kiểm tra các trường hợp trả về của API
    const source = (responseData as any).articles || responseData;
    
    if (Array.isArray(source)) {
      return source;
    }
    return [];
  }, [responseData]);

  // 4. LOGIC FILTER (Lọc dữ liệu tại client)
  const filteredArticles = useMemo(() => {
    return allArticles.filter((article) => {
      // Lọc theo từ khóa tìm kiếm
      if (searchText && !article.title.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      // Lọc theo danh mục (so sánh ID)
      if (categoryId && article.category?.id !== categoryId) {
        return false;
      }
      // Lọc theo trạng thái
      if (status && article.status !== status) {
        return false;
      }
      return true;
    });
  }, [allArticles, searchText, categoryId, status]);

  // Handler thay đổi bộ lọc
  const handleSearch = (value: string) => setSearchText(value);
  const handleCategoryChange = (id: string) => setCategoryId(id);
  const handleStatusChange = (val: string) => setStatus(val);

  // Render lỗi
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-red-500 mb-4">Đã có lỗi xảy ra khi tải dữ liệu.</p>
        <Button icon={<ReloadOutlined />} onClick={() => refetch()}>Thử lại</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* --- HEADER & FILTER SECTION --- */}
      <div className="bg-white shadow-sm sticky top-0 z-20 px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
            <Title level={3} style={{ margin: 0 }}>Khám phá bài viết</Title>
            <span className="text-gray-500 text-sm mt-2 md:mt-0">
              Hiển thị {filteredArticles.length} kết quả
            </span>
          </div>

          {/* Truyền Props xuống FilterBar */}
          <FilterBar 
            categories={categories}
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            onStatusChange={handleStatusChange}
          />
        </div>
      </div>

      {/* --- MAIN CONTENT (GRID VIEW) --- */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" tip="Đang tải bài viết..." />
          </div>
        ) : filteredArticles.length === 0 ? (
          // Hiển thị khi không có kết quả
          <div className="bg-white rounded-xl p-12 text-center shadow-sm">
            <Empty description="Không tìm thấy bài viết nào phù hợp" />
            {(searchText || categoryId || status) && (
              <Button 
                type="link" 
                onClick={() => {
                  setSearchText('');
                  setCategoryId(null);
                  setStatus(null);
                }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          // Grid Layout cho Cards
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard article={article} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;