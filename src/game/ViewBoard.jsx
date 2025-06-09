import { useEffect, useState, lazy } from 'react';
import {useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';
import './ViewBoard.css';

import bomba1 from '../assets/tablero/bomba_1.png';
import dado from '../assets/tablero/dado.png';
import flechaAbajo from '../assets/tablero/flecha_abajo.png';
import bloqueEspecial from '../assets/tablero/bloque_especial.png';


// CASILLAS
import blueB from '../assets/tablero/bloque_azul.png'
import orangeB from '../assets/tablero/bloque_naranja.png'
import greenB from '../assets/tablero/bloque_verde.png'
import redB from '../assets/tablero/bloque_rojo.png'
import baseB from '../assets/tablero/bloque_tablero.png'
import coin from '../assets/tablero/moneda.png'
import plus2 from '../assets/tablero/por_2.png'
import plus4 from '../assets/tablero/por_4.png'

// Piezas
import Pieces from './PieceImages'

function setCellColor(color){
    if (color == 'R'){
        return redB
    }
    else if (color == 'G'){
        return greenB
    }
    else if (color == 'B'){
        return blueB
    }
    else if (color == 'O'){
        return orangeB
    }
    else if (color == 'C'){
        return coin
    }
    else if (color == '+2'){
        return plus2
    }
    else if (color == '+4'){
        return plus4
    }
    else {
        return baseB
    }
}

function getWidth(name){
    if (name == "1"){
        return 1
    }
    else if (name == "2" || name == "3B" || name == "4D" || name == "5I")
    {
        return 2
    }
    else if ( name == "3A" ||  name == "4B" ||  name == "4C" ||  name == "4E" ||  name == "5D" ||
            name == "5E" ||  name == "5F" ||  name == "5G" ||  name == "5J" ||  name == "5H" ||  name == "5K"){
        return 3
    }
    else if (name == "4A" || name == "5B" || name == "5C" ){
        return 4
    }
    else if(name == "5A"){
        return 5
    }
}
function setPiece(color, name){

    if (color == "green"){
        return Pieces['Green'][name]
    }
    else if (color == "blue"){
        return Pieces['Blue'][name]
    }
    else if (color == "orange"){
        return Pieces['Orange'][name]
    }
    else if (color == "red"){
        return Pieces['Red'][name]
    }
}

function createGroups (pieces){
    let groups = Math.trunc(pieces.length / 3)
    let result = []
    for (let i = 0; i < groups; i++){
        result.push([])
    }
    console.log(`groups ${groups}`)

    for (let i = 0; i < pieces.length; i++){
        let mod = i % groups
        console.log(mod)
        result[mod].push(pieces[i])
        console.log(result[mod])
    }
    console.log(result)
    return result
}

function Board(gameId, token){
    const [board, setBoard] = useState([]);
    
    useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/view/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(res => {
        if (!res.ok) throw new Error(`Error ${res.status}`);
        return res.json();
      })
      .then(data => setBoard(data.board))
      .catch(err => console.error('Error al obtener el tablero:', err));
  }, [gameId]);

    return (
        <div className="board">
        {board.map((board_row, row) => (
            <div key={row} className="row">
            {board_row.map((value, col) => (
                <img
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


function PiecesContainer(gameId, token){
    const [id, setId] = useState(0);
    const [color, setColor] = useState('');
    const [pieces, setPieces] = useState([]);

    const user = JSON.parse(localStorage.getItem('user'));
    const userId = user ? parseInt(user.id) : null;

    // Seteo el color y las piezas disponibles del jugador
     useEffect(() => {
        fetch(`${import.meta.env.VITE_BACKEND_URL}/players/from/${userId}/${gameId}`)
        .then(res => res.json())
        .then(data => 
                {   
                    setId(data.id);
                    setColor(data.color);
                    fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/pieces/${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                    })
                    .then(res => res.json())
                    .then(data => setPieces(data['pieces']))
                    .catch(err => console.error('Error al obtener piezas:', err));
                })
        .catch(err => console.error('Error al obtener jugadores:', err));
        }, []);


    let groups = createGroups(pieces)
    console.log(groups)

    return(
        <div className='pieces-container'>
            {groups.map((el, num) => PiecesGroup(el, num, color))}
        </div>
    )
}

function PiecesGroup(el, num, color){

    if (num > 1){
        return
    }
    return (
        <div className='pieces-group' key={num}>
            {el.map((piece, id) => <img className={`img${getWidth(piece)}`} key={`${num}-${id}`} src={setPiece(color, piece)}/>)}
        </div>
    )
}

function ViewBoard(){
    const { token } = useContext(AuthContext);
    const { gameId } = useParams();

    return (


        <div className="container2">
            <div className="box2 izq" >
                <div className="black_text">
                    Tus Datos 
                </div>
                <div className="black_text">
                    Turno:
                </div>
                <div className="black_text">
                    Monedas: 
                </div>
                <div className="black_text">
                    Puntos: 
                </div>
                <div className="black_text">
                    Power up: 
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
                 {Board(gameId, token)}
            </div>
                <div className="box2 der">
                    {PiecesContainer(gameId, token)}
                </div>
            </div>
    )
}


export default ViewBoard;