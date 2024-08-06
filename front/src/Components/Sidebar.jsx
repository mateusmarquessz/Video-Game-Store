import React from 'react';
import './css/Sidebar.css';

function Sidebar() {
  return (
    <aside className="sidebar">
  <div className="filter">
    <h3>Categorias</h3>
    <label><input type="checkbox"/> Indy</label>
    <label><input type="checkbox"/> Aventura</label>
    <label><input type="checkbox"/> MMO</label>
    <label><input type="checkbox"/> Jogo casual</label>
    <label><input type="checkbox"/> Estratégia</label>
    <label><input type="checkbox"/> Simulador</label>
    <label><input type="checkbox"/> Esportes</label>
    <label><input type="checkbox"/> Ação</label>
  </div>
  <div className="filter">
    <h3>Plataformas</h3>
    <label><input type="checkbox"/> PC</label>
    <label><input type="checkbox"/> PlayStation 5</label>
    <label><input type="checkbox"/> PlayStation 4</label>
    <label><input type="checkbox"/> Xbox Series</label>
    <label><input type="checkbox"/> Nintendo Switch</label>
  </div>
  <div className="filter">
    <h3>Preço</h3>
    <div className="price-range">
      <label>
        <input type="number" name="min-price" placeholder="R$ 0,00"/>
      </label>
      <i>-</i>
      <label>
        <input type="number" name="max-price" placeholder="R$ 100,00"/>
      </label>
    </div>
  </div>
  <button className="apply-filters">Aplicar Filtros</button>
</aside>


  );
}

export default Sidebar;
