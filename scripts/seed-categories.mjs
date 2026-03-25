#!/usr/bin/env node

/**
 * Seed categories (tags) into CosmoX backend.
 *
 * Usage:
 *   node scripts/seed-categories.mjs
 *
 * Env vars:
 *   API_URL=http://localhost:8000/api
 *   SEED_TOKEN=<jwt_access_token_optional>
 */

const API_URL = (process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api").replace(/\/$/, "");
const SEED_TOKEN = process.env.SEED_TOKEN || "";

const categories = [
  "Accion",
  "Aventura",
  "RPG",
  "Estrategia",
  "Simulacion",
  "Deportes",
  "Carreras",
  "Puzzle",
  "Terror",
  "Mundo Abierto",
  "Multijugador",
  "Indie",
  "FPS",
  "Plataformas",
  "Roguelike",
  "Survival",
  "Sandbox",
  "Narrativo",
  "Metroidvania",
  "Battle Royale",
];

function slugify(value) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function getHeaders(withBody = false) {
  const headers = {};
  if (withBody) headers["Content-Type"] = "application/json";
  if (SEED_TOKEN) headers["Authorization"] = `Bearer ${SEED_TOKEN}`;
  return headers;
}

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const response = await fetch(url, options);

  let data = null;
  try {
    data = await response.json();
  } catch {
    data = null;
  }

  return { ok: response.ok, status: response.status, data, url };
}

async function fetchAllExistingTags() {
  const first = await request("/games/tags/");
  if (!first.ok) {
    throw new Error(`No se pudo leer categorias existentes (${first.status}) en ${first.url}`);
  }

  // API paginada estilo DRF: { count, next, previous, results }
  const initialResults = Array.isArray(first.data?.results) ? first.data.results : [];
  const all = [...initialResults];

  let nextUrl = first.data?.next || null;
  while (nextUrl) {
    const response = await fetch(nextUrl, { headers: getHeaders(false) });
    const page = await response.json();
    if (!response.ok) {
      throw new Error(`Error leyendo pagina de categorias: ${response.status}`);
    }

    const pageResults = Array.isArray(page?.results) ? page.results : [];
    all.push(...pageResults);
    nextUrl = page?.next || null;
  }

  return all;
}

async function createCategory(name) {
  // Intento 1: serializer comun (solo name)
  let payload = { name };
  let result = await request("/games/tags/", {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });

  if (result.ok) return result;

  // Intento 2: algunos serializers piden slug explicito
  payload = { name, slug: slugify(name) };
  result = await request("/games/tags/", {
    method: "POST",
    headers: getHeaders(true),
    body: JSON.stringify(payload),
  });

  return result;
}

async function main() {
  console.log(`\nSeed de categorias -> ${API_URL}`);

  const existingTags = await fetchAllExistingTags();
  const existingSlugs = new Set(
    existingTags.map((t) => (t.slug || slugify(t.name || "")).toLowerCase())
  );

  let created = 0;
  let skipped = 0;
  let failed = 0;

  for (const categoryName of categories) {
    const slug = slugify(categoryName);

    if (existingSlugs.has(slug)) {
      skipped += 1;
      console.log(`- SKIP  ${categoryName} (ya existe)`);
      continue;
    }

    const createdResult = await createCategory(categoryName);
    if (createdResult.ok) {
      created += 1;
      existingSlugs.add(slug);
      console.log(`- OK    ${categoryName}`);
      continue;
    }

    failed += 1;
    console.log(
      `- FAIL  ${categoryName} -> HTTP ${createdResult.status} ${JSON.stringify(createdResult.data)}`
    );

    if (createdResult.status === 401 || createdResult.status === 403) {
      console.log("\nTip: define SEED_TOKEN con un access token valido de un usuario con permisos.");
      break;
    }

    if (createdResult.status === 405) {
      console.log("\nEl endpoint /games/tags/ no permite POST en este backend.");
      console.log("Necesitas habilitar create en el ViewSet de tags o poblar desde el backend (Django admin/fixture).");
      break;
    }
  }

  console.log("\nResumen:");
  console.log(`  creadas:   ${created}`);
  console.log(`  omitidas:  ${skipped}`);
  console.log(`  fallidas:  ${failed}`);
}

main().catch((error) => {
  console.error("\nError ejecutando seed:", error.message || error);
  process.exit(1);
});
