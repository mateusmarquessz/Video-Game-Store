import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './css/AdminPage.css';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from './AuthContext'; // Importar o hook de autenticação

function MainContent() {
  const { isAuthenticated } = useAuth(); // Obter isAuthenticated do contexto
  const [games, setGames] = useState([]);
  const [newGame, setNewGame] = useState({
    name: '',
    genre: '',
    typeOfSupport: '',
    price: '',
    image: null
  });

  // Função para buscar a lista de jogos do servidor
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

  // Função para lidar com mudanças nos campos de entrada do formulário
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewGame(prevGame => ({ ...prevGame, [name]: value }));
  };

  // Função para adicionar um novo jogo ao servidor
  const handleAddGame = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) return; // Se não estiver autenticado, não deve adicionar jogos

    try {
      const formData = new FormData();
      formData.append('name', newGame.name);
      formData.append('genre', newGame.genre);
      formData.append('typeOfSupport', newGame.typeOfSupport);
      formData.append('price', newGame.price);
      if (newGame.image) {
        formData.append('image', newGame.image);
      }

      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:8080/games', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });

      setGames(prevGames => [...prevGames, response.data]);
      setNewGame({ name: '', genre: '', typeOfSupport: '', price: '', image: null });
    } catch (error) {
      console.error("There was an error adding the game!", error);
    }
  };

  // Função para excluir um jogo do servidor
  const handleDeleteGame = async (id) => {
    if (!isAuthenticated) return;

    try {
      const token = localStorage.getItem('token');

      await axios.delete(`http://localhost:8080/games/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setGames(prevGames => prevGames.filter(game => game.id !== id));
    } catch (error) {
      console.error("There was an error deleting the game!", error);
    }
  };

  // Função para lidar com mudanças na seleção de imagem
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewGame(prevGame => ({
      ...prevGame,
      image: file
    }));
  };

  return (
    <>
      <Header isAuthenticated={isAuthenticated} /> {/* Usando o componente de cabeçalho */}
      <div className='main-div'>
      <Sidebar />
      <main className="main-content">
        <div className="game-thumbnails">
          {games.length === 0 ? (
            <p>Nenhum jogo disponível.</p>
          ) : (
            games.map((game) => (
              <div className="thumbnail" key={game.id}>
                {game.imageUrl && <img src={game.imageUrl} alt={game.name} className="game-image" />}
                <h3>{game.name}</h3>
                <p>Gênero: {game.genre}</p>
                <p>Suporte: {game.typeOfSupport}</p>
                <p>Preço: R${game.price.toFixed(2)}</p>
                {isAuthenticated && <button className='delete-game' onClick={() => handleDeleteGame(game.id)}>Excluir</button>}
              </div>
            ))
          )}
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
            <button type="submit" className='add-game'>Adicionar Jogo</button>
          </form>
        )}
      </main>
      </div>
    </>
  );
}

export default MainContent;
