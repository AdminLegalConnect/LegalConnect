// pages/Forum.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Forum = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/forum/posts", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(res.data.posts);
      } catch (err) {
        setError("Erreur lors de la récupération des posts");
        console.error(err);
      }
    };
    fetchPosts();
  }, []);

  return (
    <>
      <div style={styles.container}>
        <div style={styles.headerBox}>
          <h2 style={styles.heading}>Forum - Explorer les thématiques</h2>
          <button onClick={() => navigate("/forum/nouveau")} style={styles.newButton}>
            + Nouveau sujet
          </button>
        </div>
        {error && <p style={styles.error}>{error}</p>}
        <ul style={styles.list}>
          {posts.map((post) => (
            <li key={post._id} style={styles.item}>
              <strong style={styles.title}>{post.titre}</strong>
              <p style={styles.meta}>
                <span>{post.thematique}</span> • <span>{new Date(post.dateCreation).toLocaleDateString("fr-FR")}</span>
              </p>
              <p style={styles.desc}>{post.contenu.slice(0, 100)}...</p>
              <p style={styles.auteur}>Par {post.auteur?.prenom || post.auteur?.email}</p>
              <button onClick={() => navigate(`/forum/${post._id}`)} style={styles.button}>
                Voir
              </button>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const styles = {
  container: {
    maxWidth: "800px",
    margin: "2rem auto",
    padding: "1rem",
    fontFamily: "sans-serif",
  },
  heading: {
    fontSize: "1.8rem",
  },
  list: {
    listStyle: "none",
    padding: 0,
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  item: {
    backgroundColor: "#f3f4f6",
    padding: "1rem",
    borderRadius: "8px",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  },
  title: {
    fontSize: "1.2rem",
    fontWeight: "bold",
  },
  meta: {
    fontSize: "0.9rem",
    color: "#6b7280",
    marginBottom: "0.5rem",
  },
  desc: {
    color: "#374151",
  },
  auteur: {
    fontSize: "0.85rem",
    color: "#4b5563",
    marginTop: "0.4rem",
  },
  button: {
    marginTop: "0.6rem",
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    padding: "0.4rem 0.8rem",
    borderRadius: "6px",
    cursor: "pointer",
  },
  newButton: {
    backgroundColor: "#10b981",
    color: "white",
    border: "none",
    padding: "0.6rem 1.2rem",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "0.9rem",
  },
  headerBox: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  error: {
    color: "red",
  },
};

export default Forum;
