import React from 'react';
import { usePenguinContext } from '../../context/PenguinContext';

const PenguinCard = ({ penguin }) => {
  const { deletePenguin } = usePenguinContext();

  const handleDelete = () => {
    deletePenguin(penguin._id);
  };

  return (
    <div className="penguin-card">
      <h3>🐧 {penguin.name}</h3>
      <p><strong>Species:</strong> {penguin.species}</p>
      {penguin.age && <p><strong>Age:</strong> {penguin.age} years</p>}
      {penguin.location && <p><strong>Location:</strong> {penguin.location}</p>}
      {penguin.weight && <p><strong>Weight:</strong> {penguin.weight} kg</p>}
      {penguin.height && <p><strong>Height:</strong> {penguin.height} cm</p>}
      <p><strong>Added:</strong> {new Date(penguin.createdAt).toLocaleDateString()}</p>
      <button 
        onClick={handleDelete}
        className="delete-btn"
      >
        Delete
      </button>
    </div>
  );
};

export default PenguinCard;