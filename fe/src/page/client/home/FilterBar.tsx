import React, { useState } from 'react';
import { Input, Select, Button, Slider, Drawer } from 'antd';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { Category } from '@/types/Category';

interface FilterBarProps {
  categories: Category[];
  onSearch: (value: string) => void;
  onCategoryChange: (categoryId: string) => void;
  onPriceRangeChange?: (min?: number, max?: number) => void;
  onAreaRangeChange?: (min?: number, max?: number) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  categories,
  onSearch,
  onCategoryChange,
  onPriceRangeChange,
  onAreaRangeChange,
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 20]);
  const [areaRange, setAreaRange] = useState<[number, number]>([0, 100]);

  const handleSearchClick = () => {
    onSearch(searchValue);
  };

  const handleApplyFilters = () => {
    // Áp dụng price range (convert triệu -> đồng)
    if (onPriceRangeChange) {
      onPriceRangeChange(priceRange[0] * 1000000, priceRange[1] * 1000000);
    }

    // Áp dụng area range
    if (onAreaRangeChange) {
      onAreaRangeChange(areaRange[0], areaRange[1]);
    }

    setShowAdvanced(false);
  };

  const handleResetAdvanced = () => {
    setPriceRange([0, 20]);
    setAreaRange([0, 100]);

    if (onPriceRangeChange) {
      onPriceRangeChange(undefined, undefined);
    }
    if (onAreaRangeChange) {
      onAreaRangeChange(undefined, undefined);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Filter Row */}
      <div className="flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            size="large"
            placeholder="Tìm kiếm theo tiêu đề, địa điểm..."
            prefix={<Search size={18} className="text-gray-400" />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onPressEnter={handleSearchClick}
            className="rounded-xl border-gray-200 hover:border-orange-400 focus:border-orange-500"
            allowClear
          />
        </div>

        {/* Category Select */}
        <Select
          size="large"
          placeholder="Danh mục"
          className="w-full md:w-48"
          allowClear
          onChange={(value) => onCategoryChange(value)}
        >
          {categories.map((cat) => (
            <Select.Option key={cat.id} value={cat.id}>
              {cat.categoryName}
            </Select.Option>
          ))}
        </Select>

        {/* Advanced Filter Button */}
        <Button
          size="large"
          icon={<SlidersHorizontal size={18} />}
          onClick={() => setShowAdvanced(true)}
          className="rounded-xl border-gray-200 hover:border-orange-400 hover:text-orange-500 w-full md:w-auto"
        >
          <span className="hidden md:inline">Lọc nâng cao</span>
        </Button>

        {/* Search Button */}
        <Button
          type="primary"
          size="large"
          icon={<Search size={18} />}
          onClick={handleSearchClick}
          className="bg-orange-500 hover:bg-orange-600 border-none rounded-xl font-medium w-full md:w-auto"
        >
          Tìm kiếm
        </Button>
      </div>

      {/* Advanced Filter Drawer */}
      <Drawer
        title={
          <div className="flex items-center gap-2">
            <SlidersHorizontal size={20} />
            <span>Bộ lọc nâng cao</span>
          </div>
        }
        placement="right"
        onClose={() => setShowAdvanced(false)}
        open={showAdvanced}
        width={360}
        closeIcon={<X size={20} />}
      >
        <div className="space-y-6">
          {/* Price Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">
                Khoảng giá (triệu/tháng)
              </label>
              <span className="text-sm text-orange-600 font-medium">
                {priceRange[0]} - {priceRange[1]} triệu
              </span>
            </div>
            <Slider
              range
              min={0}
              max={20}
              value={priceRange}
              onChange={(value) => setPriceRange(value as [number, number])}
              tooltip={{ formatter: (value) => `${value} triệu` }}
            />
          </div>

          {/* Area Range */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-semibold text-gray-700">Diện tích (m²)</label>
              <span className="text-sm text-orange-600 font-medium">
                {areaRange[0]} - {areaRange[1]} m²
              </span>
            </div>
            <Slider
              range
              min={0}
              max={100}
              value={areaRange}
              onChange={(value) => setAreaRange(value as [number, number])}
              tooltip={{ formatter: (value) => `${value} m²` }}
            />
          </div>

          {/* Furniture Status */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">
              Tình trạng nội thất
            </label>
            <Select size="large" placeholder="Chọn tình trạng" className="w-full" allowClear>
              <Select.Option value="full">Đầy đủ</Select.Option>
              <Select.Option value="partial">Cơ bản</Select.Option>
              <Select.Option value="empty">Trống</Select.Option>
            </Select>
          </div>

          {/* Utilities */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">Tiện ích</label>
            <div className="space-y-2">
              {['Wifi', 'Điều hòa', 'Máy giặt', 'Bảo vệ 24/7', 'Gửi xe', 'Thang máy'].map(
                (utility) => (
                  <label
                    key={utility}
                    className="flex items-center gap-2 cursor-pointer p-2 hover:bg-gray-50 rounded-lg transition-colors"
                  >
                    <input type="checkbox" className="w-4 h-4 text-orange-500 rounded" />
                    <span className="text-sm text-gray-700">{utility}</span>
                  </label>
                ),
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button block size="large" onClick={handleResetAdvanced}>
              Đặt lại
            </Button>
            <Button
              type="primary"
              block
              size="large"
              className="bg-orange-500 hover:bg-orange-600 border-none"
              onClick={handleApplyFilters}
            >
              Áp dụng
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default FilterBar;
