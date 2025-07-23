import React from 'react';
import { Users, DollarSign, ListTodo, TrendingUp } from 'lucide-react';
import MetricCard from './components/MetricCard';
import SalesChart from './components/SalesChart';
import ActivityItem from './components/ActivityItem';

const Main: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Leads"
            value="2,543"
            icon={Users}
            trend={{ value: 12, isPositive: true }}
            details={{
              description: "Detailed breakdown of lead sources and conversion status",
              data: [
                { label: "Website Visits", value: "12,456" },
                { label: "Form Submissions", value: "3,785" },
                { label: "Qualified Leads", value: "2,543" },
                { label: "Conversion Rate", value: "20.4%" },
                { label: "Average Lead Value", value: "$250" }
              ]
            }}
          />
          <MetricCard
            title="Total Sales"
            value="$89,242"
            icon={DollarSign}
            trend={{ value: 8, isPositive: true }}
            details={{
              description: "Sales performance metrics and revenue breakdown",
              data: [
                { label: "Total Revenue", value: "$89,242" },
                { label: "Average Deal Size", value: "$1,250" },
                { label: "Deals Closed", value: "71" },
                { label: "Pipeline Value", value: "$150,000" },
                { label: "Win Rate", value: "65%" }
              ]
            }}
          />
          <MetricCard
            title="Tasks in Progress"
            value="48"
            icon={ListTodo}
            trend={{ value: 5, isPositive: false }}
            details={{
              description: "Current task status and distribution",
              data: [
                { label: "High Priority", value: "15" },
                { label: "Medium Priority", value: "22" },
                { label: "Low Priority", value: "11" },
                { label: "Overdue Tasks", value: "3" },
                { label: "Completed Today", value: "12" }
              ]
            }}
          />
          <MetricCard
            title="Conversion Rate"
            value="24%"
            icon={TrendingUp}
            trend={{ value: 2, isPositive: true }}
            details={{
              description: "Conversion metrics across different stages",
              data: [
                { label: "Visit to Lead", value: "35%" },
                { label: "Lead to Opportunity", value: "28%" },
                { label: "Opportunity to Deal", value: "24%" },
                { label: "Average Sales Cycle", value: "15 days" },
                { label: "Customer Retention", value: "85%" }
              ]
            }}
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SalesChart />

          {/* Recent Activities */}
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-4">
              <ActivityItem
                icon={Users}
                title="New lead captured"
                time="2 hours ago"
                iconBgColor="bg-blue-100"
                iconColor="text-blue-600"
                details={{
                  description: "Lead details from website form submission",
                  data: [
                    { label: "Company", value: "Tech Solutions Inc." },
                    { label: "Contact", value: "John Smith" },
                    { label: "Email", value: "john@techsolutions.com" },
                    { label: "Source", value: "Website Contact Form" },
                    { label: "Interest", value: "Enterprise Solution" }
                  ]
                }}
              />
              <ActivityItem
                icon={DollarSign}
                title="Sale completed"
                time="5 hours ago"
                iconBgColor="bg-green-100"
                iconColor="text-green-600"
                details={{
                  description: "Details of the completed sale",
                  data: [
                    { label: "Customer", value: "Global Corp Ltd" },
                    { label: "Deal Value", value: "$25,000" },
                    { label: "Product", value: "Annual Subscription" },
                    { label: "Sales Rep", value: "Sarah Johnson" },
                    { label: "Close Date", value: "March 15, 2024" }
                  ]
                }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;
