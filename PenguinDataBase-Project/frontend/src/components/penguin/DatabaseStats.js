import React from 'react';
import { usePenguinContext } from '../../context/PenguinContext';

const DatabaseStats = () => {
  const { message, stats } = usePenguinContext();

  return (
    <div className="connection-status">
      <h2>Backend Status:</h2>
      <p>{message}</p>
      
      {stats && (
        <div className="database-stats">
          <h3>📊 Database Stats:</h3>
          <p>Total Penguins: <strong>{stats.total_penguins}</strong></p>
          <p>Latest Added: <strong>{stats.latest_penguin}</strong></p>
          <p>Collection: <strong>{stats.collection_name}</strong></p>
        </div>
      )}
    </div>
  );
};

export default DatabaseStats;