import { useEffect } from "react";
import { showSlides, plusSlides, currentSlide } from "./slider.js";
import "./App.css";

export default function AboutUs() {
  useEffect(() => {
    showSlides(1);
  }, []);

  return (
    <div className="about-us">
      <h2>Sobre Nosotras</h2>

      <div className="slideshow-container">

        <div className="mySlides fade">
          <h3>¿Quiénes somos?</h3>
          <p>
            Somos un equipo de estudiantes de Ingeniería en Computación desarrollando el juego web <strong>Blokas</strong> como parte del curso de Tecnología y Aplicaciones Web.
          </p>
        </div>

        <div className="mySlides fade">
          <h3>Integrantes</h3>
          <div className="integrantes-container">
            <div className="integrante">
              <img src="src/common/fotos/fotovale.jpeg" alt="Valentina Juri" />
              <p>Valentina Juri</p>
            </div>
            <div className="integrante">
              <img src="src/common/fotos/fotoflo.jpg" alt="Florencia Schiappacasse" />
              <p>Florencia Schiappacasse</p>
            </div>
            <div className="integrante">
              <img src="src/common/fotos/fotoali.jpg" alt="Alinna Vidal" />
              <p>Alinna Vidal</p>
            </div>
          </div>
        </div>

        <div className="mySlides fade">
          <h3>Nuestro Objetivo</h3>
          <p>
            Crear una experiencia entretenida y accesible para jugar Blokas en línea, con soporte para distintos tipos de usuarios, reglas personalizadas y power-ups.
          </p>
          <p>¡Gracias por probar nuestro juego 🧩!</p>
        </div>

        <button className="prev" onClick={() => plusSlides(-1)}>&#10094;</button>
        <button className="next" onClick={() => plusSlides(1)}>&#10095;</button>
      </div>

      <div className="dot-container">
        <span className="dot" onClick={() => currentSlide(1)}></span>
        <span className="dot" onClick={() => currentSlide(2)}></span>
        <span className="dot" onClick={() => currentSlide(3)}></span>
      </div>
    </div>
  );
}
