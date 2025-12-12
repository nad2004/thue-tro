import React from 'react';
import { Empty, Spin, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import SavedArticleCard from './SavedArticleCard';
import { IArticleBackend } from '@/types/Article';

interface SavedArticlesGridProps {
  articles: IArticleBackend[];
  loading: boolean;
  onUnsave: (id: string) => void;
  onView: (id: string) => void;
}

const SavedArticlesGrid: React.FC<SavedArticlesGridProps> = React.memo(
  ({ articles, loading, onUnsave, onView }) => {
    const navigate = useNavigate();

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm">
          <Spin size="large" />
          <p className="mt-4 text-gray-500">Đang tải tin đã lưu...</p>
        </div>
      );
    }

    if (articles.length === 0) {
      return (
        <div className="bg-white rounded-2xl shadow-sm p-12">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <div className="text-center">
                <p className="text-gray-600 text-lg mb-2">Chưa có tin đã lưu</p>
                <p className="text-gray-400 text-sm mb-6">
                  Hãy khám phá và lưu các bất động sản bạn quan tâm
                </p>
              </div>
            }
          >
            <Button
              type="primary"
              size="large"
              icon={<Search size={18} />}
              onClick={() => navigate('/')}
              className="bg-linear-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 border-none rounded-xl h-12 px-6"
            >
              Khám phá ngay
            </Button>
          </Empty>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {articles.map((article) => (
          <SavedArticleCard
            key={article._id}
            article={article}
            onUnsave={onUnsave}
            onView={onView}
          />
        ))}
      </div>
    );
  },
);

SavedArticlesGrid.displayName = 'SavedArticlesGrid';

export default SavedArticlesGrid;
