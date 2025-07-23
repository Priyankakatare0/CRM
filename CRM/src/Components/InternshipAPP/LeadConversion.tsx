import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from 'recharts';

type LineChartData = {
  date: string;
  stage: string;
  count: number;
};

type PieChartData = {
  name: string;
  value: number;
};

const data: LineChartData[] = [
  { date: '2024-03-01', stage: 'Interest', count: 100 },
  { date: '2024-03-05', stage: 'Contact', count: 70 },
  { date: '2024-03-10', stage: 'Follow-up', count: 40 },
  { date: '2024-03-15', stage: 'Conversion', count: 20 },
];

const pieData: PieChartData[] = [
  { name: 'Converted', value: 20 },
  { name: 'Not Converted', value: 80 },
];

const COLORS: string[] = ['#0088FE', '#FF8042'];

const LeadConversionChart: React.FC = () => (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      width: '95vw',
      height: '100vh',
      padding: '20px',
      boxSizing: 'border-box',
    }}
  >
    <h2>Lead Conversion Analytics and Timelines</h2>

    {/* Line Chart */}
    <h3>1. Lead Stage Progression (Line Chart)</h3>
    <p>
      Shows how leads move through different stages (Interest → Contact →
      Follow-up → Conversion) and helps visualize the drop-off rate at each
      stage.
    </p>
    <ResponsiveContainer width="98%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="stage" />
        <YAxis />
        <Tooltip />
        <Line type="monotone" dataKey="count" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>

    {/* Pie Chart */}
    <h3>2. Conversion Rate (Pie Chart)</h3>
    <p>
      Visualizes the percentage of leads that converted vs. not converted,
      helping identify conversion efficiency.
    </p>
    <ResponsiveContainer width="50%" height={300}>
      <PieChart>
        <Pie
          data={pieData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
        >
          {pieData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
            />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>

    {/* Bar Chart */}
    <h3>3. Lead Count Comparison (Bar Chart)</h3>
    <p>
      Provides a visual comparison of the number of leads at each stage to help
      identify where the leads are dropping off the most.
    </p>
    <ResponsiveContainer width="98%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="stage" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="count" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>

    {/* Area Chart */}
    <h3>4. Conversion Over Time (Area Chart)</h3>
    <p>
      Displays lead progression over time, which is crucial for tracking
      conversion speed and identifying bottlenecks.
    </p>
    <ResponsiveContainer width="98%" height={300}>
      <AreaChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis />
        <Tooltip />
        <Area type="monotone" dataKey="count" stroke="#8884d8" fill="#8884d8" />
      </AreaChart>
    </ResponsiveContainer>
  </div>
);

export default LeadConversionChart;
