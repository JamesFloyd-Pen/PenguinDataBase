import React from 'react';
import DatabaseStats from '../components/penguin/DatabaseStats';
import PenguinList from '../components/penguin/PenguinList';
import PenguinSheet from '../components/penguin/PenguinSheet';

const Database = () => {
  return (
    <div className="database-page">
      <h2>Penguin Database</h2>
      <p>View and manage all penguins in the database.</p>
      <DatabaseStats />
      <PenguinSheet />
      <PenguinList />
    </div>
  );
};

export default Database;