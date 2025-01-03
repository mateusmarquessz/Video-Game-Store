import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const CartFavoritesContext = createContext();

export const useCartFavorites = () => useContext(CartFavoritesContext);

export const CartFavoritesProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  const fetchFavorites = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`https://localhost:8080/users/${userId}/favorites`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFavorites(response.data);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    }
  };

  const fetchCart = async () => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      const response = await axios.get(`https://localhost:8080/users/${userId}/Cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCartItems(response.data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    }
  };

  const addToCart = async (gameId) => {
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('userId');
  
    if (!token || !userId) {
      setError('You must be logged in to add items to the cart.');
      return;
    }
  
    try {
      // Realiza o POST para adicionar o item ao carrinho
      await axios.post(`https://localhost:8080/users/${userId}/Cart/${gameId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      // Atualiza o carrinho chamando a função fetchCart
      fetchCart();
    } catch (error) {
      setError('Error adding to cart. Please try again.');
      console.error('Error adding to cart:', error);
    }
  };
    
  const removeFromCart = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await axios.delete(`https://localhost:8080/users/${userId}/Cart/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
      setCartItems((prev) => prev.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error('Error removing from cart:', error);
    }
  };

  const addToFavorites = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await axios.post(`https://localhost:8080/users/${userId}/favorites/${gameId}`, null, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFavorites();
      // Adicionando o objeto completo ao estado de favoritos
      setFavorites((prev) => [...prev, { id: gameId }]);
    } catch (error) {
      console.error('Error adding to favorites:', error);
    }
  };

  const removeFromFavorites = async (gameId) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      await axios.delete(`https://localhost:8080/users/${userId}/favorites/${gameId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchFavorites();
      setFavorites((prev) => prev.filter((game) => game.id !== gameId));
    } catch (error) {
      console.error('Error removing from favorites:', error);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchFavorites();
  }, []);

  const isInCart = (gameId) => cartItems.some((game) => game.id === gameId);

  const isFavorite = (gameId) => favorites.some((game) => game.id === gameId);

  return (
    <CartFavoritesContext.Provider
      value={{
        cartItems,
        favorites,
        addToCart,
        removeFromCart,
        addToFavorites,
        removeFromFavorites,
        error,
        fetchCart,
        isInCart,
        isFavorite,
      }}
    >
      {children}
    </CartFavoritesContext.Provider>
  );
};
