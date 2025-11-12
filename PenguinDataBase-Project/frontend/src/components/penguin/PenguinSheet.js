import React from 'react';
import { usePenguinContext } from '../../context/PenguinContext';

const PenguinSheet = () => {
  const { penguins } = usePenguinContext();

  const downloadCSV = () => {
    if (!penguins || penguins.length === 0) {
      alert('No penguin data available to export');
      return;
    }

    // Define CSV headers
    const headers = ['Name', 'Species', 'Age', 'Location', 'Weight (kg)', 'Height (cm)', 'Created At'];
    
    // Convert penguins data to CSV rows
    const rows = penguins.map(penguin => [
      penguin.name || '',
      penguin.species || '',
      penguin.age !== null && penguin.age !== undefined ? penguin.age : '',
      penguin.location || '',
      penguin.weight !== null && penguin.weight !== undefined ? penguin.weight : '',
      penguin.height !== null && penguin.height !== undefined ? penguin.height : '',
      penguin.createdAt ? new Date(penguin.createdAt).toLocaleDateString() : ''
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => {
        // Escape cells that contain commas or quotes
        const cellStr = String(cell);
        if (cellStr.includes(',') || cellStr.includes('"') || cellStr.includes('\n')) {
          return `"${cellStr.replace(/"/g, '""')}"`;
        }
        return cellStr;
      }).join(','))
    ].join('\n');

    // Create a Blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `penguin_database_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button className="csv-export-btn" onClick={downloadCSV}>
      📊 Export to CSV
    </button>
  );
};

export default PenguinSheet;