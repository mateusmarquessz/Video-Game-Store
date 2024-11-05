import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Header from './Header';
import './css/GamePage.css'; // Importando o CSS

function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/games/${id}`);
        setGame(response.data);
      } catch (error) {
        console.error("There was an error fetching the game!", error);
        setError("Não foi possível carregar os dados do jogo.");
      }
    };

    fetchGame();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!game) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="game-page">
        <div className="game-image">
          <img src={game.imageUrl} alt={game.name} />
        </div>
        <div className="game-details">
          <h1 className='game-name'>{game.name}</h1>
          <p className="genre">Gênero: {game.genre}</p>
          <p className="support">Tipo de Suporte: {game.typeOfSupport}</p>
          <p className="price">Preço: R${game.price.toFixed(2)}</p>
          <button className="buy-button">Comprar</button>
        </div>
      </div>
    </>
  );
}

export default GamePage;
