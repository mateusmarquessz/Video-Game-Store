import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Slider from 'react-slick';
import './css/MainContent.css';
import Sidebar from './Sidebar';
import Header from './Header';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

function MainPage() {
  const [games, setGames] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [filters, setFilters] = useState({
    categories: [],
    platforms: [],
    priceRange: { min: '', max: '' }
  });
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/games`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setGames(response.data);
      } catch (error) {
        console.error("There was an error fetching the games!", error);
      }
    };

    fetchGames();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8080/users/${userId}/favorites`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const favoriteIds = response.data.map(game => game.id);
        setFavorites(favoriteIds);
      } catch (error) {
        console.error("Error fetching favorites!", error);
      }
    };

    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleRedirect = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  const toggleFavorite = async (gameId) => {
    try {
      const token = localStorage.getItem("token");
      if (favorites.includes(gameId)) {
        await axios.delete(`http://localhost:8080/users/${userId}/favorites/${gameId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFavorites((prevFavorites) => prevFavorites.filter(id => id !== gameId));
      } else {
        const game = { id: gameId };
        await axios.post(`http://localhost:8080/users/${userId}/favorites`, game, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setFavorites((prevFavorites) => [...prevFavorites, gameId]);
      }
    } catch (error) {
      console.error("Error toggling favorite!", error);
    }
  };

  const isFavorite = (gameId) => {
    return favorites.includes(gameId);
  };

  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <>
      <div className='content'>
        <div className="main-content">
          <Sidebar onFilterChange={handleFilterChange} />
          <div className="carousel-container">
            <Slider {...carouselSettings}>
              {games.map((game, index) => (
                <div 
                  className="carousel-slide" 
                  key={index} 
                  onClick={() => handleRedirect(game.id)}
                  style={{ cursor: 'pointer' }}
                >
                  {game.imageUrl ? (
                    <img src={game.imageUrl} alt={game.name} className="carousel-image" />
                  ) : (
                    <p>No image available</p>
                  )}
                  <h3>{game.name}</h3>
                  <p>{game.typeOfSupport}</p>
                  <p className='game-price'>R${game.price.toFixed(2)}</p>
                </div>
              ))}
            </Slider>
          </div>
          <div className="game-thumbnails">
            {games.map((game, index) => (
              <div className="thumbnail" key={index}>
                {game.imageUrl ? (
                  <img src={game.imageUrl} alt={game.name} className="game-image" />
                ) : (
                  <p>No image available</p>
                )}
                <h3>{game.name}</h3>
                <p>{game.typeOfSupport}</p>
                <p className='game-price'>R${game.price.toFixed(2)}</p>
                <button onClick={() => handleRedirect(game.id)} className="view-game-button">
                  Ver Jogo
                </button>
                <button onClick={(e) => { e.stopPropagation(); toggleFavorite(game.id); }} className="favorite-button">
                  {isFavorite(game.id) ? (
                    <FaHeart color="#e58e27" style={{ borderColor: "#161a1e" }} />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;
