import React, { useEffect, useState } from 'react';
import './css/RecentGames.css';
import Header from './Header';

function RecentGames() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await fetch('https://video-game-store-aczz.onrender.com/games');
        const data = await response.json();
        setGames(data);
      } catch (error) {
        console.error('There was an error fetching the games!', error);
      }
    };

    fetchGames();
  }, []);

  return (
    <>
      <Header />
      <div className="recent-games">
        <h2>Jogos Recentemente Adicionados</h2>
        <div className="game-list-page">
          {games.map((game) => (
            <div className="game-card-page" key={game.id}>
              {game.imageUrl ? (
                <img src={game.imageUrl} alt={game.name} className="game-image-page" />
              ) : (
                <p>Imagem não disponível</p>
              )}
              <h3>{game.name}</h3>
              <p>{game.released}</p>
              <p>R${game.price ? game.price.toFixed(2) : 'Não disponível'}</p>
              <button onClick={() => window.open(`/game/${game.id}`, '_blank')}>Ver Detalhes</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default RecentGames;
