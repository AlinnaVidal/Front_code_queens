import { useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";

export default function UserCheck() {
  const { token } = useContext(AuthContext);
  const config = {
    method: "get",
    url: `${import.meta.env.VITE_BACKEND_URL}/users`,
    headers: {
      Authorization: `Bearer ${token}`
    }

  };
  useEffect(() => {
    axios(config)
      .then((response) => {
        console.log("Enviaste un token bueno y estás logueado!!!");
        console.log(response);
      })
      .catch((error) => {
        console.log("Hubo un error, no estás logueado / el token expiró");
        console.log(error);
      });
  }, []);

}

