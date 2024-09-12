// UserPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/MainContent.css';
import Sidebar from './Sidebar';

function UserPage() {
  const [games, setGames] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    platforms: [],
    priceRange: { min: '', max: '' }
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("token");
        const query = new URLSearchParams();

        // Append filters to the query string if they are not empty
        if (filters.categories.length) {
          filters.categories.forEach((category) => query.append('category', category));
        }
        if (filters.platforms.length) {
          filters.platforms.forEach((platform) => query.append('platform', platform));
        }
        if (filters.priceRange.min) {
          query.append('minPrice', filters.priceRange.min);
        }
        if (filters.priceRange.max) {
          query.append('maxPrice', filters.priceRange.max);
        }

        console.log('Fetching games with query:', query.toString());

        const response = await axios.get(`http://localhost:8080/games?${query.toString()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setGames(response.data);
      } catch (error) {
        console.error("There was an error fetching the games!", error);
      }
    };

    fetchGames();
  }, [filters]);

  const handleFilterChange = (newFilters) => {
    console.log('Filter changed:', newFilters);
    setFilters(newFilters);
  };

  return (
    <>
      <div className="main-content">
        <Sidebar onFilterChange={handleFilterChange} />
      </div>
      <div className="game-thumbnails">
        {games.map((game, index) => (
          <div className="thumbnails" key={index}>
            {game.image && <img src={game.image} alt={game.name} className="game-image" />}
            <h3>{game.name}</h3>
            <p>{game.typeOfSupport}</p>
            <p>{game.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </>
  );
}

export default UserPage;
