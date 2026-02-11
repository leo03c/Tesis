"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import StarRating from "@/Components/StarRating";
import { createReview } from "@/services/gamesService";
import type { Review } from "@/services/gamesService";
import { FaUserCircle } from "react-icons/fa";

interface ReviewsSectionProps {
  gameId: number;
  reviews: Review[];
  onReviewAdded: (newReview: Review) => void;
}

const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  gameId,
  reviews,
  onReviewAdded,
}) => {
  const { data: session, status } = useSession();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const newReview = await createReview({
        game: gameId,
        rating,
        comment,
      });
      onReviewAdded(newReview);
      setComment("");
      setRating(5);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "No se pudo enviar la reseña.";
      console.error("Error creating review:", err);
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-subdeep rounded-2xl p-6 mt-8">
      <h2 className="text-xl font-bold mb-6">Reseñas de Usuarios</h2>

      {/* Formulario de nueva reseña */}
      {status === "authenticated" ? (
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-deep rounded-xl border border-gray-700">
          <h3 className="text-sm font-semibold mb-3">Deja tu opinión</h3>
          
          <div className="mb-4">
            <label className="block text-xs text-texInactivo mb-1">Calificación</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-2xl transition-colors ${
                    star <= rating ? "text-yellow-500" : "text-gray-600"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-xs text-texInactivo mb-1">Comentario</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full bg-subdeep border border-gray-700 rounded-lg p-3 text-sm focus:border-primary outline-none text-white resize-none"
              rows={3}
              placeholder="¿Qué te pareció este juego?"
              required
            />
          </div>

          {error && <p className="text-red-400 text-xs mb-3">{error}</p>}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded-lg text-sm font-semibold transition disabled:opacity-50"
            >
              {isSubmitting ? "Enviando..." : "Publicar Reseña"}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-8 p-4 bg-deep rounded-xl text-center">
          <p className="text-texInactivo text-sm">
            <a href="/login" className="text-primary hover:underline">Inicia sesión</a> para dejar una reseña.
          </p>
        </div>
      )}

      {/* Lista de reseñas */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-texInactivo text-sm text-center py-4">
            Aún no hay reseñas para este juego. ¡Sé el primero en opinar!
          </p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    <FaUserCircle className="text-gray-400 text-xl" />
                  </div>
                  <div>
                    <span className="text-sm font-semibold block">{review.user || "Usuario"}</span>
                    <span className="text-xs text-texInactivo">
                      {new Date(review.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <StarRating rating={review.rating} size="text-xs" showValue={false} />
              </div>
              <p className="text-sm text-gray-300 ml-10">{review.comment}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;
