// pages/Signup.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";


const Signup = () => {
  const { setUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    prenom: "",
    nom: "",
    email: "",
    password: "",
    role: "particulier",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/signup", formData);

      setSuccess("Compte créé avec succès ! Vous pouvez maintenant vous connecter.");
      setError("");
      setTimeout(() => navigate("/"), 1500);
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
      setSuccess("");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Créer un compte</h2>
      <form onSubmit={handleSignup} style={styles.form}>
        <input
          type="text"
          name="prenom"
          placeholder="Prénom"
          value={formData.prenom}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="text"
          name="nom"
          placeholder="Nom"
          value={formData.nom}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
          style={styles.input}
        />
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          style={styles.input}
        >
          <option value="particulier">Particulier</option>
          <option value="juridique">Professionnel juridique</option>
        </select>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <button type="submit" style={styles.button}>Créer le compte</button>
      </form>
      <p style={styles.loginText}>
        Vous avez déjà un compte ?
        <Link to="/" style={styles.loginLink}> Se connecter</Link>
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
    backgroundColor: "#16a34a",
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
  success: {
    color: "green",
  },
  loginText: {
    marginTop: "1.5rem",
    fontSize: "0.95rem",
  },
  loginLink: {
    color: "#2563EB",
    fontWeight: "bold",
    textDecoration: "none",
    marginLeft: "0.25rem",
  },
};

export default Signup;
