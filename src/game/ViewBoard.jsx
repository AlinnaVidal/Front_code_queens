import { useEffect, useState } from "react";
import { useContext } from "react";
import { data, useParams } from "react-router-dom";
import { AuthContext } from "../auth/AuthContext";
import "./ViewBoard.css";

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


  function Board(gameId, token, callback, board, setBoard) {

    useEffect(() => {
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
        .then(data => setBoard(data.board))
        .catch(err => console.error("Error al obtener el tablero:", err));
    }, [gameId]);

    return (
      <div className="board">
        {board.map((board_row, row) => (
          <div key={row} className="row">
            {board_row.map((value, col) => (
              <img
                onClick={() => {
                  callback([row, col])}}
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

  function PiecesContainer(gameId, userId, token, callback){
    const [color, setColor] = useState('');
    const [pieces, setPieces] = useState([]);
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
                    className={`img${getWidth(piece)}`}
                    onClick={() => {callback(piece)}}
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

  function playersInfo(gameId, userId, token){
    const [players, setPlayers] = useState([])

    useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}/${userId}`)
            .then(res => res.json())
            .then(data => setPlayers(data))
            .catch(err => console.error('Error al obtener jugadores:', err));
    }, []);

    return (
        <div className='players-info'>
            {players.map(el => makePlayer(el))}
        </div>
    )
  }

  function makePlayer(el)
  {
    return(
      <div className="black_text" key={el.id}>
          <div key={`${el.id}-1`}>{`Nombre de usuario: ${el.username}`}</div>
          <div key={`${el.id}-2`}>{`Puntos: ${el.points}`}</div>
          <div key={`${el.id}-3`}>{`Monedas: ${el.coins}`}</div>
      </div>
    )
  }


function ViewBoard() {
  const { token } = useContext(AuthContext);
  const { gameId } = useParams();

  const user = JSON.parse(localStorage.getItem('user'));
  const userId = user ? parseInt(user.id) : null;

  const [player, setPlayer] = useState({})
  const [piece, setPiece] = useState({})
  const [board, setBoard] = useState([]);

  const [changes, setChanges] = useState([])
  const [colorMark, setColorMark] = useState('')


  useEffect(() => {
      fetch(`${import.meta.env.VITE_BACKEND_URL}/players/from/${userId}/${gameId}`)
          .then(res => res.json())
          .then(data => setPlayer(data))
          .catch(err => console.error('Error al obtener jugador:', err));
  }, [])

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
            </>
      </div>
      <div className="box2 center">        
            {Board(gameId, token, addBoard, board, setBoard)}
      </div>
          <div className="box2 der">
              {playersInfo(gameId, userId, token)}
              {PiecesContainer(gameId, userId, token, addPiece)}
          </div>
      </div>)

  

  // Setea pieza que se quiere agregar
  function addPiece(piece){
    setPiece(piece)
    console.log(`la pieza actual es: ${piece}`)
  }

  function addBoard(position){
    let player_id = player.id
    if (piece != null){
      console.log("TRYING TO FETCH")
      fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/move`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          player: `${player_id}`,
          piece_type: `${piece}`,
          rotation: "U",
          position: `[${position}]`
        })
      })
        .then(res => res.json())
        .then(data => {
          setChanges(data.changes)
          setColorMark(data.color)
        })
        .catch(err => console.error("Error al intentar movimiento:", err));
    
      let new_board = board
      for (let i = 0; i < changes.length; i++){
        let c_row = changes[i][0]
        let c_col = changes[i][1]
        new_board[c_row, c_col] = colorMark
        
      }

      // Al finalizar debemos resetear la pieza
      setBoard(new_board)
      setPiece(null)
    }
  }



  

  

}



export default ViewBoard;