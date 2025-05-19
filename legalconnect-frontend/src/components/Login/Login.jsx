import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link, Navigate } from "react-router-dom";
import { AuthContext } from "../../services/AuthContext";

const Login = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  if (user && user.token) {
    return <Navigate to="/dashboard" />;
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      const { token } = res.data;
      localStorage.setItem("token", token);

      const userData = JSON.parse(atob(token.split(".")[1]));
      setUser({ ...userData, token });

      window.location.reload(); // recharge l’app avec AuthContext
    } catch (err) {
      setError("Email ou mot de passe incorrect");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Connexion</h2>
      <form onSubmit={handleLogin} style={styles.form}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <input
          type="password"
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={styles.input}
        />
        {error && <p style={styles.error}>{error}</p>}
        <button type="submit" style={styles.button}>Se connecter</button>
      </form>
      <p style={styles.signupText}>
        Vous n'avez pas de compte ?
        <Link to="/signup" style={styles.signupLink}> Créer un compte</Link>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "5rem auto",
    padding: "2rem",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
    backgroundColor: "#f9fafb",
    textAlign: "center",
    fontFamily: "sans-serif",
  },
  title: {
    fontSize: "1.8rem",
    marginBottom: "1.5rem",
    color: "#1e3a8a",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.8rem",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
  error: {
    color: "red",
  },
  signupText: {
    marginTop: "1.5rem",
    fontSize: "0.95rem",
  },
  signupLink: {
    color: "#2563EB",
    fontWeight: "bold",
    textDecoration: "none",
    marginLeft: "0.25rem",
  },
};

export default Login;
