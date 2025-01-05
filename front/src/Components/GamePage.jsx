import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Header from "./Header";
import { useAuth } from "./AuthContext";
import { useCartFavorites } from "./CartFavoritesContext";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import "./css/GamePage.css";

const classificationImages = {
  "Livre": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-livre-logo.png",
  "10": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-10-anos-logo.png",
  "12": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-12-anos-logo-1.png",
  "14": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-14-anos-logo.png",
  "16": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-16-anos-logo.png",
  "18": "https://logodownload.org/wp-content/uploads/2017/07/classificacao-18-anos-logo.png",
};

const getClassificationImage = (ageRating) => {
  const classification = ageRating?.match(/\d+/)?.[0] || "Livre";
  return classificationImages[classification] || classificationImages["Livre"];
};

function GamePage() {
  const { id } = useParams();
  const [game, setGame] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState({});
  const { isAuthenticated, userRole } = useAuth();
  const {
    favorites,
    cartItems,
    addToFavorites,
    removeFromFavorites,
    addToCart,
    removeFromCart,
    isFavorite,
    isInCart,
  } = useCartFavorites();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const response = await axios.get(`https://video-game-store-aczz.onrender.com/games/${id}`);
        const gameData = response.data;

        if (typeof gameData.systemRequirements === "string") {
          gameData.systemRequirements = gameData.systemRequirements.split("\n\n");
        } else if (!Array.isArray(gameData.systemRequirements)) {
          gameData.systemRequirements = [];
        }

        setGame(gameData);
        setEditedInfo({
          ageRating: gameData.ageRating,
          systemRequirements: gameData.systemRequirements,
          description: gameData.description,
        });
      } catch (error) {
        console.error("There was an error fetching the game!", error);
        setError("Não foi possível carregar os dados do jogo.");
      }
    };

    fetchGame();
  }, [id]);

  const toggleFavorite = (game) => {
    if (isFavorite(game.id)) {
      removeFromFavorites(game.id);
    } else {
      addToFavorites(game.id);
    }
  };

  const toggleCart = (game) => {
    if (isInCart(game.id)) {
      removeFromCart(game.id);
    } else {
      addToCart(game.id);
    }
  };

  const handleEditChange = (field, value) => {
    setEditedInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveChanges = async () => {
    const updatedGameData = {
      ageRating: editedInfo.ageRating,
      systemRequirements: editedInfo.systemRequirements.join("\n\n"),
      description: editedInfo.description,
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(`https://video-game-store-aczz.onrender.com/games/${game.id}`, updatedGameData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGame((prev) => ({
        ...prev,
        ...editedInfo,
      }));
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving game information:", error);
    }
  };

  if (error) return <div className="error">{error}</div>;
  if (!game) return <div>Loading...</div>;

  return (
    <>
      <Header />
      <div className="game-page">
        <div className="game-image">
          <img src={game.imageUrl} alt={game.name} />
        </div>
        <div className="game-details">
          <div className="gambiarra">
            <h1 className="game-name">{game.name}</h1>
            <button
              className="favorite-button-gamepage"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(game);
              }}
            >
              {isFavorite(game.id) ? (
                <FaHeart color="#e58e27" style={{ borderColor: "#161a1e" }} />
              ) : (
                <FaRegHeart />
              )}
            </button>
          </div>
          <p className="genre">Gênero: {game.genre}</p>
          <p className="support">Tipo de Suporte: {game.typeOfSupport}</p>
          <p className="price">Preço: R${game.price.toFixed(2)}</p>
          <button
            className="buy-button"
            onClick={(e) => {
              e.stopPropagation();
              toggleCart(game);
            }}
          >
            {isInCart(game.id) ? "Remover do Carrinho" : "Adicionar ao Carrinho"}
          </button>
        </div>
        <div className="additional-info">
          <h2>Informações Adicionais</h2>
          {isEditing ? (
            <div>
              <label>
                <strong>Descrição:</strong>
                <textarea
                  value={editedInfo.description || ""}
                  onChange={(e) => handleEditChange("description", e.target.value)}
                />
              </label>
              <label>
                <strong>Requisitos do Sistema:</strong>
                <textarea
                  value={editedInfo.systemRequirements.join("\n\n")}
                  onChange={(e) =>
                    handleEditChange(
                      "systemRequirements",
                      e.target.value.split("\n\n").map((item) => item.trim())
                    )
                  }
                />
              </label>
              <label>
                <strong>Classificação Indicativa:</strong>
                <input
                  type="text"
                  value={editedInfo.ageRating || ""}
                  onChange={(e) => handleEditChange("ageRating", e.target.value)}
                />
              </label>
              <button onClick={saveChanges}>Salvar</button>
              <button onClick={() => setIsEditing(false)}>Cancelar</button>
            </div>
          ) : (
            <div>
              {userRole === "ROLE_ADMIN" && (
                <button onClick={() => setIsEditing(true)}>Editar Informações</button>
              )}
              <p><strong>Descrição:</strong> {game.description}</p>
              <p><strong>Requisitos do Sistema:</strong></p>
              {game.systemRequirements.map((part, index) => (
                <div key={index}>
                  <p><strong>{index === 0 ? "Mínimos" : "Recomendados"}:</strong></p>
                  <ul>
                    {part.split("\n").map((detail, detailIndex) => (
                      <li key={detailIndex}>{detail}</li>
                    ))}
                  </ul>
                </div>
              ))}
              <p>
                <img
                  className="ratingImg"
                  src={getClassificationImage(game.ageRating)}
                  alt={`Classificação ${game.ageRating}`}
                />
                <strong>Classificação Indicativa:</strong> {game.ageRating}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default GamePage;
