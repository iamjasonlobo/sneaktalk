import React, { useEffect, useState } from 'react';
import CrewmateCard from "./components/CrewmateCard";
import { supabase } from './client';
import './App.css';

const App = () => {
  const [crewmates, setCrewmates] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('newest'); // State to track sort type

  useEffect(() => {
    fetchCrewmates();
  }, []);

  useEffect(() => {
    sortCrewmates(); // Re-sort when crewmates or sortType changes
  }, [crewmates, sortType]);

  const fetchCrewmates = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('Crewmates').select();
      if (error) throw error;
      setCrewmates(data);
      setSearchResults(data);
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  const handleSearch = () => {
    const filtered = crewmates.filter(crewmate =>
      crewmate.name.toLowerCase().includes(searchQuery)
    );
    setSearchResults(filtered);
  };

  const handleSortChange = (e) => {
    setSortType(e.target.value);
  };

  const sortCrewmates = () => {
    const sortedCrewmates = [...crewmates].sort((a, b) => {
      if (sortType === 'popular') {
        return b.upvotes - a.upvotes; // Sort by popularity (upvotes)
      } else {
        return new Date(b.created_at) - new Date(a.created_at); // Sort by newest
      }
    });
    setSearchResults(sortedCrewmates);
  };

  return (
    <div>
      <div className='searchBar'> 
      <input
        type="text"
        placeholder="Search crewmates..."
        onChange={handleSearchChange}
        value={searchQuery}/>
        <button onClick={handleSearch}>Search</button>
      </div>

      <div className='sort'>
      <select onChange={handleSortChange} value={sortType}>
        <option value="newest">Newest</option>
        <option value="popular">Popular</option>
      </select>
      </div>

      <div className="crewmate-container">
        {loading ? (
          <div className="loader"></div>
        ) : searchResults.length > 0 ? (
          searchResults.map(crewmate => (
            <CrewmateCard key={crewmate.id} crewmateId={crewmate.id} />
          ))
        ) : (
          <p>Couldn't find search query.</p>
        )}
      </div>
    </div>
  );
};

export default App;
