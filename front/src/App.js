import React from 'react';
import Header from './Components/Header';
import './App.css';
import Sidebar from './Components/Sidebar';
import MainContent from './Components/MainContent';

function App() {
  return (
    <div className="App">
      <Header />
      <div className="content">
        <Sidebar />
        <MainContent/>
      </div>
    </div>
  );
}

export default App;
