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

function Board(gameId, token, callback, board, setBoard, refreshTrigger) {

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

    const interval = setInterval(fetchBoard, 2000); // cada 2 segundos

    return () => clearInterval(interval); // limpiar intervalo al desmontar
  }, [gameId, refreshTrigger]);
  

  if (!Array.isArray(board)) {
    console.error("Board no es un array:", board);
    return <div>Error: el tablero no tiene el formato esperado.</div>;
  }

  for (let i = 0; i < board.length; i++) {
    console.error(`Fila ${i}`, JSON.stringify(board[i], null, 2));
    if (!Array.isArray(board[i])) {
      console.error(`Fila ${i} del board no es un array:`, JSON.stringify(board[i], null, 2));

      return <div>Error: fila inválida en el tablero.</div>;
    }
  }

  return (
    <div className="board">
      {board.map((board_row, row) => (
        <div key={row} className="row">
          {board_row.map((value, col) => (
            <img
              onClick={() => {
                callback([row, col]);}}
              key={`${row}-${col}`}
              src={setCellColor(value)}
              alt='celda'
              className="cell"
            />
          ))}
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
    <div className='players-info'>
      {players.map(el => makePlayer(el))}
    </div>
  );
}



function makePlayer(el)
{
  return(
    <div className="black_text" key={el.id}>
      <div key={`${el.id}-1`}>{`Nombre de usuario: ${el.username}`}</div>
      <div key={`${el.id}-2`}>{`Puntos: ${el.points}`}</div>
      <div key={`${el.id}-3`}>{`Monedas: ${el.coins}`}</div>
    </div>
  );
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
  const [piece, setPiece] = useState({});
  const [board, setBoard] = useState([]);

  const [message, setMessage] = useState("");
  const [pieces, setPieces] = useState([]);

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
            .catch(err => console.error('Error al refrescar jugadores:', err));
      fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/board/${gameId}`)
        .then(res => res.json())
        .then(data => setBoard(data))
        .catch(err => console.error("Error al refrescar tablero:", err));

    }, 2000); //refresca cada 2s
    return () => clearInterval(interval); 
  }, [userId, gameId]);


  return (
    <div className="container2">
      <div className="box2 izq" >
        <div className="black_text">
              Tus Datos:
        </div>
        <div className="black_text">
          {`${player.turn? "Es tu turno": "No es tu turno"}`}
        </div>
        <div className="black_text">
          {`Monedas: ${player.coins}`}
        </div>
        <div className="black_text">
          {`Puntos: ${player.points}`}
        </div>
        <div className="black_text">
          {`Power ups: ${player.power_ups != undefined ? player.power_ups: "Ninguno"}`}
        </div>
        <div className="black_text">
              &nbsp;
        </div>
        <>
          <img  className="img" src={dado} alt="Dado" />
          <img  className="img" src={bomba1} alt="Bomba" />
          <img  className="img" src={flechaAbajo} alt="Flecha Abajo" />
          <img  className="img"src={bloqueEspecial} alt="Bloque Especial" />
          <div className="black_text">
                 &nbsp;

            <div className="black_text" >
                El estado del juego es: {game.state}
            </div>
          </div>

          {game.state === "playing" &&(
            <div className="button" onClick={() => surrender(player.id)}>
                Rendirse
            </div>
          )}

          {game.state === "finished" &&(
            <Link to={`/winners/${game.id}`} className="button">
                Ver ganadores
            </Link>
          )}

          <div>
            {message && <p className="black_text">{message}</p>}
          </div>
        </>
      </div>
      <div className="box2 center">
        {Board(gameId, token, addBoard, board, setBoard)}
      </div>
      <div className="box2 der">
        <PlayersInfo players={players} />
        <PiecesContainer gameId={gameId} userId={userId} token={token} callback={addPiece} pieces={pieces} setPieces={setPieces} rotation={rotation} />
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
    if (piece != null) {
      console.log("TRYING TO FETCH");
      fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          player: `${player_id}`,
          piece_type: `${piece}`,
          rotation: rotation,
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

          setBoard(new_board);

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
          setPlayer(updatedPlayer); // actualizar estado

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