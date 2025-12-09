// src/pages/dashboard/constants.ts

// Định nghĩa kiểu dữ liệu cho biểu đồ đường/cột
export interface DashboardChartData {
  name: string;
  views: number;
  articles: number;
  // 👇 QUAN TRỌNG: Cho phép Recharts truy cập dynamic key (dataKey="views")
  [key: string]: any; 
}

// Định nghĩa kiểu dữ liệu cho biểu đồ tròn
export interface DashboardRoleData {
  name: string;
  value: number;
  // 👇 QUAN TRỌNG: Fix lỗi "Index signature is missing" ở PieChart
  [key: string]: any;
}

export const chartData: DashboardChartData[] = [
  { name: "Jan", views: 4000, articles: 24 },
  { name: "Feb", views: 3000, articles: 13 },
  { name: "Mar", views: 2000, articles: 9 },
  { name: "Apr", views: 2780, articles: 39 },
  { name: "May", views: 1890, articles: 22 },
  { name: "Jun", views: 2390, articles: 29 },
];

export const pieData: DashboardRoleData[] = [
  { name: "Admin", value: 2 },
  { name: "Editor", value: 5 },
  { name: "Viewer", value: 13 },
];

export const PIE_COLORS: string[] = ["#3b82f6", "#8b5cf6", "#ec4899"];