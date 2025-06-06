// pages/Profile.jsx
import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../services/AuthContext";

const Profile = () => {
  const { user, setUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ nom: "", prenom: "", email: "", telephone: "", ville: "", specialite: "", siteInternet: "" });
  const [passwordForm, setPasswordForm] = useState({ ancienMotDePasse: "", nouveauMotDePasse: "" });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordError, setPasswordError] = useState("");

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

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.put("http://localhost:5000/api/profil/photo", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setProfile(res.data.profil);
      setSuccess("Photo mise à jour avec succès !");
      setError("");
    } catch (err) {
      console.error(err);
      setError("Erreur lors de l'envoi de la photo.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const { nom, prenom, email, telephone, ville, specialite, siteInternet } = form;
      const res = await axios.put("http://localhost:5000/api/profil", { nom, prenom, email, telephone, ville, specialite, siteInternet }, {
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put("http://localhost:5000/api/profil/motdepasse", passwordForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPasswordSuccess("Mot de passe mis à jour avec succès.");
      setPasswordError("");
      setPasswordForm({ ancienMotDePasse: "", nouveauMotDePasse: "" });
    } catch (err) {
      setPasswordError("Erreur lors du changement de mot de passe.");
      setPasswordSuccess("");
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Confirmez-vous la suppression de votre compte ?")) return;
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
      <div style={styles.container}>
        <h2 style={styles.heading}>Mon profil</h2>
        {profile?.photo && (
          <img
            src={`http://localhost:5000${profile.photo}`}
            alt="Photo de profil"
            style={styles.avatar}
          />
        )}
        <input type="file" accept="image/*" onChange={handlePhotoChange} style={styles.fileInput} />

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
          {profile?.role === "juridique" && profile?.moyenneNote && (
  <p style={{ fontSize: "1rem", color: "#2563EB", fontWeight: "bold" }}>
    Note moyenne : ⭐ {profile.moyenneNote} / 5
  </p>
)}

          <button type="submit" style={styles.button}>Enregistrer</button>
        </form>

        <h3 style={{ marginTop: "2rem", color: "#1e3a8a" }}>Changer de mot de passe</h3>
        {passwordError && <p style={styles.error}>{passwordError}</p>}
        {passwordSuccess && <p style={styles.success}>{passwordSuccess}</p>}
        <form onSubmit={handlePasswordChange} style={styles.form}>
          <input type="password" name="ancienMotDePasse" placeholder="Ancien mot de passe" value={passwordForm.ancienMotDePasse} onChange={(e) => setPasswordForm({ ...passwordForm, ancienMotDePasse: e.target.value })} style={styles.input} required />
          <input type="password" name="nouveauMotDePasse" placeholder="Nouveau mot de passe" value={passwordForm.nouveauMotDePasse} onChange={(e) => setPasswordForm({ ...passwordForm, nouveauMotDePasse: e.target.value })} style={styles.input} required />
          <button type="submit" style={styles.button}>Modifier le mot de passe</button>
        </form>

        <button onClick={handleDeleteAccount} style={styles.deleteButton}>Supprimer mon compte</button>
      {profile?.role === "juridique" && (
  <button
    onClick={() => navigate("/facturation")}
    style={{ marginTop: "1.5rem", ...styles.button }}
  >
    🧾 Voir ma facturation
  </button>
)}
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
  avatar: {
    width: "120px",
    height: "120px",
    borderRadius: "50%",
    objectFit: "cover",
    margin: "0 auto 1rem",
    display: "block",
    border: "2px solid #ccc",
  },
  fileInput: {
    marginBottom: "1rem",
  },
};

export default Profile;
