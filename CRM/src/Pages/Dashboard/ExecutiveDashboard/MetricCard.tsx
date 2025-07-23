import React, { useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import Modal from './Modal';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  details?: {
    description: string;
    data: Array<{ label: string; value: string | number }>;
  };
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon: Icon, trend, details }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="bg-white rounded-xl p-6 shadow-lg cursor-pointer transition-transform hover:scale-105"
        onClick={() => setIsModalOpen(true)}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold mt-2">{value}</h3>
            {trend && (
              <div className="flex items-center mt-2">
                <span
                  className={`text-sm font-medium ${
                    trend.isPositive ? 'text-green-600' : 'text-red-600'
                  }`}
                >
                  {trend.isPositive ? '+' : '-'}{Math.abs(trend.value)}%
                </span>
                <span className="text-gray-500 text-sm ml-1">vs last month</span>
              </div>
            )}
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <Icon className="w-6 h-6 text-blue-600" />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={title}
      >
        {details ? (
          <div>
            <p className="text-gray-600 mb-4">{details.description}</p>
            <div className="space-y-4">
              {details.data.map((item, index) => (
                <div key={index} className="flex justify-between items-center border-b pb-2">
                  <span className="text-gray-600">{item.label}</span>
                  <span className="font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-600">No additional details available.</p>
        )}
      </Modal>
    </>
  );
}

export default MetricCard;