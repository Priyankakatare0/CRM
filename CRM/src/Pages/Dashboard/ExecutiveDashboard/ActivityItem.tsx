import React, { useState } from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';
import Modal from './Modal';

interface ActivityItemProps {
  icon: LucideIcon;
  title: string;
  time: string;
  details?: {
    description: string;
    data: Array<{ label: string; value: string }>;
  };
  iconBgColor?: string;
  iconColor?: string;
}

const ActivityItem: React.FC<ActivityItemProps> = ({
  icon: Icon,
  title,
  time,
  details,
  iconBgColor = 'bg-blue-100',
  iconColor = 'text-blue-600'
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div 
        className="flex items-center space-x-4 cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <div className={`${iconBgColor} p-2 rounded-full`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
        <div>
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-gray-500">{time}</p>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Activity Details"
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
};

export default ActivityItem;