import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import { FiEdit, FiSearch, FiFolder, FiLayers } from "react-icons/fi";

const iconMap = {
  deposerUnDossier: <FiEdit size={24} />,
  deposerUnePlainte: <FiFolder size={24} />,
  explorerLesThematiques: <FiLayers size={24} />,
  chercherUnDossier: <FiSearch size={24} />,
  chercherUnePlainte: <FiSearch size={24} />,
};

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [options, setOptions] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      navigate("/");
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

  const handleClick = (key) => {
    if (key === "deposerUnDossier") navigate("/deposer-dossier");
    if (key === "deposerUnePlainte") navigate("/deposer-plainte");
    if (key === "explorerLesThematiques") navigate("/thematiques");
    if (key === "chercherUnDossier") navigate("/recherche-avis");
    if (key === "chercherUnePlainte") navigate("/recherche-plainte");
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Bienvenue, {user?.email}</h1>
      <p style={styles.subheading}>Rôle : {user?.role}</p>

      {error && <p style={styles.error}>{error}</p>}

      {options ? (
        <div style={styles.optionsGrid}>
          {Object.entries(options).map(([key, label]) => (
            <button key={key} style={styles.optionButton} onClick={() => handleClick(key)}>
              <div style={styles.icon}>{iconMap[key]}</div>
              <span>{label}</span>
            </button>
          ))}
        </div>
      ) : (
        <p>Chargement des options...</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  heading: {
    fontSize: "2rem",
    fontWeight: "bold",
  },
  subheading: {
    color: "gray",
  },
  error: {
    color: "red",
    marginTop: "1rem",
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "1.5rem",
    marginTop: "2rem",
  },
  optionButton: {
    padding: "1.2rem",
    fontSize: "1rem",
    borderRadius: "12px",
    border: "none",
    backgroundColor: "#2563EB", // bleu profond
    color: "white",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "0.8rem",
    transition: "background 0.3s",
  },
  icon: {
    display: "flex",
    alignItems: "center",
  },
};

export default Dashboard;
