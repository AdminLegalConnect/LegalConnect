// pages/Dashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import Header from "../components/Layout/Header";
import { FiEdit, FiSearch, FiFolder, FiLayers } from "react-icons/fi";

const iconMap = {
  deposerUnDossier: <FiEdit size={28} />,
  deposerUnePlainte: <FiFolder size={28} />,
  explorerLesThematiques: <FiLayers size={28} />,
  chercherUnDossier: <FiSearch size={28} />,
  chercherUnePlainte: <FiSearch size={28} />,
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
    <>
      <Header />
      <div style={styles.container}>
        <div style={styles.welcomeBox}>
          <h1 style={styles.heading}>Bienvenue, {user?.prenom || user?.email}</h1>
          <p style={styles.subheading}>Rôle : {user?.role}</p>
        </div>

        {error && <p style={styles.error}>{error}</p>}

        {options ? (
          <div style={styles.optionsGrid}>
            {Object.entries(options).map(([key, label]) => (
              <button
                key={key}
                style={styles.optionButton}
                onClick={() => handleClick(key)}
              >
                <div style={styles.icon}>{iconMap[key]}</div>
                <span style={styles.optionLabel}>{label}</span>
              </button>
            ))}
          </div>
        ) : (
          <p style={styles.loading}>Chargement des options...</p>
        )}
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: "1000px",
    margin: "0 auto",
    padding: "3rem 2rem",
    fontFamily: "sans-serif",
  },
  welcomeBox: {
    textAlign: "center",
    marginBottom: "2rem",
  },
  heading: {
    fontSize: "2.5rem",
    fontWeight: "bold",
    color: "#1e3a8a",
  },
  subheading: {
    color: "#6b7280",
    fontSize: "1rem",
    marginTop: "0.5rem",
  },
  error: {
    color: "red",
    textAlign: "center",
    marginTop: "1rem",
  },
  loading: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#555",
  },
  optionsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "2rem",
    marginTop: "2rem",
  },
  optionButton: {
    padding: "1.8rem",
    fontSize: "1rem",
    borderRadius: "16px",
    border: "none",
    backgroundColor: "#1d4ed8",
    color: "white",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    gap: "1rem",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    transition: "transform 0.2s ease",
  },
  optionLabel: {
    fontSize: "1rem",
    fontWeight: "bold",
  },
  icon: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
};

export default Dashboard;
