import React, { useMemo } from 'react';
import HeroSection from './HeroSection';
import QuickStats from './QuickStats';
import { useArticles } from '@/hooks/useArticles';
import { IArticle } from '@/types/Article';
import { useQueryStore } from '@/store/querry-store';

const Home: React.FC = () => {
  // Lấy state từ Zustand store
  const searchText = useQueryStore((s) => s.searchText);

  // Fetch articles với searchText từ store
  const {
    data: responseData,
    isLoading,
    isError,
  } = useArticles({
    search: searchText,
    status: 'Published',
  });

  // Parse articles từ response
  const allArticles: IArticle[] = useMemo(() => {
    if (!responseData) return [];
    const source = (responseData as any).articles || responseData;
    if (Array.isArray(source)) {
      return source;
    }
    return [];
  }, [responseData]);

  return (
    <div className="min-h-screen bg-linear-to-b` from-orange-50/30 to-white">
      <HeroSection />
      <QuickStats totalArticles={allArticles.length} />
      <style>{`
        .filter-tabs .ant-tabs-nav {
          margin: 0 !important;
        }
        .filter-tabs .ant-tabs-tab {
          padding: 8px 16px !important;
          font-size: 14px !important;
        }
        .filter-tabs .ant-tabs-tab-active {
          background: #fff7ed !important;
          border-radius: 8px !important;
        }
        .filter-tabs .ant-tabs-ink-bar {
          display: none !important;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Home;
