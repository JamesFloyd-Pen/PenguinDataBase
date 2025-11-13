import React, { useState } from 'react';
import { usePenguinContext } from '../../context/PenguinContext';
import PenguinCard from './PenguinCard';
import PenguinSheet from './PenguinSheet';

const PenguinList = () => {
  const { penguins } = usePenguinContext();
  const [showAll, setShowAll] = useState(false);
  
  const INITIAL_DISPLAY_COUNT = 8;
  const displayedPenguins = showAll ? penguins : penguins.slice(0, INITIAL_DISPLAY_COUNT);
  const hasMorePenguins = penguins.length > INITIAL_DISPLAY_COUNT;

  return (
    <div className="penguin-list-container">
      <h2>Penguin Collection ({penguins.length})</h2>
      {penguins.length === 0 ? (
        <p>No penguins in the database yet. Add one above! 🐧</p>
      ) : (
        <>
          <div className="penguin-grid">
            {displayedPenguins.map((penguin) => (
              <PenguinCard key={penguin._id} penguin={penguin} />
            ))}
          </div>
          <div className="penguin-list-actions">
            {hasMorePenguins && !showAll && (
              <button className="show-more-btn" onClick={() => setShowAll(true)}>
                Show More ({penguins.length - INITIAL_DISPLAY_COUNT} more penguins) ⬇️
              </button>
            )}
            {showAll && hasMorePenguins && (
              <button className="show-more-btn" onClick={() => setShowAll(false)}>
                Show Less ⬆️
              </button>
            )}
            <PenguinSheet />
          </div>
        </>
      )}
    </div>
  );
};

export default PenguinList;