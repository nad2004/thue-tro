import React, { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

import { useSavedArticles, useToggleSaveArticle } from '@/hooks/useUsers';
import { useCategories } from '@/hooks/useCategories';

import SavedArticlesHeader from './SavedArticlesHeader';
import SavedArticlesStats from './SavedArticlesStats';
import SavedArticlesFilter from './SavedArticlesFilter';
import SavedArticlesGrid from './SavedArticlesGrid';

const SavedArticlesPage: React.FC = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [sortBy, setSortBy] = useState<string>('newest');

  const { data: savedArticles = [], isLoading } = useSavedArticles();
  const { data: categories = [] } = useCategories();
  const toggleSave = useToggleSaveArticle();

  const filteredArticles = useMemo(() => {
    let filtered = [...savedArticles];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (article) =>
          article.title.toLowerCase().includes(query) ||
          article.summary?.toLowerCase().includes(query),
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter((article) => article.categoryID?._id === selectedCategory);
    }

    switch (sortBy) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'area-asc':
        filtered.sort((a, b) => a.area - b.area);
        break;
      case 'area-desc':
        filtered.sort((a, b) => b.area - a.area);
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  }, [savedArticles, searchQuery, selectedCategory, sortBy]);

  const handleSearch = useCallback((value: string) => {
    setSearchQuery(value);
  }, []);

  const handleCategoryChange = useCallback((categoryId: string | undefined) => {
    setSelectedCategory(categoryId);
  }, []);

  const handleSortChange = useCallback((sort: string) => {
    setSortBy(sort);
  }, []);

  const handleUnsave = useCallback(
    async (articleId: string) => {
      try {
        await toggleSave.mutateAsync(articleId);
      } catch (error) {
        console.log(error);
        message.error('Không thể bỏ lưu tin này');
      }
    },
    [toggleSave],
  );

  const handleView = useCallback(
    (articleId: string) => {
      navigate(`/detail/${articleId}`);
    },
    [navigate],
  );

  return (
    <div className="min-h-screen bg-linear-to-b from-pink-50 to-white">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <SavedArticlesHeader totalCount={savedArticles.length} />

        <SavedArticlesStats articles={filteredArticles} />

        <SavedArticlesFilter
          categories={categories}
          onSearch={handleSearch}
          onCategoryChange={handleCategoryChange}
          onSortChange={handleSortChange}
        />

        <SavedArticlesGrid
          articles={filteredArticles}
          loading={isLoading}
          onUnsave={handleUnsave}
          onView={handleView}
        />
      </div>
    </div>
  );
};

export default SavedArticlesPage;
