import React, { useEffect, useState } from 'react';
import axios from 'axios';
import SalesChart from './SalesChart';
import TeamPerformance from './TeamPerformance';

const Main = () => {
  const [salesData, setSalesData] = useState([]);
  const [teamData, setTeamData] = useState([]);

  useEffect(() => {
    // Fetch sales data
    axios.get('http://localhost:5000/api/sales')
      .then(response => setSalesData(response.data))
      .catch(err => console.log(err));

    // Fetch team performance data
    axios.get('http://localhost:5000/api/team')
      .then(response => setTeamData(response.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="Main">
      <h1>Sales Trends</h1>
      <SalesChart data={salesData} />
      <h1>Team Performance</h1>
      <TeamPerformance data={teamData} />
    </div>
  );
};

export default Main;