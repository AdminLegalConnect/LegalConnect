// src/pages/ForumDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

function ForumDetail() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
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

    fetchPost();
  }, [id]);

  if (loading) return <p>Chargement...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!post) return <p>Post introuvable.</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-2">{post.titre}</h2>
      <p className="text-sm text-gray-500 mb-4">
        Publié par {post.auteur?.prenom || post.auteur?.email} le {new Date(post.dateCreation).toLocaleDateString("fr-FR")}
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
                {comment.auteur?.prenom || comment.auteur?.email} le {new Date(comment.date).toLocaleString("fr-FR")}
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
    </div>
  );
}

export default ForumDetail;
