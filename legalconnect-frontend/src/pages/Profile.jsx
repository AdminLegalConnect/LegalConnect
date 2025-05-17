// pages/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";
import Header from "../components/Layout/Header";

const Profile = () => {
  const { user } = useContext(AuthContext);
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
      const res = await axios.put("http://localhost:5000/api/profil", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSuccess("Profil mis à jour avec succès !");
      setError("");
      setProfile(res.data.profil);
    } catch (err) {
      setError("Erreur lors de la mise à jour du profil");
      setSuccess("");
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
          <label>Nom</label>
          <input type="text" name="nom" value={form.nom} onChange={handleChange} required />

          <label>Prénom</label>
          <input type="text" name="prenom" value={form.prenom} onChange={handleChange} required />

          <label>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required />

          <label>Téléphone</label>
          <input type="text" name="telephone" value={form.telephone || ""} onChange={handleChange} />

          <label>Ville</label>
          <input type="text" name="ville" value={form.ville || ""} onChange={handleChange} />

          <label>Spécialité</label>
          <input type="text" name="specialite" value={form.specialite || ""} onChange={handleChange} />

          <label>Site Internet</label>
          <input type="url" name="siteInternet" value={form.siteInternet || ""} onChange={handleChange} />

          <button type="submit" style={styles.button}>Enregistrer</button>
        </form>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "sans-serif",
  },
  heading: {
    fontSize: "1.8rem",
    marginBottom: "1rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.8rem",
  },
  button: {
    marginTop: "1rem",
    padding: "0.6rem 1rem",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
  error: {
    color: "red",
  },
  success: {
    color: "green",
  },
};

export default Profile;
