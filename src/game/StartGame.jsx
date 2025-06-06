import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import pieceImage from '../assets/tablero/pixil-layer-8.png';

function StartGame() {
  const { gameId } = useParams();
  const navigate = useNavigate();
  const boardSize = 20;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp * 1000;
      if (Date.now() >= exp) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } catch (err) {
      console.error('Token inválido:', err);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    console.log("ID de la partida:", gameId);
  }, [gameId]);

  return (
    <div className="view-games-container">
      <h2 className="view-games-title">Estás en la partida {gameId}</h2>
      <div className="board games-list">
        {[...Array(boardSize)].map((_, row) => (
          <div key={row} className="row">
            {[...Array(boardSize)].map((_, col) => (
              <img
                key={`${row}-${col}`}
                src={pieceImage}
                alt="pieza"
                className="cell game-item"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );

}

export default StartGame;
