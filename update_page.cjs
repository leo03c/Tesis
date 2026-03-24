const fs = require('fs');
let code = fs.readFileSync('src/app/(media)/juego/[slug]/page.tsx', 'utf-8');

code = code.replace(
  'import { getGameBySlug, getGames, createReview }',
  'import { getGameBySlug, getGames, createReview, getReviewsByGameId }'
);

code = code.replace(
  'import type { Game, CreateReviewInput } from "@/services/gamesService";',
  'import type { Game, CreateReviewInput, Review } from "@/services/gamesService";'
);

code = code.replace(
  'const [actionMessage, setActionMessage] = useState<{ text: string; type: \\'success\\' | \\'error\\' } | null>(null);',
  'const [actionMessage, setActionMessage] = useState<{ text: string; type: \\'success\\' | \\'error\\' } | null>(null);\n  const [reviews, setReviews] = useState<Review[]>([]);'
);

const fetchReviewsCode = 
      try {
        setLoading(true);
        // Juego actual
        const gameData = await getGameBySlug(slug);
        setGame(gameData);
        if (gameData && gameData.id) {
            try {
                const revs = await getReviewsByGameId(gameData.id);
                if (revs && revs.results) {
                    setReviews(revs.results);
                }
            } catch (err) { console.error('Error fetching reviews:', err); }
        }
;
code = code.replace(
  /try \{\s*setLoading\(true\);\s*\/\/\s*Juego actual\s*const gameData = await getGameBySlug\(slug\);\s*setGame\(gameData\);/,
  fetchReviewsCode
);

const reviewCallback = 
      await createReview(reviewPayload);
      
      showMessage("Gracias por tu reseña!", "success");
      setShowReviewModal(false);
      setReviewText("");
      setReviewRating(0);
      
      // Update reviews list and general rating automatically
      try {
        const updatedGame = await getGameBySlug(slug);
        setGame(updatedGame);
        const upRevs = await getReviewsByGameId(updatedGame.id);
        if (upRevs && upRevs.results) {
            setReviews(upRevs.results);
        }
      } catch (err) {}
;
code = code.replace(
  /await createReview\(reviewPayload\);\s*showMessage\("Gracias por tu reseña!", "success"\);\s*setShowReviewModal\(false\);\s*setReviewText\(""\);\s*setReviewRating\(0\);/,
  reviewCallback
);

const reviewsHTML = 
      {/* Información lateral del juego actual */}
      <div className="space-y-4">
;
let insertPointHTML = 
      </div>

      {/* SECCIÓN DE RESEÑAS */}
      <div className="md:col-span-3 mt-8 border-t border-deep pt-8">
        <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold">Reseñas de Usuarios ({reviews.length})</h3>
            <button
                onClick={() => {
                   if (status !== 'authenticated') { window.location.href = '/login'; return; }
                   setShowReviewModal(true);
                }}
                className="bg-primary hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-xl transition-colors shadow-md text-sm"
            >
                Escribir una reseña
            </button>
        </div>
        
        {reviews.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev, idx) => (
              <div key={rev.id || idx} className="bg-subdeep/40 border border-white/5 p-5 rounded-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="bg-primary/20 text-primary w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg">
                    {(rev.usuario?.username || rev.username_display || 'U')[0].toUpperCase()}
                  </div>
                  <div>
                      <span className="font-semibold block leading-tight">{rev.usuario?.username || rev.username_display || 'Usuario anónimo'}</span>
                      <span className="text-gray-500 text-xs">
                        {rev.fecha_creacion ? new Date(rev.fecha_creacion).toLocaleDateString() : 'Reciente'}
                      </span>
                  </div>
                  <div className="ml-auto bg-dark p-2 rounded-lg border border-white/5">
                    <StarRating rating={rev.calificacion / 2} size="text-sm" />
                  </div>
                </div>
                {rev.titulo && <h4 className="font-bold text-white mb-1">{rev.titulo}</h4>}
                {rev.comentario ? (
                  <p className="text-sm text-gray-300 leading-relaxed">{rev.comentario}</p>
                ) : (
                  <p className="text-sm text-gray-500 italic">Sin comentarios.</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-subdeep/30 border border-white/5 rounded-2xl p-8 text-center text-gray-400">
             <p className="mb-4">Este juego aún no tiene reseñas.</p>
             <button
                onClick={() => {
                   if (status !== 'authenticated') { window.location.href = '/login'; return; }
                   setShowReviewModal(true);
                }}
                className="text-primary hover:text-white transition-colors underline decoration-primary/30 underline-offset-4"
             >
                Sé el primero en dejar tu opinión!
             </button>
          </div>
        )}
      </div>

      {/* Modal de Reseñas */}
;

code = code.replace(
  /<\/div>\s*\{\/\*\s*Modal de Reseñas\s*\*\/\}/,
  insertPointHTML
);

fs.writeFileSync('src/app/(media)/juego/[slug]/page.tsx', code);
console.log('Page updated.');
