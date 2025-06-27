// src/common/Routing.jsx

import { useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { Navigate } from "react-router-dom";


import { BrowserRouter, Routes, Route } from "react-router-dom";
import Instructions from "../game/Instructions";
import App from "./App";
import Login from "../profile/Login";
import Signup from "../profile/Signup";
import AboutUs from "./Nosotros";
import LandingPage from "./Root";
import Game from "../game/Game";
import CreateGame from "../game/CreateGame";
import JoinGame from "../game/JoinGame";
import ViewGames from "../game/ViewGames";
import UserCheck from "../protected/UserCheck";
import AdminPage from "../admin/AdminPage";
import AdminUsers from "../admin/AdminUsers";
import AdminGames from "../admin/AdminGames";
import AdminPlayers from "../admin/AdminPlayers";
import Winners from "../game/Winners";

import ViewBoard from "../game/ViewBoard";



function isTokenValid(token) {
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp > now;
  } catch {
    return false;
  }
}

function Routing() {
  const { user } = useContext(AuthContext);
  const { token } = useContext(AuthContext);
  const isAuthenticated = isTokenValid(token);
  console.log(token)
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<LandingPage />} />
          <Route path="instructions" element={<Instructions />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="game" element={<Game />} />
          <Route path="games/create" element={<CreateGame />} />
          <Route path="games/join" element={<JoinGame />} />
          <Route path="games/view" element={<ViewGames />} />
          <Route path="users" element={<UserCheck />} />
          {user?.user_type === "admin" ? (
            <>
              <Route path="admin" element={<AdminPage />} />
              <Route path="admingames" element={<AdminGames />} />
              <Route path="adminplayers" element={<AdminPlayers />} />
              <Route path="Adminusers" element={<AdminUsers />} />
            </>
          ) : (
            <Route path="admin" element={<Navigate to="/" />} />
          )}
          <Route path="view/:gameId" element={<ViewBoard />} />
          <Route path="winners/:gameId" element={<Winners />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default Routing;
