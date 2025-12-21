import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Skeleton, Card, Typography } from 'antd';
import { MapPin } from 'lucide-react';
const { Title } = Typography;



delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function MapUpdater({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, 15, { duration: 2 }); // Zoom level 15
  }, [center, map]);
  return null;
}

interface LocationMapProps {
  address: string;
}

const LocationMap: React.FC<LocationMapProps> = ({ address }) => {
  const [position, setPosition] = useState<[number, number] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCoordinates = async () => {
      if (!address) return;
      setLoading(true);
      try {
        // Gọi Nominatim API (OpenStreetMap Search)
        // q: query string, format: json, limit: 1 kết quả
        const response = await axios.get('https://nominatim.openstreetmap.org/search', {
          params: {
            q: address,
            format: 'json',
            limit: 1,
            addressdetails: 1,
            countrycodes: 'vn' // Giới hạn tìm trong Việt Nam
          },
        });

        if (response.data && response.data.length > 0) {
          const { lat, lon } = response.data[0];
          setPosition([parseFloat(lat), parseFloat(lon)]);
        } else {
          console.warn('Không tìm thấy tọa độ cho địa chỉ này');
          // Fallback về Hà Nội nếu không tìm thấy
          setPosition([21.0285, 105.8542]); 
        }
      } catch (error) {
        console.error('Lỗi lấy tọa độ:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoordinates();
  }, [address]);

  return (
    <Card bordered={false} className="shadow-sm rounded-xl mb-6 overflow-hidden">
      <div className="flex items-center gap-2 mb-4">
        <MapPin className="text-blue-500" size={20} />
        <Title level={4} style={{ margin: 0 }}>Khu vực</Title>
      </div>
      
      {loading || !position ? (
        <Skeleton.Image active style={{ width: '100%', height: '300px' }} />
      ) : (
        <div className="h-[350px] w-full rounded-lg overflow-hidden relative z-0">
          <MapContainer 
            center={position} 
            zoom={15} 
            scrollWheelZoom={false} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                <span className="font-semibold">{address}</span>
              </Popup>
            </Marker>
            <MapUpdater center={position} />
          </MapContainer>
        </div>
      )}
      <p className="mt-3 text-gray-500 text-sm italic">
        * Vị trí hiển thị mang tính chất tham khảo dựa trên khu vực: <strong>{address}</strong>
      </p>
    </Card>
  );
};

export default LocationMap;