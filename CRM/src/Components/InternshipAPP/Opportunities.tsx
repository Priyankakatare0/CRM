import React, { useState, useEffect, ChangeEvent } from 'react';
import axios from 'axios';

type Opportunity = {
  id: number;
  name: string;
  stage: 'Prospecting' | 'Qualification' | 'Proposal' | 'Negotiation' | 'Closed Won';
  value: number;
};

const Opportunities = () => {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [stageFilter, setStageFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await axios.get('https://dummyjson.com/users');
        const dataWithStages: Opportunity[] = response.data.users.map((user: any) => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          stage: ['Prospecting', 'Qualification', 'Proposal', 'Negotiation', 'Closed Won'][Math.floor(Math.random() * 5)] as Opportunity['stage'],
          value: Math.floor(Math.random() * 10000) + 1000,
        }));
        setOpportunities(dataWithStages);
      } catch (error) {
        console.error('Error fetching opportunities:', error);
      }
    };

    fetchOpportunities();
  }, []);

  const filteredOpportunities = opportunities.filter(
    (opportunity) =>
      opportunity.name.toLowerCase().includes(nameFilter.toLowerCase()) &&
      (stageFilter === '' || opportunity.stage === stageFilter)
  );

  const sortedOpportunities = [...filteredOpportunities].sort((a, b) => {
    if (sortBy === 'valueAsc') return a.value - b.value;
    if (sortBy === 'valueDesc') return b.value - a.value;
    return 0;
  });

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedOpportunities.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const containerStyle: React.CSSProperties = {
    width: '92.5vw',
    margin: '0 auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  };

  const headingStyle: React.CSSProperties = {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#333',
  };

  const listItemStyle: React.CSSProperties = {
    backgroundColor: '#fff',
    marginBottom: '10px',
    padding: '10px 15px',
    borderRadius: '6px',
    border: '1px solid #ddd',
    transition: 'background-color 0.3s ease',
  };

  const hoverEffect = (e: React.MouseEvent<HTMLLIElement>, hover: boolean) => {
    e.currentTarget.style.backgroundColor = hover ? '#e0e0e0' : '#fff';
  };

  return (
    <div style={containerStyle}>
      <h2 style={headingStyle}>Opportunities</h2>

      <input
        type="text"
        placeholder="Filter by name..."
        value={nameFilter}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setNameFilter(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '98%' }}
      />

      <select
        value={stageFilter}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setStageFilter(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      >
        <option value="">All Stages</option>
        <option value="Prospecting">Prospecting</option>
        <option value="Qualification">Qualification</option>
        <option value="Proposal">Proposal</option>
        <option value="Negotiation">Negotiation</option>
        <option value="Closed Won">Closed Won</option>
      </select>

      <select
        value={sortBy}
        onChange={(e: ChangeEvent<HTMLSelectElement>) => setSortBy(e.target.value)}
        style={{ marginBottom: '20px', padding: '10px', width: '100%' }}
      >
        <option value="">Sort by Value</option>
        <option value="valueAsc">Ascending</option>
        <option value="valueDesc">Descending</option>
      </select>

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {currentItems.map((opportunity) => (
          <li
            key={opportunity.id}
            style={listItemStyle}
            onMouseEnter={(e) => hoverEffect(e, true)}
            onMouseLeave={(e) => hoverEffect(e, false)}
          >
            <strong>Name:</strong> {opportunity.name} | <strong>Stage:</strong> {opportunity.stage} | <strong>Value:</strong> ${opportunity.value.toLocaleString()}
          </li>
        ))}
      </ul>

      <div style={{ textAlign: 'center', marginTop: '20px' }}>
        {Array.from({ length: Math.ceil(sortedOpportunities.length / itemsPerPage) }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => paginate(i + 1)}
            style={{ margin: '5px', padding: '5px 10px' }}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Opportunities;
