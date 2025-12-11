import React, { useState, useMemo } from 'react';
import { Typography, Spin, Empty, Button, Tabs, Tag } from 'antd';
import { RotateCcw, TrendingUp, Clock, Star } from 'lucide-react';

// Import Components
import ArticleCard from './ArticleCard';
import FilterBar from './FilterBar';
import HeroSection from './HeroSection';
import QuickStats from './QuickStats';
import TagFilter from './TagFilter';

// Import Hooks & Types
import { useArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useTags } from '@/hooks/useTags';
import { IArticle } from '@/types/Article';

const { Title } = Typography;

const Home: React.FC = () => {
  // 1. STATE QUẢN LÝ BỘ LỌC
  const [searchText, setSearchText] = useState('');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('all');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{ min?: number; max?: number }>({});
  const [areaRange, setAreaRange] = useState<{ min?: number; max?: number }>({});
  const [page, setPage] = useState(1);
  const [limit] = useState(12);

  // 2. BUILD QUERY PARAMS cho API
  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit,
      status : "Published",
    };

    // Search
    if (searchText) {
      params.search = searchText;
    }

    // Category
    if (categoryId) {
      params.categoryID = categoryId;
    }

    // Tags (gửi dạng array query: ?tags=ID1&tags=ID2)
    if (selectedTags.length > 0) {
      params.tags = selectedTags; // Axios sẽ tự convert thành ?tags=ID1&tags=ID2
    }

    // Price Range
    if (priceRange.min !== undefined) {
      params.minPrice = priceRange.min;
    }
    if (priceRange.max !== undefined) {
      params.maxPrice = priceRange.max;
    }

    // Area Range
    if (areaRange.min !== undefined) {
      params.minArea = areaRange.min;
    }
    if (areaRange.max !== undefined) {
      params.maxArea = areaRange.max;
    }

    // Sort theo tab
    switch (activeTab) {
      case 'new':
        params.sort = 'newest';
        break;
      case 'featured':
        // Có thể thêm filter isFeatured nếu API hỗ trợ
        params.isFeatured = true;
        params.sort = 'newest';
        break;
      case 'trending':
        params.sort = 'views'; // hoặc 'popular'
        break;
      default:
        params.sort = 'newest';
        break;
    }

    return params;
  }, [searchText, categoryId, status, selectedTags, priceRange, areaRange, activeTab, page, limit]);

  // 3. FETCH DỮ LIỆU với Query Params
  const { data: responseData, isLoading, isError, refetch } = useArticles(queryParams);

  // Fetch Categories & Tags
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: tags = [], isLoading: tagsLoading } = useTags();

  // 3. XỬ LÝ DỮ LIỆU
  const allArticles: IArticle[] = useMemo(() => {
    if (!responseData) return [];
    const source = (responseData as any).articles || responseData;
    if (Array.isArray(source)) {
      return source;
    }
    return [];
  }, [responseData]);

  // 4. LOGIC FILTER
  const filteredArticles = useMemo(() => {
    let filtered = allArticles.filter((article) => {
      if (searchText && !article.title.toLowerCase().includes(searchText.toLowerCase())) {
        return false;
      }
      if (categoryId && article.categoryID?.id !== categoryId) {
        return false;
      }
      // Filter by tags (nếu article có tags array)
      if (selectedTags.length > 0) {
        const articleTagIds = (article as any).tags?.map((t: any) => t.id || t._id) || [];
        const hasMatchingTag = selectedTags.some((tagId) => articleTagIds.includes(tagId));
        if (!hasMatchingTag) {
          return false;
        }
      }
      return true;
    });

    // Filter by tab
    const now = new Date();
    switch (activeTab) {
      case 'new':
        // Tin mới (7 ngày gần nhất)
        filtered = filtered.filter((article) => {
          const createdDate = new Date(article.createdAt);
          const diffTime = now.getTime() - createdDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        });
        break;
      case 'featured':
        // Tin nổi bật (giả sử có trường isFeatured)
        filtered = filtered.filter((article) => (article as any).isFeatured);
        break;
      case 'trending':
        // Tin hot (giả sử có trường views)
        filtered = filtered.sort((a, b) => ((b as any).views || 0) - ((a as any).views || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [allArticles, searchText, categoryId, status, activeTab, selectedTags]);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchText(value);
    setPage(1); // Reset về trang 1 khi search
  };

  const handleCategoryChange = (id: string) => {
    setCategoryId(id);
    setPage(1);
  };

  const handleTagToggle = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
    setPage(1);
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    setPriceRange({ min, max });
    setPage(1);
  };

  const handleAreaRangeChange = (min?: number, max?: number) => {
    setAreaRange({ min, max });
    setPage(1);
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearchText('');
    setCategoryId(null);
    setActiveTab('all');
    setSelectedTags([]);
    setPriceRange({});
    setAreaRange({});
    setPage(1);
  };

  // Render lỗi
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-red-500 mb-4">Đã có lỗi xảy ra khi tải dữ liệu.</p>
        <Button icon={<RotateCcw />} onClick={() => refetch()}>
          Thử lại
        </Button>
      </div>
    );
  }

  // Loading state cho categories
  const isLoadingData = isLoading || categoriesLoading || tagsLoading;

  return (
    <div className="min-h-screen bg-linear-to-b from-orange-50/30 to-white">
      {/* --- HERO SECTION --- */}
      <HeroSection onSearch={handleSearch} />

      {/* --- QUICK STATS --- */}
      <QuickStats totalArticles={allArticles.length} />

      {/* --- QUICK CATEGORY CHIPS --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Tag
            color={!categoryId ? 'orange' : 'default'}
            className="cursor-pointer px-4 py-1.5 text-sm rounded-full"
            onClick={() => setCategoryId(null)}
          >
            Tất cả
          </Tag>
          {categoriesLoading ? (
            <Spin size="small" />
          ) : (
            categories.map((cat) => (
              <Tag
                key={cat.id}
                color={categoryId === cat.id ? 'orange' : 'default'}
                className="cursor-pointer px-4 py-1.5 text-sm rounded-full whitespace-nowrap"
                onClick={() => setCategoryId(cat.id)}
              >
                {cat.categoryName}
              </Tag>
            ))
          )}
        </div>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 pb-20">
        {/* Filter Section */}
        <div className="bg-white rounded-2xl shadow-sm p-4 md:p-6 mb-6 border border-gray-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-3">
              <Title level={4} style={{ margin: 0 }} className="text-gray-800">
                Khám phá bất động sản
              </Title>
              <span className="px-3 py-1 bg-orange-100 text-orange-600 text-sm font-semibold rounded-full">
                {filteredArticles.length} tin
              </span>
            </div>

            {/* Tabs for sorting */}
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              items={[
                {
                  key: 'all',
                  label: (
                    <span className="flex items-center gap-1.5">
                      <TrendingUp size={16} />
                      Tất cả
                    </span>
                  ),
                },
                {
                  key: 'new',
                  label: (
                    <span className="flex items-center gap-1.5">
                      <Clock size={16} />
                      Mới nhất
                    </span>
                  ),
                },
                {
                  key: 'featured',
                  label: (
                    <span className="flex items-center gap-1.5">
                      <Star size={16} />
                      Nổi bật
                    </span>
                  ),
                },
                {
                  key: 'trending',
                  label: (
                    <span className="flex items-center gap-1.5">
                      <TrendingUp size={16} />
                      Xu hướng
                    </span>
                  ),
                },
              ]}
              className="filter-tabs"
            />
          </div>

          {/* Advanced Filters */}
          <FilterBar
            categories={categories}
            onSearch={handleSearch}
            onCategoryChange={handleCategoryChange}
            onPriceRangeChange={handlePriceRangeChange}
            onAreaRangeChange={handleAreaRangeChange}
          />

          {/* Tag Filter */}
          <div className="mt-4">
            <TagFilter
              tags={tags}
              selectedTags={selectedTags}
              onTagToggle={handleTagToggle}
              loading={tagsLoading}
            />
          </div>
        </div>

        {/* Articles Grid */}
        {isLoadingData ? (
          <div className="flex flex-col justify-center items-center h-96 bg-white rounded-2xl">
            <Spin size="large" />
            <p className="mt-4 text-gray-500">Đang tải bài viết...</p>
          </div>
        ) : filteredArticles.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-sm">
            <Empty
              description={
                <div>
                  <p className="text-gray-600 mb-2">Không tìm thấy bài viết nào phù hợp</p>
                  <p className="text-sm text-gray-400">
                    Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                  </p>
                </div>
              }
            />
            {(searchText || categoryId || status || selectedTags.length > 0) && (
              <Button
                type="primary"
                className="mt-4 bg-orange-500 hover:bg-orange-600 border-none"
                onClick={handleResetFilters}
              >
                Xóa tất cả bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {filteredArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        )}
      </div>

      {/* Add custom CSS for tabs */}
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
