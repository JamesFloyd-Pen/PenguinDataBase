import React from 'react';
import Navigation from './Navigation';

const Header = () => {
  return (
    <header className="App-header">
      <div className="header-inner" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
        <div className="brand">
          <h1 style={{ margin: 0 }}>🐧 Penguin Database</h1>
        </div>
        <Navigation />
      </div>
    </header>
  );
};

export default Header;