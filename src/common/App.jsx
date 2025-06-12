import { useContext } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { AuthContext } from "../auth/AuthContext";

function App() {
  const { setToken, user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
    navigate("/");
  }

  return (
    <div className="body">
      <Navbar user={user} logout={logout} />
      <main>
        <Outlet context={{ user, setUser }} />
      </main>
    </div>
  );
}

export default App;
