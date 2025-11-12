import React from 'react';
import DailyPenguin from '../components/penguin/DailyPenguin';
import PenguinForm from '../components/penguin/PenguinForm';

const Home = () => {
  return (
    <div className="home-page">
      <DailyPenguin />
      <PenguinForm />
    </div>
  );
};

export default Home;