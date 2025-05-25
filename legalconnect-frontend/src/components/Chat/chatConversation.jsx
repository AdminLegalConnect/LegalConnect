// Legalconnect-frontend/src/components/Chat/ChatConversation.jsx
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
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Discussion</h2>
      <div className="border rounded p-4 h-96 overflow-y-scroll bg-gray-50">
        {messages.map((m) => (
          <div
            key={m._id}
            className={`mb-2 max-w-xs p-2 rounded-lg text-sm ${
              m.estExpediteur ? "bg-blue-200 ml-auto" : "bg-gray-200"
            }`}
          >
            {m.texte}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSend} className="mt-4 flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Écrire un message..."
          className="flex-grow border rounded-l p-2"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 rounded-r"
        >
          Envoyer
        </button>
      </form>
    </div>
  );
};

export default ChatConversation;
