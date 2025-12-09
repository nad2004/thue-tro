import React from "react";
import { Card, Typography } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { DashboardRoleData } from "./constants";

const { Title } = Typography;

interface RolesChartProps {
  data: DashboardRoleData[];
  colors: string[];
}

const RolesChart: React.FC<RolesChartProps> = ({ data, colors }) => {
  return (
    <Card bordered={false} className="shadow-sm">
      <Title level={5}>User Roles Distribution</Title>
      <div style={{ height: 300, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60} // Làm biểu đồ dạng Donut cho hiện đại
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36}/>
          </PieChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default RolesChart;