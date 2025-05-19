import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../services/AuthContext";

function ForumDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [commentContent, setCommentContent] = useState("");
  const [commentFile, setCommentFile] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchPost();
  }, [id]);

  const fetchPost = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/forum/posts/${id}`);
      setPost(res.data.post);
    } catch (err) {
      console.error(err);
      setError("Erreur lors du chargement du post.");
    } finally {
      setLoading(false);
    }
  };

  const handleCommentSubmit = async (e) => {
  e.preventDefault();
  console.log("💬 Soumission du commentaire déclenchée");

    if (!user || !user.token) {
      return alert("Vous devez être connecté pour commenter.");
    }

    try {
      // 1. Créer le commentaire texte
      const res = await axios.post(
        `http://localhost:5000/api/forum/posts/${id}/commentaires`,
        { contenu: commentContent },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      const commentaireId = res.data.comment._id;

      // 2. Ajouter un fichier si présent
      if (commentFile) {
        const formData = new FormData();
        formData.append("fichier", commentFile);

        await axios.post(
          `http://localhost:5000/api/forum/commentaires/${commentaireId}/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${user.token}`,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }

      setCommentContent("");
      setCommentFile(null);
      fetchPost();
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire :", err);
      alert("Impossible d'ajouter le commentaire.");
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!post) return <p>Post introuvable.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{post.titre}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Publié par {post.auteur?.prenom || post.auteur?.email} le{" "}
        {new Date(post.dateCreation).toLocaleDateString("fr-FR")}
      </p>
      <p className="mb-6 whitespace-pre-line">{post.contenu}</p>

      {post.piecesJointes?.length > 0 && (
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Pièces jointes :</h3>
          <ul className="list-disc list-inside">
            {post.piecesJointes.map((fichier, index) => (
              <li key={index}>
                <a
                  href={`http://localhost:5000${fichier.url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline"
                >
                  {fichier.nomFichier}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-4">Commentaires :</h3>
        {post.commentaires.length > 0 ? (
          post.commentaires.map((comment) => (
            <div key={comment._id} className="border p-3 rounded mb-3">
              <p className="text-sm font-semibold mb-1">
                {comment.auteur?.prenom || comment.auteur?.email} le{" "}
                {new Date(comment.dateCreation).toLocaleString("fr-FR")}
              </p>
              <p className="mb-2 whitespace-pre-line">{comment.contenu}</p>

              {comment.piecesJointes?.length > 0 && (
                <div>
                  <p className="text-sm font-medium">Fichiers :</p>
                  <ul className="list-disc list-inside">
                    {comment.piecesJointes.map((fichier, index) => (
                      <li key={index}>
                        <a
                          href={`http://localhost:5000${fichier.url}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 underline"
                        >
                          {fichier.nomFichier}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))
        ) : (
          <p>Aucun commentaire pour l'instant.</p>
        )}
      </div>

      {user && (
        <div className="mt-10">
          <h4 className="text-md font-semibold mb-2">Ajouter un commentaire :</h4>
          <form onSubmit={handleCommentSubmit} className="space-y-4">
            <textarea
              className="w-full border rounded p-2"
              rows="4"
              placeholder="Votre commentaire..."
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              required
            />
            <input
              type="file"
              onChange={(e) => setCommentFile(e.target.files[0])}
              accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Publier
            </button>
          </form>
        </div>
      )}
    </div>
  );
}

export default ForumDetail;
