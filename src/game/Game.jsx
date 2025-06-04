import React from 'react';
import { Link } from 'react-router-dom';

function Game() {
  //obtenemos el usuario desde localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="game-menu">
      <h2>Menú de Partidas</h2>
      <ul>
        {user ? (
          <>
            <li><Link to="/games/create">Crear Partida</Link></li>
            <li><Link to="/games/join">Unirse a Partida</Link></li>
            <li><Link to="/games/view">Ver Todas las Partidas</Link></li>
          </>
        ) : (
          <li><Link to="/games/view">Ver Todas las Partidas</Link></li>
        )}
      </ul>
    </div>
  );
}

export default Game;
