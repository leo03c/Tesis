"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { getNews } from "@/services/newsService";
import type { NewsArticle } from "@/services/newsService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";

const NoticiasPage: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  const heroDefaults = useMemo(
    () => ["/noticia1.jpg", "/noticia2.jpg"],
    []
  );

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        const response = await getNews();
        setArticles(response.results || []);
        setError(null);
        setApiUrl(null);
      } catch (err) {
        console.error("Error fetching news:", err);
        if (err instanceof APIError) {
          setError(err.message);
          setApiUrl(err.url ?? null);
        } else {
          setError("No se pudieron cargar las noticias");
          setApiUrl(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const aDate = a.published_date ? Date.parse(a.published_date) : 0;
      const bDate = b.published_date ? Date.parse(b.published_date) : 0;
      return bDate - aDate;
    });
  }, [articles]);

  const heroArticles = sortedArticles.slice(0, 2);
  const gridArticles = sortedArticles.slice(2);

  return (
    <main className="flex-1 p-6 overflow-y-auto">
      {loading ? (
        <div className="py-10">
          <Loading message="Cargando noticias..." />
        </div>
      ) : error ? (
        <div className="text-center py-10">
          <p className="text-texInactivo mb-2">{error}</p>
          {apiUrl && (
            <p className="text-texInactivo text-xs">
              URL: <span className="text-primary">{apiUrl}</span>
            </p>
          )}
        </div>
      ) : articles.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-texInactivo">No hay noticias disponibles</p>
        </div>
      ) : (
        <>
          {/* Hero de noticias */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
            {[0, 1].map((index) => {
              const article = heroArticles[index];
              const fallbackImage = heroDefaults[index];
              const image = article?.image || fallbackImage;
              const title = article?.title || "Noticia destacada";
              const excerpt = article?.description || article?.content || "";
              return (
                <div
                  key={article?.id ?? `hero-${index}`}
                  className="relative w-full h-60 md:h-72 rounded-xl overflow-hidden"
                >
                  <Image
                    src={image}
                    alt={title}
                    fill
                    className="object-cover opacity-30"
                  />
                  <div className="absolute bottom-0 left-0 w-full p-4">
                    <h2 className="text-lg font-bold text-text">{title}</h2>
                    {excerpt && (
                      <p className="text-sm text-gray-300 mt-2 line-clamp-2">
                        {excerpt}
                      </p>
                    )}
                    {article?.id ? (
                      <Link
                        href={`/noticia?id=${article.id}`}
                        className="mt-3 inline-block px-4 py-2 bg-subdeep text-white rounded-md text-sm hover:bg-deep"
                      >
                        Leer mas
                      </Link>
                    ) : (
                      <span className="mt-3 inline-block px-4 py-2 bg-subdeep text-white rounded-md text-sm opacity-70">
                        Leer mas
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </section>

          {/* Grid de noticias */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {gridArticles.map((article) => (
              <div
                key={article.id}
                className="bg-transparent rounded-xl overflow-hidden flex flex-col"
              >
                <div className="relative w-full h-40">
                  <Image
                    src={article.image || "/pic1.jpg"}
                    alt={article.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-semibold font-primary text-text mb-2">
                    {article.title}
                  </h3>
                  <p className="text-sm text-gray-300 flex-grow font-primary">
                    {article.description || article.content || ""}
                  </p>
                  <Link
                    href={`/noticia?id=${article.id}`}
                    className="mt-4 px-6 py-3 bg-subdeep font-primary text-white rounded-2xl text-xs hover:deep self-start"
                  >
                    Leer mas
                  </Link>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
    </main>
  );
};

export default NoticiasPage;
