"use client";
impor    rom "react";;
import { 
  TrendingUp, 
  Users, 
  ShoppingBag,  
} from "lucide-react";
import { 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  AreaChart,
  Area,
  LineChart,
  Line
} from "recharts";

// Data
const INSIGHTS = [
  {
    icon: TrendingUp,
    color: "text-green-500",
    insight: "Revenue is up 15% compared to last month, driven primarily by a successful email campaign.",
  },
  {
    icon: Users,
    color: "text-blue-500",
    insight: "Customer retention has improved by 8% following the launch of the new loyalty program.",
  },
  {
    icon: ShoppingBag,
    color: "text-purple-500",
    insight: 'Product category "Electronics" shows the highest growth potential based on recent market trends.',
  },
  {
    icon: DollarSign,
    color: "text-yellow-500",
    insight: "Optimizing pricing strategy could potentially increase overall profit margins by 5-7%.",
  },
];

const overviewData = [
  { name: "Revenue", value: "$1,234,567", change: 12.5, icon: DollarSign },
  { name: "Users", value: "45,678", change: 8.3, icon: Users },
  { name: "Orders", value: "9,876", change: -3.2, icon: ShoppingBag },
  { name: "Page Views", value: "1,234,567", change: 15.7, icon: Eye },
];

const channelData = [
  { name: "Organic Search", value: 4000 },
  { name: "Paid Search", value: 3000 },
  { name: "Direct", value: 2000 },
  { name: "Social Media", value: 2780 },
  { name: "Referral", value: 1890 },
  { name: "Email", value: 2390 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F"];

const customerSegmentationData = [
  { subject: "Engagement", A: 120, B: 110, fullMark: 150 },
  { subject: "Loyalty", A: 98, B: 130, fullMark: 150 },
  { subject: "Satisfaction", A: 86, B: 130, fullMark: 150 },
  { subject: "Spend", A: 99, B: 100, fullMark: 150 },
  { subject: "Frequency", A: 85, B: 90, fullMark: 150 },
  { subject: "Recency", A: 65, B: 85, fullMark: 150 },
];

const productPerformanceData = [
  { name: "Product A", sales: 4000, revenue: 2400, profit: 2400 },
  { name: "Product B", sales: 3000, revenue: 1398, profit: 2210 },
  { name: "Product C", sales: 2000, revenue: 9800, profit: 2290 },
  { name: "Product D", sales: 2780, revenue: 3908, profit: 2000 },
  { name: "Product E", sales: 1890, revenue: 4800, profit: 2181 },
];

const revenueData = [
  { month: "Jan", revenue: 4000, target: 3800 },
  { month: "Feb", revenue: 3000, target: 3200 },
  { month: "Mar", revenue: 5000, target: 4500 },
  { month: "Apr", revenue: 4500, target: 4200 },
  { month: "May", revenue: 6000, target: 5500 },
  { month: "Jun", revenue: 5500, target: 5800 },
  { month: "Jul", revenue: 7000, target: 6500 },
];

const userRetentionData = [
  { name: "Week 1", retention: 100 },
  { name: "Week 2", retention: 75 },
  { name: "Week 3", retention: 60 },
  { name: "Week 4", retention: 50 },
  { name: "Week 5", retention: 45 },
  { name: "Week 6", retention: 40 },
  { name: "Week 7", retention: 38 },
  { name: "Week 8", retention: 35 },
];

const AnalyticsPage = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("This Month");

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-gray-100 mb-2">Analytics Dashboard</h1>
          <p className="text-gray-400">Comprehensive insights and performance metrics</p>
        </motion.div>

        {/* Overview Cards */}
        <div className='grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8'>
          {overviewData.map((item, index) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.name}
                className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-400'>{item.name}</h3>
                    <p className='mt-1 text-xl font-semibold text-gray-100'>{item.value}</p>
                  </div>

                  <div
                    className={`
                      p-3 rounded-full bg-opacity-20 ${item.change >= 0 ? "bg-green-500" : "bg-red-500"}
                    `}
                  >
                    <IconComponent className={`size-6  ${item.change >= 0 ? "text-green-500" : "text-red-500"}`} />
                  </div>
                </div>
                <div
                  className={`
                    mt-4 flex items-center ${item.change >= 0 ? "text-green-500" : "text-red-500"}
                  `}
                >
                  {item.change >= 0 ? <ArrowUpRight size='20' /> : <ArrowDownRight size='20' />}
                  <span className='ml-1 text-sm font-medium'>{Math.abs(item.change)}%</span>
                  <span className='ml-2 text-sm text-gray-400'>vs last period</span>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue vs Target */}
          <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className='flex justify-between items-center mb-6'>
              <h2 className='text-xl font-semibold text-gray-100'>Revenue vs Target</h2>
              <select
                className='bg-gray-700 text-white rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500'
                value={selectedTimeRange}
                onChange={(e) => setSelectedTimeRange(e.target.value)}
              >
                <option>This Week</option>
                <option>This Month</option>
                <option>This Quarter</option>
                <option>This Year</option>
              </select>
            </div>

            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={revenueData}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                  <XAxis dataKey='month' stroke='#9CA3AF' />
                  <YAxis stroke='#9CA3AF' />
                  <Tooltip
                    contentStyle={{ 
                      backgroundColor: "rgba(31, 41, 55, 0.9)", 
                      borderColor: "#4B5563",
                      color: "#F3F4F6"
                    }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend />
                  <Area type='monotone' dataKey='revenue' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.3} />
                  <Area type='monotone' dataKey='target' stroke='#10B981' fill='#10B981' fillOpacity={0.3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Channel Performance */}
          <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>Channel Performance</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={channelData}
                    cx='50%'
                    cy='50%'
                    outerRadius={80}
                    fill='#8884d8'
                    dataKey='value'
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {channelData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(31, 41, 55, 0.9)",
                      borderColor: "#4B5563",
                      color: "#F3F4F6"
                    }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Product Performance */}
          <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>Product Performance</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={productPerformanceData}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                  <XAxis dataKey='name' stroke='#9CA3AF' />
                  <YAxis stroke='#9CA3AF' />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(31, 41, 55, 0.9)",
                      borderColor: "#4B5563",
                      color: "#F3F4F6"
                    }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend />
                  <Bar dataKey='sales' fill='#8B5CF6' />
                  <Bar dataKey='revenue' fill='#10B981' />
                  <Bar dataKey='profit' fill='#F59E0B' />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* Customer Segmentation */}
          <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>Customer Segmentation</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <RadarChart cx='50%' cy='50%' outerRadius='80%' data={customerSegmentationData}>
                  <PolarGrid stroke='#374151' />
                  <PolarAngleAxis dataKey='subject' stroke='#9CA3AF' />
                  <PolarRadiusAxis angle={30} domain={[0, 150]} stroke='#9CA3AF' />
                  <Radar name='Segment A' dataKey='A' stroke='#8B5CF6' fill='#8B5CF6' fillOpacity={0.6} />
                  <Radar name='Segment B' dataKey='B' stroke='#10B981' fill='#10B981' fillOpacity={0.6} />
                  <Legend />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(31, 41, 55, 0.9)",
                      borderColor: "#4B5563",
                      color: "#F3F4F6"
                    }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* User Retention */}
          <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>User Retention</h2>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <LineChart data={userRetentionData}>
                  <CartesianGrid strokeDasharray='3 3' stroke='#374151' />
                  <XAxis dataKey='name' stroke='#9CA3AF' />
                  <YAxis stroke='#9CA3AF' />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "rgba(31, 41, 55, 0.9)",
                      borderColor: "#4B5563",
                      color: "#F3F4F6"
                    }}
                    itemStyle={{ color: "#E5E7EB" }}
                  />
                  <Legend />
                  <Line type='monotone' dataKey='retention' stroke='#8B5CF6' strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </motion.div>

          {/* AI-Powered Insights */}
          <motion.div
            className='bg-gray-800 bg-opacity-50 backdrop-blur-lg shadow-lg rounded-xl p-6 border border-gray-700'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <h2 className='text-xl font-semibold text-gray-100 mb-4'>AI-Powered Insights</h2>
            <div className='space-y-4'>
              {INSIGHTS.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <div key={index} className='flex items-center space-x-3'>
                    <div className={`p-2 rounded-full ${item.color} bg-opacity-20`}>
                      <IconComponent className={`size-6 ${item.color}`} />
                    </div>
                    <p className='text-gray-300 text-sm'>{item.insight}</p>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;