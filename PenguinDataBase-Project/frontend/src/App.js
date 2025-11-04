import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [message, setMessage] = useState('');
  const [penguins, setPenguins] = useState([]);
  const [stats, setStats] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    species: '',
    age: '',
    location: '',
    weight: '',
    height: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Test backend connection and load penguins
    fetchBackendData();
    fetchPenguins();
  }, []);

  const fetchBackendData = async () => {
    try {
      const response = await fetch('http://localhost:5000/');
      const data = await response.json();
      setMessage(data.message);
    } catch (error) {
      console.error('Error connecting to backend:', error);
      setMessage('Unable to connect to backend. Make sure the server is running on port 5000.');
    }
  };

  const fetchPenguins = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/penguins');
      const data = await response.json();
      setPenguins(data);
      
      // Also fetch stats
      const statsResponse = await fetch('http://localhost:5000/api/penguins/stats');
      const statsData = await statsResponse.json();
      setStats(statsData);
    } catch (error) {
      console.error('Error fetching penguins:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/penguins', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message);
        setFormData({
          name: '',
          species: '',
          age: '',
          location: '',
          weight: '',
          height: ''
        });
        fetchPenguins(); // Refresh the list
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error adding penguin:', error);
      alert('Failed to add penguin');
    } finally {
      setLoading(false);
    }
  };

  const deletePenguin = async (id) => {
    if (!window.confirm('Are you sure you want to delete this penguin?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/penguins/${id}`, {
        method: 'DELETE'
      });
      
      const result = await response.json();
      
      if (response.ok) {
        alert(result.message);
        fetchPenguins(); // Refresh the list
      } else {
        alert('Error: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting penguin:', error);
      alert('Failed to delete penguin');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>🐧 Penguin Database</h1>
        
        <div className="connection-status">
          {/* */}
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

        {/* Penguin Form */}
        <div className="penguin-form-container">
          <h2>Add New Penguin</h2>
          <form onSubmit={handleSubmit} className="penguin-form">
            <div className="form-row">
              <input
                type="text"
                name="name"
                placeholder="Penguin Name *"
                value={formData.name}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                name="species"
                placeholder="Species *"
                value={formData.species}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                name="age"
                placeholder="Age (years)"
                value={formData.age}
                onChange={handleInputChange}
              />
              <input
                type="text"
                name="location"
                placeholder="Location"
                value={formData.location}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-row">
              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={formData.weight}
                onChange={handleInputChange}
                step="0.1"
              />
              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={formData.height}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" disabled={loading}>
              {loading ? 'Adding...' : '🐧 Add Penguin'}
            </button>
          </form>
        </div>

        {/* Penguin List */}
        <div className="penguin-list-container">
          <h2>Penguin Collection ({penguins.length})</h2>
          {penguins.length === 0 ? (
            <p>No penguins in the database yet. Add one above! 🐧</p>
          ) : (
            <div className="penguin-grid">
              {penguins.map((penguin) => (
                <div key={penguin._id} className="penguin-card">
                  <h3>🐧 {penguin.name}</h3>
                  <p><strong>Species:</strong> {penguin.species}</p>
                  {penguin.age && <p><strong>Age:</strong> {penguin.age} years</p>}
                  {penguin.location && <p><strong>Location:</strong> {penguin.location}</p>}
                  {penguin.weight && <p><strong>Weight:</strong> {penguin.weight} kg</p>}
                  {penguin.height && <p><strong>Height:</strong> {penguin.height} cm</p>}
                  <p><strong>Added:</strong> {new Date(penguin.createdAt).toLocaleDateString()}</p>
                  <button 
                    onClick={() => deletePenguin(penguin._id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>
    </div>
  );
}

export default App;
