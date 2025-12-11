import React, { useState, useCallback } from 'react';
import { Input, Tabs } from 'antd';
import { Search } from 'lucide-react';

interface ArticlesFilterBarProps {
  onSearch: (value: string) => void;
  onStatusChange: (status: string) => void;
  statusCounts?: {
    all: number;
    published: number;
    pending: number;
    draft: number;
    rented: number;
  };
}

const ArticlesFilterBar: React.FC<ArticlesFilterBarProps> = React.memo(
  ({ onSearch, onStatusChange }) => {
    const [searchValue, setSearchValue] = useState('');

    const handleSearchChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchValue(value);
        if (!value) {
          onSearch('');
        }
      },
      [onSearch],
    );

    const handleSearchPress = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
          onSearch(searchValue);
        }
      },
      [onSearch, searchValue],
    );

    const items = [
      {
        key: '',
        label: <span className="flex items-center gap-2">Tất cả</span>,
      },
      {
        key: 'Published',
        label: <span className="flex items-center gap-2">Đang hiển thị</span>,
      },
      {
        key: 'Pending',
        label: <span className="flex items-center gap-2">Chờ duyệt</span>,
      },
      // {
      //   key: 'Draft',
      //   label: (
      //     <span className="flex items-center gap-2">
      //       Bản nháp
      //       {statusCounts && <Badge count={statusCounts.draft} showZero className="[&_.ant-badge-count]:bg-orange-500" />}
      //     </span>
      //   )
      // },
      // {
      //   key: 'Rented',
      //   label: (
      //     <span className="flex items-center gap-2">
      //       Đã cho thuê
      //       {statusCounts && <Badge count={statusCounts.rented} showZero className="[&_.ant-badge-count]:bg-red-500" />}
      //     </span>
      //   )
      // },
    ];

    return (
      <div className="p-4 bg-white border-b border-gray-100">
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-4">
          {/* Tabs Filter */}
          <div className="flex-1 overflow-x-auto">
            <Tabs
              defaultActiveKey=""
              items={items}
              onChange={onStatusChange}
              className="[&_.ant-tabs-nav]:mb-0 [&_.ant-tabs-tab]:px-4"
            />
          </div>

          {/* Search Box */}
          <div className="w-full lg:w-80">
            <Input
              placeholder="Tìm kiếm theo tiêu đề..."
              prefix={<Search size={18} className="text-gray-400" />}
              size="large"
              value={searchValue}
              onChange={handleSearchChange}
              onPressEnter={handleSearchPress}
              allowClear
              onClear={() => onSearch('')}
              className="rounded-lg"
            />
          </div>
        </div>
      </div>
    );
  },
);

ArticlesFilterBar.displayName = 'ArticlesFilterBar';

export default ArticlesFilterBar;
