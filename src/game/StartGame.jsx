import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import pieceImage from '../assets/tablero/pixil-layer-8.png'; 



function StartGame() {
  const { gameId } = useParams();

  useEffect(() => {
    console.log("ID de la partida:", gameId);
  }, [gameId]);

  const boardSize = 20;

  return (
    <div>
      <h2>Estás en la partida {gameId}</h2>
      <div className="board">
        {[...Array(boardSize)].map((_, row) => (
          <div key={row} className="row">
            {[...Array(boardSize)].map((_, col) => (
              <img
                key={`${row}-${col}`}
                src={pieceImage}
                alt="pieza"
                className="cell"
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StartGame;
