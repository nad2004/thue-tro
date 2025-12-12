import React, { useState, useCallback } from 'react';
import { Space, Input, Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { Category } from '@/types/Category';

interface ArticleTableToolbarProps {
  categories: Category[];
  onSearch: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const ArticleTableToolbar: React.FC<ArticleTableToolbarProps> = React.memo(
  ({ categories, onSearch, onCategoryChange }) => {
    const [searchValue, setSearchValue] = useState('');

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
      <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
        <Space>
          <Input
            placeholder="Tìm theo tiêu đề..."
            prefix={<SearchOutlined className="text-gray-400" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyPress={handleSearchPress}
            style={{ width: 300 }}
            allowClear
            onClear={handleSearchClear}
          />
          <Select
            placeholder="Lọc danh mục"
            style={{ width: 200 }}
            allowClear
            onChange={onCategoryChange}
          >
            {categories.map((cat) => (
              <Select.Option key={cat.id} value={cat.id}>
                {cat.categoryName}
              </Select.Option>
            ))}
          </Select>
        </Space>
      </div>
    );
  },
);

ArticleTableToolbar.displayName = 'ArticleTableToolbar';

export default ArticleTableToolbar;
