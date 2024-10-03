// MainPage.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Slider from 'react-slick';
import './css/MainContent.css';
import Sidebar from './Sidebar';
import Header from './Header';

function MainPage() {
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

        if (filters.categories.length) {
          filters.categories.forEach(category => query.append('category', category));
        }
        if (filters.platforms.length) {
          filters.platforms.forEach(platform => query.append('platform', platform));
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

  // Configurações do carrossel
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1
  };

  return (
    <>
      <Header /> {/* Renderize o Header aqui */}
      <div className='content'>
        <div className="main-content">
          <Sidebar onFilterChange={handleFilterChange} />
          {}
          <div className="carousel-container">
            <Slider {...carouselSettings}>
              {games.map((game, index) => (
                <div className="carousel-slide" key={index}>
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
          {/* Seção de Miniaturas dos Jogos */}
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default MainPage;
