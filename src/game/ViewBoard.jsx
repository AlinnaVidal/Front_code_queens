import { useEffect, useState, lazy } from 'react';
import {useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../auth/AuthContext';


import blueB from '../assets/tablero/bloque_azul.png'
import orangeB from '../assets/tablero/bloque_naranja.png'
import greenB from '../assets/tablero/bloque_verde.png'
import redB from '../assets/tablero/bloque_rojo.png'
import baseB from '../assets/tablero/bloque_tablero.png'
import coin from '../assets/tablero/moneda.png'
import plus2 from '../assets/tablero/por_2.png'
import plus4 from '../assets/tablero/por_4.png'


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



function Board({gameId}){
    const [board, setBoard] = useState([]);
    const { token } = useContext(AuthContext);
    
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

/* 

function PiecesContainer(gameId){
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
                        fetch(`${import.meta.env.VITE_BACKEND_URL}/mechanics/pieces/${id}`)
                            .then(res => res.json())
                            .then(data => setPieces(data['pieces']))
                            .catch(err => console.error('Error al obtener piezas:', err));
                    })
            .catch(err => console.error('Error al obtener jugadores:', err));
    }, []);

    return(
        <div>
            {pieces.map((el) => Piece(el, color))}
        </div>
    )
}


function Piece(name, color){
    const [image, setImage] = useState()

    useEffect( () => {
        import(`../assets/piezas/${color}/${name}.png`).then(setImage)
    })

    return <img src={image} />
}


*/
function ViewBoard(){
    const { gameId } = useParams();

    return (
        <div>
        <Board gameId={gameId} />
        </div>
    )
}


export default ViewBoard;