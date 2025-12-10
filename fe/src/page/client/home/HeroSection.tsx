import React, { useState } from 'react';
import { Input, Button, Select } from 'antd';
import { Search, MapPin, Home, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (value: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onSearch }) => {
  const [searchValue, setSearchValue] = useState('');
  const [priceRange, setPriceRange] = useState<string>('');
  const [area, setArea] = useState<string>('');

  const handleSearch = () => {
    onSearch(searchValue);
  };

  return (
    <div className="relative bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 md:px-6 py-12 md:py-20">
        <div className="text-center mb-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full mb-4 text-sm font-medium">
            <Sparkles size={16} />
            <span>Nền tảng cho thuê phòng trọ hàng đầu Việt Nam</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Tìm phòng trọ <br className="hidden md:block" />
            <span className="text-amber-100">hoàn hảo cho bạn</span>
          </h1>

          <p className="text-white/90 text-base md:text-lg max-w-2xl mx-auto mb-8">
            Hàng nghìn tin đăng mới mỗi ngày, giá tốt, thông tin chính xác, hỗ trợ 24/7
          </p>
        </div>

        {/* Search Box */}
        {/* <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-2xl p-3 md:p-4">
            <div className="flex flex-col md:flex-row gap-3">
             
              <div className="flex-1 relative">
                <Input
                  size="large"
                  placeholder="Tìm kiếm theo địa điểm, quận, phường..."
                  prefix={<Search size={20} className="text-gray-400" />}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onPressEnter={handleSearch}
                  className="rounded-xl border-gray-200 hover:border-orange-400 focus:border-orange-500"
                />
              </div>

             
              <Select
                size="large"
                placeholder="Mức giá"
                value={priceRange}
                onChange={setPriceRange}
                className="w-full md:w-48 rounded-xl"
                options={[
                  { value: '', label: 'Tất cả mức giá' },
                  { value: '0-2', label: 'Dưới 2 triệu' },
                  { value: '2-4', label: '2 - 4 triệu' },
                  { value: '4-6', label: '4 - 6 triệu' },
                  { value: '6-10', label: '6 - 10 triệu' },
                  { value: '10+', label: 'Trên 10 triệu' },
                ]}
              />

            
              <Select
                size="large"
                placeholder="Diện tích"
                value={area}
                onChange={setArea}
                className="w-full md:w-48 rounded-xl"
                options={[
                  { value: '', label: 'Tất cả diện tích' },
                  { value: '0-20', label: 'Dưới 20m²' },
                  { value: '20-30', label: '20 - 30m²' },
                  { value: '30-50', label: '30 - 50m²' },
                  { value: '50+', label: 'Trên 50m²' },
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
            <span className="text-white/80 text-sm">Tìm kiếm phổ biến:</span>
            {['Phòng trọ Hà Nội', 'Phòng trọ Quận 1', 'Phòng dưới 3 triệu', 'Căn hộ mini'].map((keyword) => (
              <button
                key={keyword}
                onClick={() => {
                  setSearchValue(keyword);
                  onSearch(keyword);
                }}
                className="px-3 py-1.5 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-xs md:text-sm rounded-full transition-all hover:scale-105"
              >
                {keyword}
              </button>
            ))}
          </div>
        </div> */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12 max-w-4xl mx-auto">
          {[
            { icon: Home, label: 'Tin đăng', value: '10,000+' },
            { icon: MapPin, label: 'Khu vực', value: '63 tỉnh' },
            { icon: '👤', label: 'Người dùng', value: '50,000+' },
            { icon: '⭐', label: 'Đánh giá', value: '4.8/5' },
          ].map((stat, index) => (
            <div
              key={index}
              className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center text-white"
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
