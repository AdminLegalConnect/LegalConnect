import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import logo from "../../assets/logo.png"; // adapte le chemin si besoin

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
      <div style={styles.leftContainer}>
        <div style={styles.logoContainer}>
          <img src={logo} alt="LegalConnect" style={styles.logo} />
          <span style={styles.logoText}>LegalConnect</span>
        </div>
        <Link to="/mes-plaintes" style={styles.link}>Mes dossiers</Link>
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
  leftContainer: {
    display: "flex",
    alignItems: "center",
    gap: "2rem",
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
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "1rem",
    transition: "opacity 0.2s",
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
