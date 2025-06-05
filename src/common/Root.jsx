import { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import './App.css'
import './Root.css'
import img_logo from '../assets/logo.png';

 function LandingPage() {

  const [games, setGames] = useState([]);


   useEffect(() => {
  fetch(`${import.meta.env.VITE_BACKEND_URL}/games`)
    .then((res) => res.json())
    .then((data) => setGames(data))
    .catch((err) => console.error(err));
}, []);



  return (
    
<div class="container">
  <div class="floating-icon uno">✨</div>
  <div class="floating-icon dos">🎮</div>
  <div class="floating-icon tres">✨</div>
  <div class="floating-icon cuatro">👾</div>
  <div class="floating-icon cinco">✨</div>
  <div class="floating-icon seis">✨</div>
  <div class="floating-icon siete">✨</div>
  <div class="floating-icon ocho">🎲</div>
  <div class="floating-icon nueve">🕹️</div>
  <div class="floating-icon diez">🧩</div>
  


  <div >
    <img src={img_logo} alt="Logo de Blokas" className="logo" />
    <p className= "black_text">
        ¡Bienvenido a Blokas!                                                                                                                                                                                                                                                                                      
    </p>
    <p className= "black_text">
        Registrate o inicia sesión para jugar                                                                                                                                                                                                                                                                                      
    </p>
  </div>







      
    </div>
  )
}

export default LandingPage



