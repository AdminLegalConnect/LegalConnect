// components/Layout/Header.jsx
import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";
import logo from "../../assets/logo.png";

const Header = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <div style={styles.logoContainer} onClick={() => navigate("/dashboard")}>
        <img src={logo} alt="LegalConnect" style={styles.logo} />
        <span style={styles.logoText}>LegalConnect</span>
      </div>

      <nav style={styles.navLinks}>
        {user && (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/mes-plaintes" style={styles.link}>Mes dossiers</Link>
            <Link to="/mes-avis" style={styles.link}>Mes avis</Link>
            <Link to="/profil" style={styles.link}>Mon profil</Link>
          </>
        )}
        <button onClick={handleLogout} style={styles.logoutButton}>Déconnexion</button>
      </nav>
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
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    cursor: "pointer",
  },
  logo: {
    width: "36px",
    height: "36px",
  },
  logoText: {
    fontSize: "1.4rem",
    fontWeight: "bold",
    color: "white",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontWeight: "500",
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
    transition: "background-color 0.2s",
  },
};

export default Header;
