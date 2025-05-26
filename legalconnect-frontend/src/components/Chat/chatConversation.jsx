import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ChatConversation = () => {
  const { destinataireId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/messages/${destinataireId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      console.error("Erreur récupération messages", err);
    }
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/messages",
        { destinataireId, texte: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessages([...messages, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Erreur envoi message", err);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [destinataireId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={styles.container}>
      <h2 style={styles.header}>💬 Discussion</h2>
      <div style={styles.messagesBox}>
        {messages.map((m) => (
          <div
            key={m._id}
            style={{
              ...styles.messageBubble,
              alignSelf: m.estExpediteur ? "flex-end" : "flex-start",
              backgroundColor: m.estExpediteur ? "#dbeafe" : "#e5e7eb",
            }}
          >
            <div style={styles.messageText}>{m.texte}</div>
            <div style={styles.metaInfo}>
              <span>{m.expediteurNom || m.expediteurEmail || "Utilisateur"}</span>
              <span>
                {m.createdAt ? new Date(m.createdAt).toLocaleString("fr-FR") : ""}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={styles.form}>
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrire un message..."
          style={styles.input}
        />
        <button type="submit" style={styles.button}>
          Envoyer
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "600px",
    margin: "2rem auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  header: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
  messagesBox: {
    flex: 1,
    minHeight: "60vh",
    maxHeight: "60vh",
    overflowY: "auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem",
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    backgroundColor: "#f9fafb",
  },
  messageBubble: {
    padding: "0.75rem 1rem",
    borderRadius: "16px",
    maxWidth: "70%",
    position: "relative",
    fontSize: "0.95rem",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  messageText: {
    marginBottom: "0.25rem",
  },
  metaInfo: {
    fontSize: "0.7rem",
    color: "#6b7280",
    display: "flex",
    justifyContent: "space-between",
  },
  form: {
    display: "flex",
    gap: "0.5rem",
  },
  input: {
    flex: 1,
    padding: "0.6rem 1rem",
    borderRadius: "999px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.6rem 1rem",
    backgroundColor: "#2563eb",
    color: "white",
    border: "none",
    borderRadius: "999px",
    cursor: "pointer",
  },
};

export default ChatConversation;
