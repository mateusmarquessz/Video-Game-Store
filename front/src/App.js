import React from 'react';
import Header from './Components/Header';
import './App.css';
import Sidebar from './Components/Sidebar';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content">
        <Sidebar />
      </div>
    </div>
  );
}

export default App;
