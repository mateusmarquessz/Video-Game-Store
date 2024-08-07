import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/MainContent.css';

function MainContent({ filters }) {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({
    name: '',
    genre: '',
    typeOfSupport: '',
    price: ''
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const response = await axios.get('http://localhost:8080/games', { params: filters });
        setGames(response.data);
      } catch (error) {
        console.error("There was an error fetching the games!", error);
      }
    };
    
    fetchGames();
  }, [filters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame(prevGame => ({ ...prevGame, [name]: value }));
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8080/games', newGame);
      setGames(prevGames => [...prevGames, response.data]);
      setNewGame({ name: '', genre: '', typeOfSupport: '', price: '' });
    } catch (error) {
      console.error("There was an error adding the game!", error);
    }
  };

  const handleDeleteGame = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/games/${id}`);
      setGames(prevGames => prevGames.filter(game => game.id !== id));
    } catch (error) {
      console.error("There was an error deleting the game!", error);
    }
  };

  return (
    <main className="main-content">
      <div className="game-thumbnails">
        {games.map((game) => (
          <div className="thumbnail" key={game.id}>
            <h3>{game.name}</h3>
            <p>Gênero: {game.genre}</p>
            <p>Suporte: {game.typeOfSupport}</p>
            <p>Preço: R${game.price.toFixed(2)}</p>
            <button onClick={() => handleDeleteGame(game.id)}>Excluir</button>
          </div>
        ))}
      </div>
      <form className="add-game-form" onSubmit={handleAddGame}>
        <h3>Adicionar Novo Jogo</h3>
        <input
          type="text"
          name="name"
          value={newGame.name}
          onChange={handleChange}
          placeholder="Nome do jogo"
          required
        />
        <input
          type="text"
          name="genre"
          value={newGame.genre}
          onChange={handleChange}
          placeholder="Gênero"
          required
        />
        <input
          type="text"
          name="typeOfSupport"
          value={newGame.typeOfSupport}
          onChange={handleChange}
          placeholder="Tipo de Suporte"
          required
        />
        <input
          type="number"
          name="price"
          value={newGame.price}
          onChange={handleChange}
          placeholder="Preço"
          required
        />
        <button type="submit">Adicionar Jogo</button>
      </form>
    </main>
  );
}

export default MainContent;
