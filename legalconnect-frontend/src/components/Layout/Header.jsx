import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import logo from "../../assets/logo.png"; // à adapter si tu ajoutes le fichier dans assets/

const Header = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer}>
        <img src={logo} alt="LegalConnect" style={styles.logo} />
        <span style={styles.logoText}>LegalConnect</span>
      </div>
      <button onClick={handleLogout} style={styles.logoutButton}>
        Déconnexion
      </button>
    </header>
  );
};

const styles = {
  header: {
    backgroundColor: "#1e3a8a",
    color: "white",
    padding: "1rem 2rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "2px solid #3b82f6",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
  },
  logo: {
    width: "32px",
    height: "32px",
  },
  logoText: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  logoutButton: {
    backgroundColor: "#ef4444",
    color: "white",
    padding: "0.5rem 1rem",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default Header;
