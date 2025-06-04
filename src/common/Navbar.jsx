import { Link } from 'react-router-dom'
import './App.css'

export default function Navbar({ user, logout }) {
  return (
    <header className="nav-bar">
      <h1>
        <Link to="/" className="logo-link">🧩 Blokas</Link>
      </h1>
      <nav>
        <Link to="/instructions" className="normal-link">Instrucciones</Link>
        <Link to="/about" className="normal-link">Nosotros</Link>
        <Link to="/game" className="normal-link">Partidas</Link>

        {user ? (
          <>
            <a onClick={logout} className="normal-link" style={{ cursor: 'pointer' }}>Cerrar Sesión</a>          
            </>
        ) : (
          <>
            <Link to="/login" className="normal-link">Inicio Sesión</Link>
            <Link to="/signup" className="normal-link">Registro</Link>
          </>
        )}
      </nav>
    </header>
  )
}


