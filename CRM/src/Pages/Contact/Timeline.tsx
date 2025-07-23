import React from 'react';
import './Timeline.css';

interface Interaction {
  date: string;
  contact: string;
  details: string;
}

interface TimelineProps {
  interactions: Interaction[];
}

const Timeline: React.FC<TimelineProps> = ({ interactions }) => {
  return (
    <div className="timeline">
      {interactions.map((interaction, index) => (
        <div key={index} className="timeline-item">
          <div className="timeline-content">
            <div className="timeline-date">{interaction.date}</div>
            <div className="timeline-contact">{interaction.contact}</div>
            <div className="timeline-details">{interaction.details}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Timeline;
