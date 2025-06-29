import { useEffect, useState } from "react";
import { useContext } from "react";
import {  useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "./ViewBoard.css";
import { Link } from "react-router-dom";

import bomba1 from "../assets/tablero/bomba_1.png";
import dado from "../assets/tablero/dado.png";
import flechaAbajo from "../assets/tablero/flecha_abajo.png";
import bloqueEspecial from "../assets/tablero/bloque_especial.png";

// CASILLAS
import blueB from "../assets/tablero/bloque_azul.png";
import orangeB from "../assets/tablero/bloque_naranja.png";
import greenB from "../assets/tablero/bloque_verde.png";
import redB from "../assets/tablero/bloque_rojo.png";
import baseB from "../assets/tablero/bloque_tablero.png";
import coin from "../assets/tablero/moneda.png";
import plus2 from "../assets/tablero/por_2.png";
import plus4 from "../assets/tablero/por_4.png";

// Piezas
import Pieces from "./PieceImages";

function setCellColor(color) {
  if (color == "R") {
    return redB;
  }
  else if (color == "G") {
    return greenB;
  }
  else if (color == "B") {
    return blueB;
  }
  else if (color == "O") {
    return orangeB;
  }
  else if (color == "C") {
    return coin;
  }
  else if (color == "+2") {
    return plus2;
  }
  else if (color == "+4") {
    return plus4;
  }
  else {
    return baseB;
  }
}

function getWidth(name) {
  if (name == "1") {
    return 1;
  }
  else if (name == "2" || name == "3B" || name == "4D" || name == "5I")
  {
    return 2;
  }
  else if ( name == "3A" ||  name == "4B" ||  name == "4C" ||  name == "4E" ||  name == "5D" ||
            name == "5E" ||  name == "5F" ||  name == "5G" ||  name == "5J" ||  name == "5H" ||  name == "5K") {
    return 3;
  }
  else if (name == "4A" || name == "5B" || name == "5C" ) {
    return 4;
  }
  else if(name == "5A") {
    return 5;
  }
}
function setPiece(color, name) {

  if (color == "green") {
    return Pieces["Green"][name];
  }
  else if (color == "blue") {
    return Pieces["Blue"][name];
  }
  else if (color == "orange") {
    return Pieces["Orange"][name];
  }
  else if (color == "red") {
    return Pieces["Red"][name];
  }
}

const basePieces = {
  "1": [["X"]],
  "2": [["X", "X"]],
  "3A": [["X", "X", "X"]],
  "4A": [["X", "X", "X", "X"]],
  "5A": [["X", "X", "X", "X", "X"]],
  "3B": [["X", "X"], ["-", "X"]],
  "4B": [["X", "X", "X"], ["-", "-", "X"]],
  "5B": [["X", "X", "X", "X"], ["-", "-", "-", "X"]],
  "5F": [["-", "X", "-"], ["X", "X", "X"], ["-", "X", "-"]],
  "5I": [["-", "X", "-", "-"], ["X", "X", "X", "X"]],
  "4C": [["X", "X", "-"], ["-", "X", "X"]],
  "5C": [["X", "X", "-", "-"], ["-", "X", "X", "X"]],
  "4D": [["X", "X"], ["X", "X"]],
  "5D": [["X", "X", "X"], ["X", "X", "-"]],
  "4E": [["X", "X", "X"], ["-", "X", "-"]],
  "5E": [["X", "X", "X"], ["-", "X", "-"], ["-", "X", "-"]],
  "5G": [["X", "-", "-"], ["X", "-", "-"], ["X", "X", "X"]],
  "5J": [["X", "X", "-"], ["-", "X", "-"], ["-", "X", "X"]],
  "5H": [["X", "-", "-"], ["X", "X", "-"], ["-", "X", "X"]],
  "5K": [["X", "X", "-"], ["-", "X", "X"], ["-", "X", "-"]],
};

function Board({ gameId, token, callback, board, setBoard, refreshTrigger, highlightCells, setHighlightCells, piece, rotation, player}) {

  useEffect(() => {
    const fetchBoard = () => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/view/${gameId}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
      })
        .then(res => {
          if (!res.ok) throw new Error(`Error ${res.status}`);
          return res.json();
        })
        .then(data => {
          setBoard(data.board);
        })
        .catch(err => console.error("Error al obtener el tablero:", err));
    };

    fetchBoard(); // primera carga

    const interval = setInterval(fetchBoard, 3000); // cada 3 segundos

    return () => clearInterval(interval); // limpiar intervalo al desmontar
  }, [gameId, refreshTrigger]);

  if (!Array.isArray(board)) {
    console.error("Board no es un array:", board);
    return <div>Error: el tablero no tiene el formato esperado.</div>;
  }

  return (
    <div className="board">
      {board.map((board_row, row) => (
        <div key={row} className="row">
          {board_row.map((value, col) => {
            const isHighlighted = Array.isArray(highlightCells) &&
              highlightCells.some(([r, c]) => r === row && c === col);

            const cellValue = isHighlighted && piece && player.color
              ? player.color[0].toUpperCase()
              : value;

            return (
              <img
                onClick={() => callback([row, col])}
                onMouseEnter={() => {
                  if (piece) {
                    const affected = getAffectedCells([row, col], piece, rotation);
                    setHighlightCells(affected);
                  }
                }}
                onMouseLeave={() => setHighlightCells([])}
                key={`${row}-${col}`}
                src={setCellColor(cellValue)}
                alt="celda"
                className="cell"
              />
            );
          })}
        </div>
      ))}
    </div>
  );

}

function PiecesContainer({gameId, userId, token, callback, pieces, setPieces, rotation}) {
  const [color, setColor] = useState("");
  const [currentGroup, setCurrentGroup] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/players/from/${userId}/${gameId}`)
      .then(res => res.json())
      .then(data => {
        setColor(data.color);
        fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/pieces/${data.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => setPieces(data["pieces"]))
          .catch(err => console.error("Error al obtener piezas:", err));
      })
      .catch(err => console.error("Error al obtener jugadores:", err));
  }, []);

  const groupSize = 7;
  const groups = [];
  for (let i = 0; i < pieces.length; i += groupSize) {
    groups.push(pieces.slice(i, i + groupSize));
  }

  const handleNext = () => {
    setCurrentGroup((prev) => (prev + 1 < groups.length ? prev + 1 : prev));
  };

  const handlePrev = () => {
    setCurrentGroup((prev) => (prev > 0 ? prev - 1 : 0));
  };

  return (
    <div className="pieces-container">
      <div className="pieces-slider">
        <div
          className="pieces-wrapper"
          style={{ transform: `translateX(-${currentGroup * 100}%)` }}
        >
          {groups.map((group, index) => (
            <div className="pieces-group" key={index}>
              {group.map((piece, idx) => (
                <img
                  className={`img${getWidth(piece)} rotated-${rotation}`}
                  onClick={() => {callback(piece);}}
                  key={`${index}-${idx}`}
                  src={setPiece(color, piece)}
                  alt={`pieza-${piece}`}
                />
              ))}

            </div>
          ))}
        </div>
      </div>
      <div className="slider-buttons">
        <button onClick={handlePrev} disabled={currentGroup === 0}>◀</button>
        <button onClick={handleNext} disabled={currentGroup === groups.length - 1}>▶</button>
      </div>
    </div>

  );
}

function PlayersInfo({ players }) {
  return (
    <div className='players-info general'>
      {players.map(el => makePlayer(el))}
    </div>
  );
}

function currentPiece(piece, rotation, color, callback, turn, setRotation) {
  return(turn? piece?
    <div className="curr_container">
      <div>
        <img
          // ARREGLAAAR -> if pieza seleccionada ver bien llaves e id
          className={`img${getWidth(piece)} rotated-${rotation} curr_img`}
          onClick={() => {callback(piece);}}
          src={setPiece(color, piece)}
          alt={`pieza-${piece}`}
        />
      </div>
      <div className="curr_buttons">
        <button className={"rotate_button"} onClick={() => {turnLeft(rotation, setRotation);}}>◀</button>
        <button className={"rotate_button"} onClick={() => {turnRight(rotation, setRotation);}}>▶</button>
      </div>
    </div>:
    <div className="curr_container">No has seleccionado ninguna pieza</div>:
    <div className="curr_container">No puedes seleccionar piezas</div>);

}

function makePlayer(el)
{
  return(
    <div>
      <div key={el.id}>
        <div className={`container_${el.color}`}>
          <div key={`${el.id}-1`}>{`${el.username}`}</div>
          <div key={`${el.id}-2`}>{`Puntos: ${el.points}`}</div>
          <div key={`${el.id}-3`}>{`Monedas: ${el.coins}`}</div>
        </div>
      </div>
      <div>
        &nbsp;
      </div>
    </div>
  );
}

function turnRight(rotation, setRotation) {
  const nextRotation = {
    "U": "R",
    "R": "D",
    "D": "L",
    "L": "U"
  }[rotation];
  setRotation(nextRotation);
}

function turnLeft(rotation, setRotation) {
  const nextRotation = {
    "U": "L",
    "L": "D",
    "D": "R",
    "R": "U"
  }[rotation];
  setRotation(nextRotation);
}

function rotatePiece(structure, direction) {
  const rows = structure.length;
  const cols = structure[0].length;

  if (direction === "U") {
    return structure.map(row => [...row]);
  }

  if (direction === "D") {
    return structure.map(row => [...row].reverse()).reverse();
  }

  if (direction === "R") {
    const rotated = [];
    for (let col = 0; col < cols; col++) {
      const newRow = [];
      for (let row = rows - 1; row >= 0; row--) {
        newRow.push(structure[row][col]);
      }
      rotated.push(newRow);
    }
    return rotated;
  }

  if (direction === "L") {
    const rotated = [];
    for (let col = cols - 1; col >= 0; col--) {
      const newRow = [];
      for (let row = 0; row < rows; row++) {
        newRow.push(structure[row][col]);
      }
      rotated.push(newRow);
    }
    return rotated;
  }

  return structure;
}

const rotated5I = rotatePiece(basePieces["5I"], "R");
basePieces["5I"] = rotated5I;

function getAffectedCells(position, pieceName, rotation) {
  if (!pieceName || !position) return [];

  const [baseStructure] = [basePieces[pieceName]];
  if (!baseStructure) return [];

  const rotatedStructure = rotatePiece(baseStructure, rotation);
  const affectedCells = [];
  const [startRow, startCol] = position;

  rotatedStructure.forEach((row, i) => {
    row.forEach((cell, j) => {
      if (cell === "X") {
        affectedCells.push([startRow + i, startCol + j]);
      }
    });
  });

  return affectedCells;
}

function ViewBoard() {
  const { token } = useContext(AuthContext);
  const { gameId } = useParams();

  const [rotation, setRotation] = useState("U");
  const [ setScores] = useState({});
  const [setCurrentTurn] = useState(null);
  const [players, setPlayers] = useState([]);

  const user = JSON.parse(localStorage.getItem("user"));
  const userId = user ? parseInt(user.id) : null;

  const [game, setGame] = useState({});
  const [player, setPlayer] = useState({});
  const [piece, setPiece] = useState(null);
  const [board, setBoard] = useState([]);

  const [message, setMessage] = useState("");
  const [pieces, setPieces] = useState([]);

  const [highlightCells, setHighlightCells] = useState([]);

  function buy_powerup(powerup_id) {
    console.log(player.power_ups);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/buy-powerup/${player.id}/${powerup_id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      });
    console.log("power comprado");

  }

  async function surrender( player_id) {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/mechanics/surrender/${player_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
        }
      );

      console.log("Status del surrender:", response.status);
      const text = await response.text();
      console.log("Texto crudo de la respuesta:", text);

      if (response.status === 201 || response.status === 200) {
        //const createdGame = await response.json();     lol
        //const joined = JSON.parse(localStorage.getItem("joinedGames")) || [];
        //const updatedJoined = [...joined, createdGame.id];
        //localStorage.setItem("joinedGames", JSON.stringify(updatedJoined));

        setMessage("¡Te rendiste exitosamente!");
      }
      else {
        const data = await response.json();
        setMessage(`Error: ${data.error || "No se pudo crear la partida"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("Error al conectar con el servidor");
    }
  }

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/players/from/${userId}/${gameId}`)
      .then(res => res.json())
      .then(data => setPlayer(data))
      .catch(err => console.error("Error al obtener jugador:", err));
  }, []);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/games/${gameId}`)
      .then(res => res.json())
      .then(data => setGame(data))
      .catch(err => console.error("Error al obtener game:", err));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      //actualizar datos del jugador
      fetch(`${import.meta.env.VITE_BACKEND_URL}/players/from/${userId}/${gameId}`)
        .then(res => res.json())
        .then(data => setPlayer(data))
        .catch(err => console.error("Error al refrescar jugador:", err));

      //actualiza datos del juego
      fetch(`${import.meta.env.VITE_BACKEND_URL}/games/${gameId}`)
        .then(res => res.json())
        .then(data => {
          setGame(data);
          setCurrentTurn(data.current_turn);
          setScores(data.scores);
        })
        .catch(err => console.error("Error al refrescar juego:", err));

      //actualiza datos de los jugadores
      fetch(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}/${userId}`)
        .then(res => res.json())
        .then(data => setPlayers(data))
        .catch(err => console.error("Error al refrescar jugadores:", err));
      fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/board/${gameId}`)
        .then(res => res.json())
        .then(data => setBoard(data))
        .catch(err => console.error("Error al refrescar tablero:", err));

    }, 3000); //refresca cada 3s
    return () => clearInterval(interval);
  }, [userId, gameId]);

  return (
    <div className="container2">
      <div className="box2 izq" >
        <div className="my_data">
          <div className="black_text margin">
            {`${player.turn? "Es tu turno": "No es tu turno"}`}
          </div>
          <div  className={`container_${player.color}`}>
            <div className="black_text_no_bold">
              {`Monedas: ${player.coins}`}
            </div>
            <div className="black_text_no_bold">
              {`Puntos: ${player.points} `}
            </div>
            <div className="black_text_no_bold">
              {`Power-up: ${
                {
                  5: "Dado",
                  2: "Bomba",
                  4: "Quitar puntos",
                  3: "Bloque especial"
                }[player.power_up_id] || "No"
              }`}
            </div>

          </div>
        </div>
        <div className="power_container">
          <div className="black_text playing margin">
              Power ups
          </div>
          <div className="item_container">
            <div className="item">
              <img  className="img" src={dado} alt="Dado" onClick={() => buy_powerup(5)} />
              <div  className="black_text_no_bold">Powerup al azar, o ninguno. <br />Precio: $4</div>
            </div>
            <div className="item">
              <img  className="img" src={bomba1} alt="Bomba" onClick={() => buy_powerup(2)}  />
              <div  className="black_text_no_bold">Elimina una pieza del rival. <br />Precio: $6</div>
            </div>
            <div className="item">
              <img  className="img" src={flechaAbajo} alt="Flecha Abajo" onClick={() => buy_powerup(4)} />
              <div  className="black_text_no_bold">Quita puntos al rival elegido. <br />Precio: $8</div>
            </div>
            <div className="item">
              <img  className="img"src={bloqueEspecial} alt="Bloque Especial"  onClick={() => buy_powerup(3)}/>
              <div  className="black_text_no_bold">Pon un bloque, sin restricciones. <br />Precio: $6</div>
            </div>
          </div>
        </div>
        <div className="black_text finish_button">
          <div className="black_text margin playing" >
                Estado: {game.state}
          </div>

          {game.state === "playing" &&(
            <div className="button black_text_no_bold" onClick={() => surrender(player.id)}>
                Rendirse
            </div>
          )}

          {game.state === "finished" &&(
            <Link to={`/winners/${game.id}`} className="button">
                Ver ganadores
            </Link>
          )}
        </div>

        <div className="inv">
          {message && <p className="black_text">{message}</p>}
        </div>

      </div>
      <div className="not_izq">
        <div className="box2 center">
          <Board
            gameId={gameId}
            token={token}
            callback={addBoard}
            board={board}
            setBoard={setBoard}
            highlightCells={highlightCells}
            setHighlightCells={setHighlightCells}
            piece={piece}
            rotation={rotation}
            player={player}
          />
        </div>

        <div className="box2 der">
          <div className="black_text">
            Rivales:
          </div>
          <PlayersInfo players={players} />
          <div className="black_text">
            Pieza actual:
          </div>
          {currentPiece(piece, rotation, player.color, addPiece, player.turn, setRotation)}
        </div>
        <div className="box2 der2">
          <PiecesContainer gameId={gameId} userId={userId} token={token} callback={addPiece} pieces={pieces} setPieces={setPieces} rotation={"U"} />

        </div>
      </div>
    </div>);

  // Setea pieza que se quiere agregar
  function addPiece(pieceClicked) {
    if (piece && piece === pieceClicked) {
    // Rota la pieza seleccionada
      const nextRotation = {
        "U": "R",
        "R": "D",
        "D": "L",
        "L": "U"
      }[rotation];
      setRotation(nextRotation);
    } else {
    // Selecciona nueva pieza y resetea rotación
      setPiece(pieceClicked);
      setRotation("U");
    }

    console.log(`Pieza actual: ${pieceClicked}, rotación: ${rotation}`);
  }

  function addBoard(position) {
    let player_id = player.id;
    if (player.power_up_id === 4) {
      console.log("tienes el poweup");
      const [row, col] = position;
      const box = board[row][col];
      fetch(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}/${userId}`)
        .then(res => res.json())
        .then(players => {
          let color;
          if(box == "R") {
            color = "red";
          }
          if(box == "O") {
            color = "orange";
          }
          if(box == "G") {
            color = "green";
          }
          if(box == "B") {
            color = "blue";
          }
          const rival = players.find(p => p.color === color);

          if (!rival) {
            console.warn("No se encontró rival con color:", color);
            return;
          }

          const rivalid = rival.id;
          console.log("al rival:", rivalid);
          console.log("box:", box);

          return fetch(`${import.meta.env.VITE_BACKEND_URL}/use-powerup-quitar-puntos/${player.id}/${rivalid}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
        })
        .catch(err => console.error("Error al obtener jugadores:", err));
    }
    else if (player.power_up_id === 2) {
      console.log("tienes el powerup bomba");
      const [row, col] = position;

      console.log("voy a mandar x", col);
      console.log("voy a mandar y", row);
      return fetch(`${import.meta.env.VITE_BACKEND_URL}/use-powerup-bomba/${player.id}/${col}/${row}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },

      });

    }
    else if (player.power_up_id === 3) {
      console.log("tienes el powerup pieza especial");
      const [row, col] = position;

      console.log("voy a mandar x", col);
      console.log("voy a mandar y", row);
      return fetch(`${import.meta.env.VITE_BACKEND_URL}/use-powerup-pieza-especial/${player.id}/${col}/${row}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },

      });

    }

    if (piece != null) {
      const affected = getAffectedCells(position, piece, rotation);
      setHighlightCells(affected);
      console.log("TRYING TO FETCH");
      console.log(`ROTATION ${rotation}`);
      fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          player: `${player_id}`,
          piece_type: `${piece}`,
          rotation: `${rotation}`,
          position: `[${position}]`
        })
      })
        .then(res => res.json())
        .then(data => {
          const { changes, color } = data;

          let new_board = board.map(row => [...row]);
          for (let i = 0; i < changes.length; i++) {
            let [r, c] = changes[i];
            new_board[r][c] = color;
          }

          //setBoard(new_board);

          setPiece(null);  // resetea la pieza
          //SEGUNDO FETCH PLAYER
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/players/from/${userId}/${gameId}`, {
            headers: {
              "Authorization": `Bearer ${token}`,
            },
          });
        })
        .then(res => res.json())
        .then(updatedPlayer => {
          //setPlayer(updatedPlayer); // actualizar estado

          // TERCER FETCH PIECES
          return fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/pieces/${updatedPlayer.id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}`,
            },
          });
        })
        .then(res => res.json())
        .then(data => {
          setPieces(data.pieces);
        })
        .catch(err => console.error("Error en la secuencia de movimientos:", err));
    }
  }
}

export default ViewBoard;