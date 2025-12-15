import React, { useRef, useEffect } from 'react';
import { Input, Button, Select } from 'antd';
import { Search, MapPin, Home, Sparkles } from 'lucide-react';
import { useQueryStore } from '@/store/querry-store';
import { useNavigate } from 'react-router-dom';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const searchText = useQueryStore((s) => s.searchText);
  const priceRange = useQueryStore((s) => s.priceRange);
  const areaRange = useQueryStore((s) => s.areaRange);
  const setSearchText = useQueryStore((s) => s.setSearchText);
  const setPriceRange = useQueryStore((s) => s.setPriceRange);
  const setAreaRange = useQueryStore((s) => s.setAreaRange);
  
  // Local state để giữ giá trị input
  const [localSearchText, setLocalSearchText] = React.useState(searchText);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Sync local state with store when store changes
  useEffect(() => {
    setLocalSearchText(searchText);
  }, [searchText]);

  const handleSearch = () => {
    // Cập nhật store và navigate chỉ khi nhấn nút Search
    setSearchText(localSearchText);
    navigate('/articles');
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchText(value);

    // Clear timeout trước đó
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Tùy chọn: Debounce để cập nhật store (nếu muốn auto-search)
    // Bỏ comment dòng dưới nếu muốn tự động search sau 500ms
    // debounceTimerRef.current = setTimeout(() => {
    //   setSearchText(value);
    // }, 500);
  };

  const handleQuickSearch = (keyword: string) => {
    setSearchText(keyword);
    setLocalSearchText(keyword);
    navigate('/articles');
  };

  const handlePriceChange = (value: string) => {
    if (!value) {
      setPriceRange({ min: undefined, max: undefined });
      return;
    }

    const [min, max] = value.split('-');
    if (max === '+') {
      setPriceRange({ min: Number(min) * 1000000, max: undefined });
    } else {
      setPriceRange({
        min: Number(min) * 1000000,
        max: Number(max) * 1000000,
      });
    }
  };

  const handleAreaChange = (value: string) => {
    if (!value) {
      setAreaRange({ min: undefined, max: undefined });
      return;
    }

    const [min, max] = value.split('-');
    if (max === '+') {
      setAreaRange({ min: Number(min), max: undefined });
    } else {
      setAreaRange({
        min: Number(min),
        max: Number(max),
      });
    }
  };

  // Cleanup debounce timer
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative bg-linear-to-br from-orange-500 via-orange-400 to-amber-500 overflow-hidden mt-3">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 text-sm font-medium">
            <Sparkles size={16} />
            <span>Nền tảng cho thuê phòng trọ hàng đầu Việt Nam</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Tìm phòng trọ <br className="hidden md:block" />
            <span className="text-amber-100">hoàn hảo cho bạn</span>
          </h1>

          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Hàng nghìn tin đăng mới mỗi ngày, giá tốt, thông tin chính xác, hỗ trợ 24/7
          </p>
        </div>
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 relative">
                <Input
                  size="large"
                  placeholder="Tìm kiếm theo địa điểm, quận, phường..."
                  prefix={<Search size={20} className="text-gray-400" />}
                  value={localSearchText}
                  onChange={handleInputChange}
                  onPressEnter={handleSearch}
                  className="rounded-xl border-gray-200 hover:border-orange-400 focus:border-orange-500"
                />
              </div>
              <Select
                size="large"
                placeholder="Mức giá"
                onChange={handlePriceChange}
                className="w-full md:w-48 rounded-xl"
                options={[
                  { value: '', label: 'Tất cả mức giá' },
                  { value: '0-2', label: 'Dưới 2 triệu' },
                  { value: '2-4', label: '2 - 4 triệu' },
                  { value: '4-6', label: '4 - 6 triệu' },
                  { value: '6-10', label: '6 - 10 triệu' },
                  { value: '10-+', label: 'Trên 10 triệu' },
                ]}
              />
              <Select
                size="large"
                placeholder="Diện tích"
                onChange={handleAreaChange}
                className="w-full md:w-48 rounded-xl"
                options={[
                  { value: '', label: 'Tất cả diện tích' },
                  { value: '0-20', label: 'Dưới 20m²' },
                  { value: '20-30', label: '20 - 30m²' },
                  { value: '30-50', label: '30 - 50m²' },
                  { value: '50-+', label: 'Trên 50m²' },
                ]}
              />

              <Button
                type="primary"
                size="large"
                icon={<Search size={20} />}
                onClick={handleSearch}
                className="bg-orange-500 hover:bg-orange-600 border-none rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all w-full md:w-auto"
              >
                <span className="hidden md:inline">Tìm kiếm</span>
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            <span className="text-white/80 text-sm">Nhập nhanh:</span>
            {[ 'Phòng trọ', 'Chung cư mini'].map(
              (keyword) => (
                <button
                  key={keyword}
                  onClick={() => handleQuickSearch(keyword)}
                  className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs md:text-sm rounded-full transition-all hover:scale-105"
                >
                  {keyword}
                </button>
              ),
            )}
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          {[
            { icon: Home, label: 'Tin đăng', value: '10,000+' },
            { icon: MapPin, label: 'Khu vực', value: '63 tỉnh' },
            { icon: '👤', label: 'Người dùng', value: '50,000+' },
            { icon: '⭐', label: 'Đánh giá', value: '4.8/5' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center text-white hover:bg-white/20 transition-all"
            >
              <div className="text-2xl mb-2">
                {typeof stat.icon === 'string' ? (
                  <span>{stat.icon}</span>
                ) : (
                  <stat.icon className="inline-block" size={24} />
                )}
              </div>
              <div className="text-xl md:text-2xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm text-white/80">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;