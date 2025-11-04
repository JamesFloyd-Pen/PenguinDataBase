import React from 'react';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import DatabaseStats from './components/penguin/DatabaseStats';
import PenguinForm from './components/penguin/PenguinForm';
import PenguinList from './components/penguin/PenguinList';
import { PenguinProvider } from './context/PenguinContext';
import './App.css';

function App() {
  return (
    <PenguinProvider>
      <div className="App">
        <Header />
        <main className="App-main">
          <DatabaseStats />
          <PenguinForm />
          <PenguinList />
        </main>
        <Footer />
      </div>
    </PenguinProvider>
  );
}

export default App;
