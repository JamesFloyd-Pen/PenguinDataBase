import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Database from './pages/Database';
import Map from './pages/Map'; 
import { PenguinProvider } from './context/PenguinContext';
import './App.css';

function App() {
  return (
    <PenguinProvider>
      <Router>
        <div className="App">
          <Header />
          <main className="App-main">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/database" element={<Database />} />
              <Route path="/map" element={<Map />} /> 
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </PenguinProvider>
  );
}

export default App;
