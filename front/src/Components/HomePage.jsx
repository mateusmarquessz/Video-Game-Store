import React from 'react';
import { Link } from 'react-router-dom'; // Importa o Link para navegação
import Header from './Header'; // Importa o Header
import './css/HomePage.css';

function HomePage() {
  return (
    <>
      <Header /> {/* Renderiza o Header */}
      <div className='content'>
        <div className="home-page">
          <header className="hero-section">
            <h1>Bem-vindo ao Game Store!</h1>
            <p>Explore os melhores jogos, acompanhe as últimas novidades e descubra ofertas incríveis.</p>
          </header>
          <section className="features">
            <h2>Destaques</h2>
            <div className="feature-list">
              {/* Link para a página de Jogos Recentes */}
              <Link to="/recentGames" className="feature-item">
                <h3>Jogos Recentes</h3>
                <p>Veja os lançamentos mais recentes e não perca as novidades do mundo dos jogos.</p>
              </Link>
              {/* Link para a página de Ofertas Especiais */}
              <Link to="/gamestore" className="feature-item">
                <h3>Ofertas Especiais</h3>
                <p>Encontre ofertas e descontos exclusivos para você.</p>
              </Link>
              {/* Link para a página de Notícias */}
              <Link to="/news" className="feature-item">
                <h3>Notícias</h3>
                <p>Fique por dentro das últimas notícias e atualizações do universo dos games.</p>
              </Link>
            </div>
          </section>
          <section className="call-to-action">
            <h2>Comece a Explorar</h2>
            <p>Não espere mais! Navegue pela nossa loja e descubra tudo o que temos a oferecer.</p>
          </section>
        </div>
      </div>
    </>
  );
}

export default HomePage;
