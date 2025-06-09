import React, { useEffect, useState } from 'react';

function ViewGames() {
  const [games, setGames] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/games`)
      .then(res => res.json())
      .then(data => setGames(data))
      .catch(err => console.error('Error al obtener partidas:', err));
  }, []);



  return (
    <div className="view-games-container">
      <h2 className="view-games-title">Todas las Partidas</h2>
      <ul className="games-list">
        {games.length === 0 ? (
          <li className="no-games">No hay partidas</li>
        ) : (
          games.map((game) => (
            <li key={game.id} className="game-item">
              <span className="game-name">{game.name}</span> - <span className="game-state">Estado: {game.state}</span>
            </li>
          ))
        )}
      </ul>
    </div>
  );

}

export default ViewGames;
