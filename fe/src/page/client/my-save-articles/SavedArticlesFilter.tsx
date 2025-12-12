import React, { useState, useCallback } from 'react';
import { Input, Select } from 'antd';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Category } from '@/types/Category';

interface SavedArticlesFilterProps {
  categories: Category[];
  onSearch: (value: string) => void;
  onCategoryChange: (categoryId: string | undefined) => void;
  onSortChange: (sort: string) => void;
}

const SavedArticlesFilter: React.FC<SavedArticlesFilterProps> = React.memo(
  ({ categories, onSearch, onCategoryChange, onSortChange }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setSearchValue(value);
    }, []);

    const handleSearchPress = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          onSearch(searchValue);
        }
      },
      [onSearch, searchValue],
    );

    const handleSearchClear = useCallback(() => {
      setSearchValue('');
      onSearch('');
    }, [onSearch]);

    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          {/* Search */}
          <div className="flex-1">
            <Input
              placeholder="Tìm kiếm trong tin đã lưu..."
              prefix={<Search size={18} className="text-gray-400" />}
              size="large"
              value={searchValue}
              onChange={handleSearchChange}
              onKeyPress={handleSearchPress}
              allowClear
              onClear={handleSearchClear}
              className="rounded-lg"
            />
          </div>

          {/* Category Filter */}
          <Select
            placeholder="Danh mục"
            size="large"
            style={{ width: 200 }}
            allowClear
            onChange={onCategoryChange}
            className="rounded-lg"
          >
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </Select.Option>
            ))}
          </Select>

          {/* Sort */}
          <Select
            placeholder="Sắp xếp"
            size="large"
            style={{ width: 200 }}
            defaultValue="newest"
            onChange={onSortChange}
            suffixIcon={<SlidersHorizontal size={16} />}
            className="rounded-lg"
          >
            <Select.Option value="newest">Mới nhất</Select.Option>
            <Select.Option value="oldest">Cũ nhất</Select.Option>
            <Select.Option value="price-asc">Giá thấp → cao</Select.Option>
            <Select.Option value="price-desc">Giá cao → thấp</Select.Option>
            <Select.Option value="area-asc">Diện tích nhỏ → lớn</Select.Option>
            <Select.Option value="area-desc">Diện tích lớn → nhỏ</Select.Option>
          </Select>
        </div>
      </div>
    );
  },
);

SavedArticlesFilter.displayName = 'SavedArticlesFilter';

export default SavedArticlesFilter;
