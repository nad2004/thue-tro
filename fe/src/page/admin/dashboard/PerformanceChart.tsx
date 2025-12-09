import React from "react";
import { Card, Typography } from "antd";
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardChartData } from "./constants";

const { Title } = Typography;

interface PerformanceChartProps {
  data: DashboardChartData[];
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data }) => {
  return (
    <Card bordered={false} className="shadow-sm">
      <Title level={5}>Monthly Performance</Title>
      <div style={{ height: 300, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#8c8c8c" />
            <YAxis stroke="#8c8c8c" />
            <Tooltip cursor={{ fill: '#f5f5f5' }} />
            <Legend />
            <Bar dataKey="views" fill="#1677ff" radius={[4, 4, 0, 0]} />
            <Bar dataKey="articles" fill="#722ed1" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default PerformanceChart;