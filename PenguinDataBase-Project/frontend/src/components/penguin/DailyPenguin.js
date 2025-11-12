import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePenguinContext } from '../../context/PenguinContext';

const DailyPenguin = () => {
  const navigate = useNavigate();
  const { penguins } = usePenguinContext();
  const [dailyPenguin, setDailyPenguin] = useState(null);

  useEffect(() => {
    // Select a random penguin when penguins data loads
    if (penguins && penguins.length > 0) {
      const randomIndex = Math.floor(Math.random() * penguins.length);
      setDailyPenguin(penguins[randomIndex]);
    }
  }, [penguins]);

  if (!dailyPenguin) {
    return (
      <div className="daily-penguin-container">
        <h2>🐧 Penguin of the Day</h2>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="daily-penguin-container">
      <h2>🐧 Penguin of the Day</h2>
      <div className="daily-penguin-box">
        <div className="daily-penguin-info">
          <h3>{dailyPenguin.name}</h3>
          <p className="daily-penguin-species">
            <strong>Species:</strong> {dailyPenguin.species}
          </p>
          {dailyPenguin.location && (
            <p className="daily-penguin-location">
              <strong>Location:</strong> {dailyPenguin.location}
            </p>
          )}
        </div>
        <div className="daily-penguin-description">
          <p>
            Welcome to the Penguin Database! Explore our collection of penguins from around the world. 
            Add new penguins, view their locations on the map, and learn about different species.
          </p>
        </div>
      </div>
      <button className="show-all-penguins-btn" onClick={() => navigate('/database')}>
        View All Penguins in Database →
      </button>
    </div>
  );
};

export default DailyPenguin;