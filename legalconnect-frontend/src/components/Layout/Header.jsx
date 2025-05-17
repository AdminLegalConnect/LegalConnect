// Header.jsx
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

      <div style={styles.navLinks}>
        {user && (
          <>
            <Link to="/dashboard" style={styles.link}>Dashboard</Link>
            <Link to="/mes-plaintes" style={styles.link}>Mes dossiers</Link>
            <Link to="/mes-avis" style={styles.link}>Mes avis</Link>
          </>
        )}
        <button onClick={handleLogout} style={styles.logoutButton}>Déconnexion</button>
      </div>
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
    position: "sticky",
    top: 0,
    zIndex: 1000,
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    cursor: "pointer",
  },
  logo: {
    width: "32px",
    height: "32px",
  },
  logoText: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
    flexWrap: "wrap",
  },
  link: {
    color: "white",
    textDecoration: "none",
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
