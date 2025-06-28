import { useState, useEffect, useContext } from "react";
import "./App.css";
import "./Root.css";
import { AuthContext } from "../auth/AuthContext";
import img_logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function LandingPage() {

  const [ setGames] = useState([]);
  const { user } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  console.log(token);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/games`)
      .then((res) => res.json())
      .then((data) => setGames(data))
      .catch((err) => console.error(err));
  }, []);

  return (

    <div className="container">

      <div >
        <img src={img_logo} alt="Logo de Blokas" className="logo" />
        <p className= "black_text">
        ¡Bienvenido a Blokas!
        </p>
        <p className= "black_text">
        Registrate o inicia sesión para jugar
        </p>
        <div className="floating-icon dos">🎮👾</div>
      </div>

      {user?.user_type === "admin" && (
        <Link className="button" to="/admin">
        Abrir panel de control de administrador
        </Link>
      )}

    </div>
  );
}

export default LandingPage;

