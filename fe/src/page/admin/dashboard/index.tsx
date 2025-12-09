import React from 'react';
import { Breadcrumb, Row, Col, Space } from 'antd';
import {
  HomeOutlined,
  FileTextOutlined,
  EyeOutlined,
  PictureOutlined,
  FileOutlined,
} from '@ant-design/icons';

// Components
import StatsCard from './StatsCard';
import OverviewChart from './OverviewChart';
import RolesChart from './RolesChart';
import PerformanceChart from './PerformanceChart';

// Data & Types
import { chartData, pieData, PIE_COLORS } from './constants';

const DashboardPage: React.FC = () => {
  return (
    <div
      style={{ padding: 24, minHeight: '100vh', backgroundColor: '#f5f5f5' }}
    >
      <Space direction="vertical" size="large" style={{ display: 'flex' }}>
        {/* 1. Breadcrumb */}
        <Breadcrumb
          items={[
            { title: <HomeOutlined />, href: '/' },
            { title: 'Dashboard' },
          ]}
        />

        {/* 2. Stats Cards (Grid 4 cột) */}
        <Row gutter={[16, 16]}>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Total Articles"
              value={342}
              icon={<FileTextOutlined />}
              color="#1677ff"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Total Views"
              value="24,500"
              icon={<EyeOutlined />}
              color="#52c41a"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Total Images"
              value={128}
              icon={<PictureOutlined />}
              color="#faad14"
            />
          </Col>
          <Col xs={24} sm={12} lg={6}>
            <StatsCard
              title="Total Files"
              value={45}
              icon={<FileOutlined />}
              color="#eb2f96"
            />
          </Col>
        </Row>

        {/* 3. Charts Row 1 (Grid 2 cột) */}
        <Row gutter={[16, 16]}>
          <Col xs={24} lg={16}>
            <OverviewChart data={chartData} />
          </Col>
          <Col xs={24} lg={8}>
            <RolesChart data={pieData} colors={PIE_COLORS} />
          </Col>
        </Row>

        {/* 4. Charts Row 2 (Grid 1 cột) */}
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <PerformanceChart data={chartData} />
          </Col>
        </Row>
      </Space>
    </div>
  );
};

export default DashboardPage;