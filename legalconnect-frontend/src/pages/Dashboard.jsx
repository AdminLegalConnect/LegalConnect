import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [options, setOptions] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/"); // Redirige vers la page de login
      return;
    }

    const fetchOptions = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get("http://localhost:5000/api/accueil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setOptions(res.data.options);
      } catch (err) {
        console.error(err);
        setError("Impossible de récupérer les options.");
      }
    };

    fetchOptions();
  }, [user, navigate]);

  return (
    <div>
      <h1>Bienvenue, {user?.email}</h1>
      <p>Rôle : {user?.role}</p>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {options ? (
        <ul>
          {Object.entries(options).map(([key, label]) => (
            <li key={key}>{label}</li>
          ))}
        </ul>
      ) : (
        <p>Chargement des options...</p>
      )}
    </div>
  );
};

export default Dashboard;
