import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/MainContent.css';

function MainContent({ isAuthenticated }) {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8080/games', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setGames(response.data);
      } catch (error) {
        console.error("There was an error fetching the games!", error);
      }
    };

    fetchGames();
  }, []);

  return (
    <main className="main-content">
      <div className="game-thumbnails">
        {games.map((game) => (
          <div className="thumbnail" key={game.id}>
            {game.image && <img src={game.image} alt={game.name} className="game-image" />}
            <h3>{game.name}</h3>
            <p>Gênero: {game.genre}</p>
            <p>Suporte: {game.typeOfSupport}</p>
            <p>Preço: R${game.price.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </main>
  );
}

export default MainContent;
