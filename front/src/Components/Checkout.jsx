import React, { useState, useEffect } from 'react';
import './css/Checkout.css';
import axios from 'axios';
import Header from './Header';
import { useNavigate } from 'react-router-dom';

function CheckoutPage() {
    const [cartItems, setCartItems] = useState([]);
    const [cartTotal, setCartTotal] = useState(0);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Função para obter os itens do carrinho
    const fetchCartItems = async () => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');
            const response = await axios.get(`http://localhost:8080/users/${userId}/Cart`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setCartItems(response.data);
            const total = response.data.reduce((acc, item) => acc + item.price, 0);
            setCartTotal(total);
        } catch (error) {
            setError('Error fetching cart items. Please try again.');
            console.error('Error fetching cart items:', error);
        }
    };

    // Função para fazer o checkout
    const handleCheckout = async () => {
        try {
            const userId = localStorage.getItem('userId');
            const token = localStorage.getItem('token');

            // Envia os itens do carrinho para o backend
            const gamesToPurchase = cartItems.map(item => ({
                gameId: item.id,
                price: item.price,
            }));

            const response = await axios.post(
                `http://localhost:8080/api/orders/${userId}`,
                { games: gamesToPurchase },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (response.data) {
                alert('Purchase completed successfully!');
                // Limpar o carrinho no frontend
                setCartItems([]);
                setCartTotal(0);
                // Navegar para página de agradecimento ou algo semelhante
                navigate('/thank-you');
            } else {
                setError('Error during checkout. Please try again.');
            }
        } catch (error) {
            console.error('Error during checkout:', error);
            setError('Error during checkout. Please try again.');
        }
    };

    // Função para remover um item do carrinho
    const handleRemoveItem = async (itemId) => {
        try {
            const token = localStorage.getItem('token');
            const userId = localStorage.getItem('userId');

            // Fazendo a requisição para remover o item do carrinho
            await axios.delete(`http://localhost:8080/users/${userId}/Cart/${itemId}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            // Atualiza o estado do carrinho após remover o item
            setCartItems((prevItems) => prevItems.filter(item => item.id !== itemId));
            const total = cartItems.reduce((acc, item) => acc + item.price, 0);
            setCartTotal(total);
        } catch (error) {
            console.error('Error removing item:', error);
            setError('Error removing item. Please try again.');
        }
    };

    // UseEffect para carregar os itens do carrinho ao montar o componente
    useEffect(() => {
        fetchCartItems();
    }, []);

    return (
        <>
            <Header />
            <div className='checkout-content'>
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
                                        <button
                                            className="remove-item-button"
                                            onClick={() => handleRemoveItem(item.id)}
                                        >
                                            Remove
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div className="checkout-summary">
                                <h3>Total: ${cartTotal.toFixed(2)}</h3>
                                <button className="checkout-button" onClick={handleCheckout}>
                                    Finalizar Compra
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
