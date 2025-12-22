import React, { useState } from 'react';
import { usePenguinContext } from '../../context/PenguinContext';
import PenguinCard from './PenguinCard';
import { penguinService } from '../../services/penguinService';

const PenguinSearch = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasSearched, setHasSearched] = useState(false);

    const handleSearch = async (e) => {
        e.preventDefault();
        
        if (!searchTerm.trim()) {
            setError('Please enter a search term');
            return;
        }

        setLoading(true);
        setError(null);
        setHasSearched(true);

        const result = await penguinService.searchPenguins(searchTerm);
        
        if (result.success) {
            setSearchResults(result.data);
            console.log('Search Results:', result.data);
            console.log(`Found ${result.data.length} penguin(s) matching "${searchTerm}"`);
        } else {
            setError(result.error || 'Failed to search penguins');
        }
        
        setLoading(false);
    };

    return(
        <div className="penguin-search">
            <p>Search Penguins</p>
            <form onSubmit={handleSearch}>
                <input 
                    type="text" 
                    placeholder="Search by name or species..." 
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button type="submit" disabled={loading} className='search-penguin-btn'>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>

            {error && <div className="error-message">{error}</div>}

            {hasSearched && !loading && (
                <div className="search-results">
                    <h3>Search Results ({searchResults.length})</h3>
                    {searchResults.length === 0 ? (
                        <p>No penguins found matching "{searchTerm}"</p>
                    ) : (
                        <div className="penguin-list">
                            {searchResults.map(penguin => (
                                <PenguinCard key={penguin._id} penguin={penguin} />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default PenguinSearch;
