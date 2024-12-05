import React from 'react';
import './css/NewsPage.css';
import Header from './Header'; 

function NewsPage() {
  const newsArticles = [
    {
      title: "Novo Jogo Lançado: The Legend of Warriors",
      date: "12 de Outubro de 2024",
      content: "The Legend of Warriors, um RPG altamente esperado, finalmente chegou! Com gráficos impressionantes e uma jogabilidade envolvente, ele promete ser um dos melhores lançamentos do ano."
    },
    {
      title: "Atualização 2.0 de CyberRace",
      date: "10 de Agosto de 2024",
      content: "A nova atualização de CyberRace traz novas pistas, carros e um modo multiplayer mais dinâmico. Jogadores podem esperar uma experiência de corrida mais imersiva e competitiva."
    },
    {
      title: "Evento Especial: 10 Anos de GameWorld",
      date: "8 de Setembro de 2024",
      content: "Para celebrar os 10 anos de GameWorld, um dos maiores eventos de games do mundo, os organizadores preparam uma série de surpresas para os fãs, incluindo demos exclusivas e competições ao vivo."
    }
  ];

  return (
    <>
    <Header /> {/* Renderize o Header aqui */}
    <div className='content'>
    <div className="news-page">
      <h1>Últimas Notícias de Jogos</h1>
      <div className="news-list">
        {newsArticles.map((article, index) => (
          <div className="news-article" key={index}>
            <h2>{article.title}</h2>
            <p><strong>Data:</strong> {article.date}</p>
            <p>{article.content}</p>
          </div>
        ))}
      </div>
      <div className="ai-disclaimer">
            <p><strong>Aviso:</strong> As notícias acima foram geradas por Inteligência Artificial como exemplo para fins de estudo.</p>
          </div>
    </div>
    </div>
    </>
  );
}

export default NewsPage;
