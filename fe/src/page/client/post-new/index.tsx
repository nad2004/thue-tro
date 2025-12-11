import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Spin, Result, Button } from 'antd';
import { Home } from 'lucide-react';

import PostArticleForm from './PostArticleForm';
import { useCategories } from '@/hooks/useCategories';
import { useTags } from '@/hooks/useTags';
import { useCreateArticle } from '@/hooks/useArticles'; // Import hook create từ file useArticles
import { CreateArticlePayload } from '@/types/Article';

const PostArticlePage: React.FC = () => {
  const navigate = useNavigate();

  // 1. Fetch dữ liệu cần thiết
  const { data: categories = [], isLoading: isCatLoading, isError: isCatError } = useCategories();
  const { data: tags = [], isLoading: isTagLoading } = useTags();
  
  // 2. Hook Create Article
  const createArticleMutation = useCreateArticle();

  // 3. Xử lý Submit từ Form
  const handleCreateArticle = async (values: CreateArticlePayload) => {
    try {
      await createArticleMutation.mutateAsync(values);
      // Hook useCreateArticle đã có message.success và invalidateQueries
      
      // Chuyển hướng về trang chủ hoặc trang quản lý tin sau khi đăng thành công
      setTimeout(() => {
        navigate('/my-posts'); // Hoặc '/'
      }, 1500);
    } catch (error) {
      // Lỗi đã được xử lý trong onError của mutation
      console.error("Failed to post article", error);
    }
  };

  // 4. Loading States
  if (isCatLoading || isTagLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  // 5. Error State
  if (isCatError) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <Result
          status="500"
          title="Không thể tải dữ liệu"
          subTitle="Vui lòng kiểm tra kết nối mạng và thử lại."
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Tải lại trang
            </Button>
          }
        />
      </div>
    );
  }

  // 6. Render Form
  return (
    <div className="min-h-screen bg-[#f4f4f4] py-8 px-4">
      {/* Breadcrumb hoặc nút Back */}
      <div className="max-w-5xl mx-auto mb-4">
        <Button 
          type="link" 
          icon={<Home size={16}/>} 
          onClick={() => navigate('/')}
          className="pl-0 text-gray-600 hover:text-orange-600"
        >
          Trở về trang chủ
        </Button>
      </div>

      <PostArticleForm
        categories={categories}
        tags={tags}
        onSubmit={handleCreateArticle}
        isSubmitting={createArticleMutation.isPending}
      />
    </div>
  );
};

export default PostArticlePage;