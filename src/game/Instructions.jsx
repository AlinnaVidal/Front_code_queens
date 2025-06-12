import { useEffect } from "react";
import "../common/App.css";
import "./slider.css";
import { plusSlides, currentSlide, showSlides } from "./slider.js";

function Instructions() {
  useEffect(() => {
    showSlides(1); //fuente  https://www.w3schools.com/howto/howto_js_quotes_slideshow.asp
  }, []);

  return (
    <div>
      <div className="slideshow-container">

        <div className="mySlides">
          <h2>¿Qué es Blokas?</h2>
          <p>
            Blokas es un juego de estrategia para hasta 4 jugadores, donde cada uno debe colocar sus piezas en un tablero de 20x20 siguiendo reglas específicas.
            En nuestra versión mejorada, también puedes recolectar monedas y usar power-ups para ganar ventaja.
          </p>
        </div>

        <div className="mySlides">
          <h2>Objetivo del juego</h2>
          <p>
              Coloca tantas piezas de tu color como puedas en el tablero. Cada pieza nueva debe tocar otra pieza propia por una esquina,
              sin tocarse por los lados. Gana quien ocupe más espacio al final del juego.
              También puedes recolectar monedas y usar power-ups para sorprender a tus rivales.
          </p>
        </div>

        <div className="mySlides">
          <h2>Comenzar a jugar</h2>
          <ul>
            <li>Regístrate con tu nombre de usuario, avatar, email y contraseña.</li>
            <li>Inicia sesión y accede al menú principal.</li>
            <li>Crea una partida (elige de 2 a 4 jugadores) o únete a una existente.</li>
            <li>Espera a que todos los jugadores estén listos para comenzar.</li>
          </ul>
        </div>

        <div className="mySlides">
          <h2>Instrucciones del juego</h2>
          <ul>
            <li>El tablero muestra monedas y casillas especiales distribuidas al azar.</li>
            <li>Cada jugador comienza en una esquina con piezas propias.</li>
            <li>
                Durante tu turno (20 segundos) puedes:
              <ul>
                <li>Comprar un power-up si tienes monedas.</li>
                <li>Colocar una pieza desde tu conjunto.</li>
              </ul>
            </li>
            <li>Si no puedes jugar, puedes usar una bomba o esperar una ronda.</li>
          </ul>
        </div>

        <div className="mySlides">
          <h2>Power-ups</h2>
          <p>Puedes comprar estos power-ups con monedas recolectadas en el tablero:</p>
          <ul>
            <li>Doble turno: Coloca dos piezas seguidas.</li>
            <li>Bomba: Elimina piezas cercanas de otros jugadores.</li>
            <li>Pieza especial: Coloca una pieza ignorando las reglas normales.</li>
            <li>Quitar puntos: Resta puntos a un oponente.</li>
          </ul>
        </div>

        <div className="mySlides">
          <h2>Casillas especiales</h2>
          <ul>
            <li>Casillas con monedas: Aumentan tu saldo al pasar por ellas.</li>
            <li>Casillas bonus: Suman 2 o 4 puntos directamente a tu marcador.</li>
          </ul>
        </div>

        <div className="mySlides">
          <h2>Fin del juego</h2>
          <p>
              El juego termina cuando ningún jugador puede colocar más piezas.
              Se muestran los puntajes y el ganador.
          </p>

          <p>
              ¿Listo para comenzar? Regístrate, únete a una partida y empieza a bloquear a tus rivales.
          </p>
        </div>

        <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
        <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>
      </div>

      <div className="dot-container">
        <span className="dot" onClick={() => currentSlide(1)}></span>
        <span className="dot" onClick={() => currentSlide(2)}></span>
        <span className="dot" onClick={() => currentSlide(3)}></span>
        <span className="dot" onClick={() => currentSlide(4)}></span>
        <span className="dot" onClick={() => currentSlide(5)}></span>
        <span className="dot" onClick={() => currentSlide(6)}></span>
        <span className="dot" onClick={() => currentSlide(7)}></span>
      </div>
    </div>
  );
}

export default Instructions;
