// pages/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";
import Header from "../components/Layout/Header";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", ville: "", specialite: "", siteInternet: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/profil", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile(res.data.profil);
        setForm(res.data.profil);
      } catch (err) {
        setError("Erreur lors de la récupération du profil");
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const token = localStorage.getItem("token");

    // Exclure les champs interdits (comme le role)
    const { nom, prenom, email, telephone, ville, specialite, siteInternet } = form;

    const res = await axios.put(
      "http://localhost:5000/api/profil",
      { nom, prenom, email, telephone, ville, specialite, siteInternet },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSuccess("Profil mis à jour avec succès !");
    setError("");
    setProfile(res.data.profil);
  } catch (err) {
    setError("Erreur lors de la mise à jour du profil");
    setSuccess("");
  }
};


  const handleDeleteAccount = async () => {
    const confirmed = window.confirm("Voulez-vous vraiment supprimer votre compte ? Cette action est irréversible.");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete("http://localhost:5000/api/profil", {
        headers: { Authorization: `Bearer ${token}` },
      });
      localStorage.removeItem("token");
      setUser(null);
      navigate("/");
    } catch (err) {
      setError("Erreur lors de la suppression du compte");
    }
  };

  return (
    <>
      <Header />
      <div style={styles.container}>
        <h2 style={styles.heading}>Mon profil</h2>
        {error && <p style={styles.error}>{error}</p>}
        {success && <p style={styles.success}>{success}</p>}
        <form onSubmit={handleSubmit} style={styles.form}>
          <input type="text" name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required style={styles.input} />
          <input type="text" name="prenom" placeholder="Prénom" value={form.prenom} onChange={handleChange} required style={styles.input} />
          <input type="email" name="email" placeholder="Email" value={form.email} onChange={handleChange} required style={styles.input} />
          <input type="text" name="telephone" placeholder="Téléphone" value={form.telephone || ""} onChange={handleChange} style={styles.input} />
          <input type="text" name="ville" placeholder="Ville" value={form.ville || ""} onChange={handleChange} style={styles.input} />
          <input type="text" name="specialite" placeholder="Spécialité" value={form.specialite || ""} onChange={handleChange} style={styles.input} />
          <input type="url" name="siteInternet" placeholder="Site Internet" value={form.siteInternet || ""} onChange={handleChange} style={styles.input} />
          <button type="submit" style={styles.button}>Enregistrer</button>
        </form>

        <button onClick={handleDeleteAccount} style={styles.deleteButton}>Supprimer mon compte</button>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "2rem",
    background: "#f9fafb",
    borderRadius: "12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    fontFamily: "sans-serif",
  },
  heading: {
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
  deleteButton: {
    marginTop: "2rem",
    padding: "0.8rem",
    backgroundColor: "#dc2626",
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
};

export default Profile;
