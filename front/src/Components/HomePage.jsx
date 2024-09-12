import React from 'react';
import './css/HomePage.css';

function HomePage() {
  return (
    <div className="home-page">
      <header className="hero-section">
        <h1>Bem-vindo ao Game Store!</h1>
        <p>Explore os melhores jogos, acompanhe as últimas novidades e descubra ofertas incríveis.</p>
      </header>
      <section className="features">
        <h2>Destaques</h2>
        <div className="feature-list">
          <div className="feature-item">
            <h3>Jogos Recentes</h3>
            <p>Veja os lançamentos mais recentes e não perca as novidades do mundo dos jogos.</p>
          </div>
          <div className="feature-item">
            <h3>Ofertas Especiais</h3>
            <p>Encontre ofertas e descontos exclusivos para você.</p>
          </div>
          <div className="feature-item">
            <h3>Notícias</h3>
            <p>Fique por dentro das últimas notícias e atualizações do universo dos games.</p>
          </div>
        </div>
      </section>
      <section className="call-to-action">
        <h2>Comece a Explorar</h2>
        <p>Não espere mais! Navegue pela nossa loja e descubra tudo o que temos a oferecer.</p>
        <button onClick={() => window.location.href = '/game-store'}>Ver Jogos</button>
      </section>
    </div>
  );
}

export default HomePage;
