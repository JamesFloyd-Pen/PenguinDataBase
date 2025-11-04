import React from 'react';
import { usePenguinContext } from '../../context/PenguinContext';
import PenguinCard from './PenguinCard';

const PenguinList = () => {
  const { penguins } = usePenguinContext();

  return (
    <div className="penguin-list-container">
      <h2>Penguin Collection ({penguins.length})</h2>
      {penguins.length === 0 ? (
        <p>No penguins in the database yet. Add one above! 🐧</p>
      ) : (
        <div className="penguin-grid">
          {penguins.map((penguin) => (
            <PenguinCard key={penguin._id} penguin={penguin} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PenguinList;