// Sidebar.jsx
import React, { useState } from 'react';
import './css/Sidebar.css';

function Sidebar({ onFilterChange }) {
  const [categories, setCategories] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategories((prevCategories) =>
      e.target.checked
        ? [...prevCategories, value]
        : prevCategories.filter((category) => category !== value)
    );
  };

  const handlePlatformChange = (e) => {
    const value = e.target.value;
    setPlatforms((prevPlatforms) =>
      e.target.checked
        ? [...prevPlatforms, value]
        : prevPlatforms.filter((platform) => platform !== value)
    );
  };

  const handlePriceChange = (e) => {
    const { name, value } = e.target;
    setPriceRange((prevPriceRange) => ({
      ...prevPriceRange,
      [name]: value
    }));
  };

  const applyFilters = () => {
    console.log('Aplicar Filtros:', {
      categories,
      platforms,
      priceRange
    });
    onFilterChange({
      categories,
      platforms,
      priceRange
    });
  };

  return (
    <aside className="sidebar">
      <div className="filter">
        <h3>Categorias</h3>
        {['Indy', 'Aventura', 'MMO', 'Jogo casual', 'Estratégia', 'Simulador', 'Esportes', 'Ação'].map((category) => (
          <label key={category}>
            <input
              type="checkbox"
              value={category}
              onChange={handleCategoryChange}
            />
            {category}
          </label>
        ))}
      </div>
      <div className="filter">
        <h3>Plataformas</h3>
        {['PC', 'PlayStation 5', 'PlayStation 4', 'Xbox Series', 'Nintendo Switch'].map((platform) => (
          <label key={platform}>
            <input
              type="checkbox"
              value={platform}
              onChange={handlePlatformChange}
            />
            {platform}
          </label>
        ))}
      </div>
      <div className="filter">
        <h3>Preço</h3>
        <div className="price-range">
          <label>
            <input
              type="number"
              name="min"
              value={priceRange.min}
              onChange={handlePriceChange}
              placeholder="R$ 0,00"
            />
          </label>
          <i>-</i>
          <label>
            <input
              type="number"
              name="max"
              value={priceRange.max}
              onChange={handlePriceChange}
              placeholder="R$ 100,00"
            />
          </label>
        </div>
      </div>
      <button className="apply-filters" onClick={applyFilters}>Aplicar Filtros</button>
    </aside>
  );
}

export default Sidebar;
