import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Database from './pages/Database';
import Map from './pages/Map';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import { PenguinProvider } from './context/PenguinContext';
import { AuthProvider } from './context/AuthContext';
import './styles/App.css';

function App() {
  return (
    <AuthProvider>
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
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/account" element={<Account />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </PenguinProvider>
    </AuthProvider>
  );
}

export default App;
