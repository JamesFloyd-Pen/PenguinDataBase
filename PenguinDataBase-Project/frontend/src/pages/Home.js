import React from 'react';
import DatabaseStats from '../components/penguin/DatabaseStats';
import PenguinForm from '../components/penguin/PenguinForm';
import PenguinList from '../components/penguin/PenguinList';

const Home = () => {
  return (
    <div className="home-page">
      <PenguinForm />
      <PenguinList />
    </div>
  );
};

export default Home;