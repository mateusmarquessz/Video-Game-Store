import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Slider from 'react-slick';
import './css/MainPage.css';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { useAuth } from './AuthContext';
import { useCartFavorites } from './CartFavoritesContext';

function MainPage() {
  const [games, setGames] = useState([]);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const {
    favorites,
    addToCart,
    removeFromCart,
    addToFavorites,
    removeFromFavorites,
    isInCart,
    isFavorite,
  } = useCartFavorites();

  // Fetch games from API
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

  // Redireciona para a página do jogo
  const handleRedirect = (gameId) => {
    navigate(`/game/${gameId}`);
  };

  // Redireciona para o login se não estiver autenticado
  const handleAction = (action, gameId, actionType) => {
    if (!isAuthenticated) {
      alert('Você precisa estar logado para adicionar ao carrinho ou aos favoritos.');
      return navigate('/login'); // Redireciona para a página de login
    }

    action(gameId);

    // Exemplo de lógica condicional, se necessário
    if (actionType === 'cart') {
      isInCart(gameId) ? removeFromCart(gameId) : addToCart(gameId);
    } else if (actionType === 'favorite') {
      isFavorite(gameId) ? removeFromFavorites(gameId) : addToFavorites(gameId);
    }
  };

  // Configurações do carrossel
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 1024,
        settings: { slidesToShow: 1 },
      },
      {
        breakpoint: 600,
        settings: { slidesToShow: 1 },
      },
    ],
  };

  return (
    <div className="content">
      <div className="main-content">
        <div className="carousel-container">
          <Slider {...settings}>
            {games.slice(0, 3).map((game, index) => (
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
                <p className="game-price">R${game.price.toFixed(2)}</p>
              </div>
            ))}
          </Slider>
        </div>
        <div className="game-thumbnails">
          {games.map((game, index) => (
            <div className="thumbnail" key={index} onClick={() => handleRedirect(game.id)}>
              {game.imageUrl ? (
                <img src={game.imageUrl} alt={game.name} className="game-image" />
              ) : (
                <p>No image available</p>
              )}
              <h3>{game.name}</h3>
              <p>{game.typeOfSupport}</p>
              <p className="game-price">R${game.price.toFixed(2)}</p>
              <button
                className="view-game-button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleAction(addToCart, game.id, 'cart');
                }}
              >
                {isInCart(game.id) ? 'Remover do Carrinho' : 'Adicionar ao Carrinho'}
              </button>
              {isAuthenticated && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleAction(addToFavorites, game.id, 'favorite');
                  }}
                  className="favorite-button"
                >
                  {isFavorite(game.id) ? (
                    <FaHeart color="#e58e27" style={{ borderColor: '#161a1e' }} />
                  ) : (
                    <FaRegHeart />
                  )}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MainPage;
