import React from 'react';
import EmailComposer from './EmailComposer';
import './App.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <h1>Email Composer</h1>
      <EmailComposer />
    </div>
  );
};

export default App;
