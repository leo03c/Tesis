const fs = require('fs');
let content = fs.readFileSync('src/services/gamesService.ts', 'utf-8');

const interfaceReplacement = export interface Review {
  id: number;
  id_usuario: number;
  id_juego: number;
  calificacion: number;
  comentario: string;
  titulo?: string;
  fecha_creacion: string;
  username_display?: string;
};

content = content.replace(/export interface Review \{[\s\S]*?\}/, interfaceReplacement);

const fetchFunction = 
export interface ReviewsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Review[];
}

export const getReviewsByGameId = (gameId: number) =>
  api.get<ReviewsResponse>(\"/reviews/resenas/?id_juego=\$" + "{gameId}\");
;

content = content.replace('export const createReview', fetchFunction + '\nexport const createReview');
content = content.replace('createReview,', 'createReview,\n  getReviewsByGameId,');
fs.writeFileSync('src/services/gamesService.ts', content);
console.log('updated');
