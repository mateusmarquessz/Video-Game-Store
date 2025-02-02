import React, { useState, useEffect } from 'react';
import './css/Checkout.css';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';
import { useCartFavorites } from './CartFavoritesContext'; // Importa o contexto

function CheckoutPage() {
    const {
        cartItems,
        removeFromCart,
        fetchCart,
    } = useCartFavorites(); // Obtém métodos e estados do contexto

    const [selectedGames, setSelectedGames] = useState([]); // Estado local para jogos selecionados
    const [cartTotal, setCartTotal] = useState(0); // Total calculado
    const [error, setError] = useState('');
    const [isFetchingCart, setIsFetchingCart] = useState(true); // Flag para controlar a requisição do carrinho
    const navigate = useNavigate();

    // Atualiza os jogos selecionados ao marcar/desmarcar checkboxes
    const toggleGameSelection = (gameId) => {
        setSelectedGames((prevState) => {
            if (prevState.includes(gameId)) {
                return prevState.filter((id) => id !== gameId);
            } else {
                return [...prevState, gameId];
            }
        });
    };

    // Recalcula o total dos jogos selecionados
    const calculateTotal = () => {
        const total = cartItems
            .filter((item) => selectedGames.includes(item.id))
            .reduce((acc, item) => acc + item.price, 0);
        setCartTotal(total);
    };

    // Finaliza a compra dos jogos selecionados
    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const gameIds = selectedGames.join(',');

            // Realiza o checkout dos jogos selecionados
            await axios.post(
                `https://video-game-store-aczz.onrender.com/users/${userId}/checkout/${gameIds}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            // Atualiza o estado após o checkout
            selectedGames.forEach((gameId) => removeFromCart(gameId));
            setSelectedGames([]); 
            setCartTotal(0);

            // Redireciona para a página de parabéns pela compra
            navigate('/congratulationsPurchase');
        } catch (error) {
            setError('Error completing checkout. Please try again.');
            console.error('Error during checkout:', error);
        }
    };

    useEffect(() => {
        // Garante que o carrinho é atualizado apenas uma vez
        if (!isFetchingCart) return;

        const fetchCartData = async () => {
            setIsFetchingCart(true); // Começa o processo de requisição
            await fetchCart(); // Garante que os itens do carrinho estão atualizados
            setIsFetchingCart(false); // Marca o fim da requisição
        };

        fetchCartData(); // Executa a função de requisição
    }, [fetchCart, isFetchingCart]); // O useEffect só será executado uma vez

    useEffect(() => {
        calculateTotal(); // Recalcula o total sempre que os jogos selecionados ou o carrinho mudam
    }, [selectedGames, cartItems]);

    return (
        <>
            <Header />
            <div className="checkout-content">
                <div className="checkout-container">
                    <h1>Checkout</h1>
                    {error && <p className="error-message">{error}</p>}
                    {cartItems.length > 0 ? (
                        <div className="checkout-items">
                            <ul>
                                {cartItems.map((item) => (
                                    <li key={item.id} className="checkout-item">
                                        <img
                                            src={item.imageUrl || `data:image/jpeg;base64,${item.image}`}
                                            alt={item.name}
                                            className="checkout-item-image"
                                        />
                                        <div className="checkout-item-details">
                                            <h4>{item.name}</h4>
                                            <p>Price: ${item.price.toFixed(2)}</p>
                                        </div>

                                        <input
                                            type="checkbox"
                                            id={`checkbox-${item.id}`}
                                            checked={selectedGames.includes(item.id)}
                                            onChange={() => toggleGameSelection(item.id)}
                                        />
                                        <label htmlFor={`checkbox-${item.id}`} className="checkbox-custom"></label>

                                        <button
                                            className="remove-item-button"
                                            onClick={() => removeFromCart(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="checkout-summary">
                                <h3>Total: ${cartTotal.toFixed(2)}</h3>
                                <button
                                    className="checkout-button"
                                    onClick={handleCheckout}
                                    disabled={selectedGames.length === 0 || isFetchingCart}
                                >
                                    {isFetchingCart ? 'Processing...' : 'Finalizar Compra'}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Your cart is empty.</p>
                    )}
                </div>
            </div>
        </>
    );
}

export default CheckoutPage;
