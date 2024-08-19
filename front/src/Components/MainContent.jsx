import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/MainContent.css';

function MainContent({ isAuthenticated }) {
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({
    name: '',
    genre: '',
    typeOfSupport: '',
    price: '',
    image: null
  });

  useEffect(() => {
    const fetchGames = async () => {
      try {
       const token = localStorage.getItem("token");
        const response = await axios.get('http://localhost:8080/games', {headers: {'Authorization': `Bearer ${token}`}});
        setGames(response.data);
      } catch (error) {
        console.error("There was an error fetching the games!", error);
      }
    };
    
    fetchGames();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame(prevGame => ({ ...prevGame, [name]: value }));
  };

  const handleAddGame = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return; // Do nothing if not authenticated

    try {
      const formData = new FormData();
      formData.append('name', newGame.name);
      formData.append('genre', newGame.genre);
      formData.append('typeOfSupport', newGame.typeOfSupport);
      formData.append('price', newGame.price);
      if (newGame.image) {
        formData.append('image', newGame.image);
      }
      
      const token = localStorage.getItem('token'); // Retrieve the JWT token

      const response = await axios.post('http://localhost:8080/games', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}` // Add the token to the header
        }
      });

      setGames(prevGames => [...prevGames, response.data]);
      setNewGame({ name: '', genre: '', typeOfSupport: '', price: '', image: null });
    } catch (error) {
      console.error("There was an error adding the game!", error);
    }
  };

  const handleDeleteGame = async (id) => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem('token'); // Retrieve the JWT token

      await axios.delete(`http://localhost:8080/games/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}` // Add the token to the header
        }
      });
      setGames(prevGames => prevGames.filter(game => game.id !== id));
    } catch (error) {
      console.error("There was an error deleting the game!", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setNewGame(prevGame => ({
        ...prevGame,
        image: reader.result
      }));
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };

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
            {isAuthenticated && <button className='addgame' onClick={() => handleDeleteGame(game.id)}>Excluir</button>}
          </div>
        ))}
      </div>
      {isAuthenticated && (
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
          <input
            type="file"
            name="image"
            onChange={handleImageChange}
          />
          <button type="submit">Adicionar Jogo</button>
        </form>
      )}
    </main>
  );
}

export default MainContent;
