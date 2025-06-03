// src/common/Routing.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Instructions from '../game/Instructions'
import UserWelcome from '../profile/UserWelcome'
import App from './App'
import Login from '../profile/Login'
import Signup from '../profile/Signup'
import AboutUs from './Nosotros'


function Routing() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route path="instructions" element={<Instructions />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
          <Route path="about" element={<AboutUs />} />

          
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default Routing
