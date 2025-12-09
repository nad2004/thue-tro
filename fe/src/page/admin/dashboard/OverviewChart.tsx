import React from "react";
import { Card, Typography } from "antd";
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { DashboardChartData } from "./constants";

const { Title } = Typography;

interface OverviewChartProps {
  data: DashboardChartData[];
}

const OverviewChart: React.FC<OverviewChartProps> = ({ data }) => {
  return (
    <Card bordered={false} className="shadow-sm">
      <Title level={5}>Articles & Views</Title>
      <div style={{ height: 300, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#8c8c8c" />
            <YAxis stroke="#8c8c8c" />
            <Tooltip 
              contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} 
            />
            <Legend />
            <Line type="monotone" dataKey="views" stroke="#1677ff" strokeWidth={2} dot={{ r: 4 }} />
            <Line type="monotone" dataKey="articles" stroke="#722ed1" strokeWidth={2} dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default OverviewChart;