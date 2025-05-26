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
      <div style={styles.chatMessages}>
        {messages.map((m) => {
          const isMe = m.estExpediteur;
          const role = m.expediteurRole || "particulier"; // facultatif si tu veux l’ajouter
          const couleur = isMe ? "#dbeafe" : role === "juridique" ? "#fef9c3" : "#e5e7eb";

          return (
            <div
              key={m._id}
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: couleur,
                color: "#111827",
                borderRadius: "12px",
                padding: "0.8rem",
                maxWidth: "75%",
                boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
                marginBottom: "1rem",
              }}
            >
              <div style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: "0.3rem" }}>
                {role === "juridique" ? "🧑‍⚖️ " : "🙋 "}
                {m.expediteurNom || m.expediteurEmail}
                {role ? ` - ${role}` : ""}
              </div>
              <div>{m.texte}</div>
              <div style={{ fontSize: "0.75rem", marginTop: "0.5rem", color: "#6b7280" }}>
                {m.createdAt ? new Date(m.createdAt).toLocaleString("fr-FR") : ""}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} style={styles.chatInputBox}>
        <textarea
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          rows={2}
          placeholder="Écrire un message..."
          style={styles.chatTextarea}
        />
        <button type="submit" style={styles.chatSendButton}>Envoyer</button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
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
  chatMessages: {
    flex: 1,
    minHeight: "60vh",
    maxHeight: "60vh",
    overflowY: "auto",
    padding: "1rem",
    display: "flex",
    flexDirection: "column",
  },
  chatInputBox: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "0.5rem",
    borderTop: "1px solid #e5e7eb",
    paddingTop: "1rem",
  },
  chatTextarea: {
    flex: 1,
    padding: "0.6rem",
    borderRadius: "12px",
    border: "1px solid #ccc",
    resize: "none",
    fontSize: "1rem",
  },
  chatSendButton: {
    backgroundColor: "#2563EB",
    color: "white",
    border: "none",
    padding: "0.6rem 1rem",
    borderRadius: "8px",
    cursor: "pointer",
  },
};

export default ChatConversation;
