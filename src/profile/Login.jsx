import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../common/App.css";
import { AuthContext } from "../auth/AuthContext";

export default function Login() {
  const { setUser } = useContext(AuthContext);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const{  setToken } = useContext(AuthContext);

  async function handleLogin(e) {
    e.preventDefault();
    console.log("handleLogin ejecutado");

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/authentications/login`,
        { email, password },
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      );

      const access_token = response.data.access_token;
      const user = response.data.user;
      setToken(access_token);
      setUser(user);
      navigate("/");
      console.log("TOKEN:",access_token )

    } catch (error) {
      console.error("Login error:", error);
      alert("Credenciales inválidas o error de conexión");
    }
  }

  return (
    <div className="login-page">
      <h2>Inicio de sesión</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit">Iniciar sesión</button>
      </form>
    </div>
  );
}
