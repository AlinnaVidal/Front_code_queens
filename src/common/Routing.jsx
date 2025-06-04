// src/common/Routing.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Instructions from '../game/Instructions'
import UserWelcome from '../profile/UserWelcome'
import App from './App'
import Login from '../profile/Login'
import Signup from '../profile/Signup'
import AboutUs from './Nosotros'
import LandingPage from './Root'
import Game from '../game/Game'
import CreateGame from '../game/CreateGame'
import JoinGame from '../game/JoinGame'
import ViewGames from '../game/ViewGames'




function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<LandingPage />} />
          <Route path="instructions" element={<Instructions />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="about" element={<AboutUs />} />
          <Route path="/game" element={<Game />} />
          <Route path="/games/create" element={<CreateGame />} />
          <Route path="/games/join" element={<JoinGame />} />
          <Route path="/games/view" element={<ViewGames />} />
  
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
