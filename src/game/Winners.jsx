import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../auth/AuthContext";
import { data, useParams } from "react-router-dom";
import img_win from "../assets/win.png";
import "./Winners.css";

export default function Winners() {
const [players, setPlayers] = useState([]);
  const [game, setGame] = useState({})
const { token } = useContext(AuthContext);
const { gameId } = useParams();

useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user"));
        const userId = user ? parseInt(user.id) : null;

        const res1 = await fetch(`${import.meta.env.VITE_BACKEND_URL}/players/game/${gameId}/${userId}`);
        const data1 = await res1.json();

        const res2 = await fetch(`${import.meta.env.VITE_BACKEND_URL}/players/from/${userId}/${gameId}`);
        const data2 = await res2.json();

        let combined = [];

        
        if (Array.isArray(data1)) combined = [...data1];

        if (Array.isArray(data2)) combined = combined.concat(data2);
        else if (data2) combined.push(data2);

        const sorted = combined.sort((a, b) => b.points - a.points);


        const enrichedPlayers = await Promise.all(
        sorted.map(async (player) => {
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/users/${player.user_id}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const user = await res.json();
          return { ...player, userName: user.name_user };
        })
      );

      setPlayers(enrichedPlayers);
    } catch (err) {
      console.error("Error al obtener jugadores:", err);
    }
  };

    fetchPlayers();
  }, [gameId]);



  return (
    <div className="about-us">
    <img src={img_win} alt="trofeo" className="trofeo" />
    <div className="black_text">  &nbsp; </div>
    <div className="black_text">  &nbsp; </div>
     <div className="black_text">
        {players.map(player => (
          <div className="black_text" key={player.id}>
            {player.userName} - {player.color} - {player.points} puntos
          </div>
        ))}
      </div>
    </div>
  );
}
