import React from 'react';
import DatabaseStats from '../components/penguin/DatabaseStats';
import PenguinList from '../components/penguin/PenguinList';
import PenguinSheet from '../components/penguin/PenguinSheet';
import PenguinSearch from '../components/penguin/PenguinSearch';

const Database = () => {
  return (
    <div className="database-page">
      <h2>Penguin Database</h2>
      <PenguinSearch />
      <p>View and manage all penguins in the database.</p>
      <PenguinList />
    </div>
  );
};

export default Database;

//      <DatabaseStats />
//       <PenguinSheet />

