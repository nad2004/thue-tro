import React from 'react';
import { Input, Select, Space, Button } from 'antd';
import { ICategory } from '@/types/Category';

interface FilterBarProps {
  categories: ICategory[]; // Nhận list category object từ API
  onSearch: (value: string) => void;
  onCategoryChange: (categoryId: string) => void; // Chỉ trả về ID
  onStatusChange: (status: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ 
  categories, 
  onSearch, 
  onCategoryChange, 
  onStatusChange 
}) => {
  return (
    <Space style={{ marginBottom: 16 }} wrap>
      {/* Search Box */}
      <Input.Search
        placeholder="Tìm kiếm bài viết..."
        onSearch={onSearch}
        style={{ width: 250 }}
        allowClear
      />

      {/* Select Category */}
      <Select
        placeholder="Chọn danh mục"
        style={{ width: 200 }}
        allowClear
        onChange={(value) => onCategoryChange(value)} // value ở đây sẽ là string ID
      >
        {/* Map đúng trường id và categoryName từ ICategory */}
        {categories.map((cat) => (
          <Select.Option key={cat.id} value={cat.id}>
            {cat.categoryName}
          </Select.Option>
        ))}
      </Select>

      {/* Select Status */}
      <Select
        placeholder="Trạng thái"
        style={{ width: 150 }}
        allowClear
        onChange={onStatusChange}
      >
        <Select.Option value="Published">Đã xuất bản</Select.Option>
        <Select.Option value="Draft">Bản nháp</Select.Option>
        <Select.Option value="Pending">Chờ duyệt</Select.Option>
      </Select>
    </Space>
  );
};

export default FilterBar;