import { useMemo } from 'react';
import { Typography, Spin, Empty, Button, Tabs, Tag } from 'antd';
import { RotateCcw, TrendingUp } from 'lucide-react';
import TagFilter from './TagFilter';
import ArticleCard from './ArticleCard';
import FilterBar from './FilterBar';
import { useArticles } from '@/hooks/useArticles';
import { useCategories } from '@/hooks/useCategories';
import { useTags } from '@/hooks/useTags';
import { IArticle } from '@/types/Article';
import { useQueryStore } from '@/store/querry-store';

const { Title } = Typography;

const Article = () => {
  // ✅ Lấy tất cả state từ Zustand store
  const searchText = useQueryStore((s) => s.searchText);
  const categoryId = useQueryStore((s) => s.categoryId);
  const selectedTags = useQueryStore((s) => s.selectedTags);
  const activeTab = useQueryStore((s) => s.activeTab);
  const priceRange = useQueryStore((s) => s.priceRange);
  const areaRange = useQueryStore((s) => s.areaRange);
  const page = useQueryStore((s) => s.page);
  const limit = useQueryStore((s) => s.limit);

  const setSearchText = useQueryStore((s) => s.setSearchText);
  const setCategoryId = useQueryStore((s) => s.setCategoryId);
  const setSelectedTags = useQueryStore((s) => s.setSelectedTags);
  const setActiveTab = useQueryStore((s) => s.setActiveTab);
  const setPriceRange = useQueryStore((s) => s.setPriceRange);
  const setAreaRange = useQueryStore((s) => s.setAreaRange);
  const setPage = useQueryStore((s) => s.setPage);
  const resetFilters = useQueryStore((s) => s.resetFilters);

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleCategoryChange = (id: string | null) => {
    setCategoryId(id);
  };

  const handleTagToggle = (tagId: string) => {
    const newTags = selectedTags.includes(tagId)
      ? selectedTags.filter((id) => id !== tagId)
      : [...selectedTags, tagId];
    setSelectedTags(newTags);
  };

  const handlePriceRangeChange = (min?: number, max?: number) => {
    setPriceRange({ min, max });
  };

  const handleAreaRangeChange = (min?: number, max?: number) => {
    setAreaRange({ min, max });
  };

  const handleTabChange = (key: string) => {
    setActiveTab(key);
  };

  const queryParams = useMemo(() => {
    const params: any = {
      page,
      limit,
      status: 'Published',
    };

    if (searchText) params.search = searchText;
    if (categoryId) params.categoryID = categoryId;
    if (selectedTags.length > 0) params.tags = selectedTags.join(',');
    if (priceRange.min !== undefined) params.minPrice = priceRange.min;
    if (priceRange.max !== undefined) params.maxPrice = priceRange.max;
    if (areaRange.min !== undefined) params.minArea = areaRange.min;
    if (areaRange.max !== undefined) params.maxArea = areaRange.max;

    // Sort theo tab
    switch (activeTab) {
      case 'new':
        params.sort = 'newest';
        break;
      case 'featured':
        params.isFeatured = true;
        params.sort = 'newest';
        break;
      case 'trending':
        params.sort = 'views';
        break;
      default:
        params.sort = 'newest';
        break;
    }

    return params;
  }, [searchText, categoryId, selectedTags, priceRange, areaRange, activeTab, page, limit]);

  const { data: responseData, isLoading, isError, refetch } = useArticles(queryParams);
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: tags = [], isLoading: tagsLoading } = useTags();

  const allArticles: IArticle[] = useMemo(() => {
    if (!responseData) return [];
    const source = (responseData as any).articles || responseData;
    if (Array.isArray(source)) {
      return source;
    }
    return [];
  }, [responseData]);

  const filteredArticles = useMemo(() => {
    let filtered = allArticles;

    const now = new Date();
    switch (activeTab) {
      case 'new':
        filtered = filtered.filter((article) => {
          const createdDate = new Date(article.createdAt);
          const diffTime = now.getTime() - createdDate.getTime();
          const diffDays = diffTime / (1000 * 60 * 60 * 24);
          return diffDays <= 7;
        });
        break;
      case 'featured':
        filtered = filtered.filter((article) => (article as any).isFeatured);
        break;
      case 'trending':
        filtered = filtered.sort((a, b) => ((b as any).views || 0) - ((a as any).views || 0));
        break;
      default:
        break;
    }

    return filtered;
  }, [allArticles, activeTab]);

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

  const isLoadingData = isLoading || categoriesLoading || tagsLoading;

  return (
    <>
      {/* Category Tags */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Tag
            color={!categoryId ? 'orange' : 'default'}
            className="cursor-pointer px-4 py-1.5 text-sm rounded-full"
            onClick={() => handleCategoryChange(null)}
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
                onClick={() => handleCategoryChange(cat.id)}
              >
                {cat.categoryName}
              </Tag>
            ))
          )}
        </div>
      </div>

      {/* Main Content */}
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
            {(searchText || categoryId || selectedTags.length > 0) && (
              <Button
                type="primary"
                className="mt-4 bg-orange-500 hover:bg-orange-600 border-none"
                onClick={resetFilters}
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

      {/* Custom Styles */}
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
    </>
  );
};

export default Article;
