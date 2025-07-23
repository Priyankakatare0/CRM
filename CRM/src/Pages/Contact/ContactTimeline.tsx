import React from 'react';

type Interaction = {
  date: string;
  contact: string;
  details: string;
};

const dummyInteractions: Interaction[] = [
  {
    date: '2023-10-01',
    contact: 'John Doe',
    details: 'Had a meeting to discuss project updates.',
  },
  {
    date: '2023-10-05',
    contact: 'Jane Smith',
    details: 'Sent a follow-up email regarding the proposal.',
  },
  {
    date: '2023-10-10',
    contact: 'Alice Johnson',
    details: 'Phone call to confirm the appointment.',
  },
  {
    date: '2023-10-15',
    contact: 'Bob Brown',
    details: 'Lunch meeting to finalize the contract.',
  },
];

const ContactTimeline: React.FC = () => {
  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif', background: '#f8f9fa' }}>
      <h1>Contact Interaction Timeline</h1>
      <div style={{ borderLeft: '2px solid #007bff', paddingLeft: '20px', marginTop: '1rem' }}>
        {dummyInteractions.map((interaction, index) => (
          <div key={index} style={{ marginBottom: '1rem' }}>
            <div style={{ color: '#007bff', fontWeight: 'bold' }}>{interaction.date}</div>
            <div
              style={{
                background: 'white',
                padding: '1rem',
                borderRadius: '6px',
                boxShadow: '0 0 5px rgba(0,0,0,0.1)',
              }}
            >
              <h3>{interaction.contact}</h3>
              <p>{interaction.details}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactTimeline;
