"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { getNewsById, getNews } from "@/services/newsService";
import type { NewsArticle } from "@/services/newsService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";

function NoticiaContent() {
  const searchParams = useSearchParams();
  const idParam = searchParams.get("id");
  const articleId = idParam ? Number(idParam) : null;

  const [article, setArticle] = useState<NewsArticle | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  const fallbackImages = useMemo(() => ["/noti1.jpg", "/noti2.jpg"], []);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        if (articleId) {
          const response = await getNewsById(articleId);
          setArticle(response);
          setError(null);
          setApiUrl(null);
          return;
        }

        const response = await getNews();
        const firstArticle = response.results?.[0] ?? null;
        setArticle(firstArticle);
        setError(null);
        setApiUrl(null);
      } catch (err) {
        console.error("Error fetching news article:", err);
        if (err instanceof APIError) {
          setError(err.message);
          setApiUrl(err.url ?? null);
        } else {
          setError("No se pudo cargar la noticia");
          setApiUrl(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [articleId]);

  const banner = article?.image || fallbackImages[0];
  const banner2 = fallbackImages[1];
  const title = article?.title || "Noticia";
  const description = article?.description || "";
  const content = article?.content || "";

  if (loading) {
    return (
      <div className="py-10">
        <Loading message="Cargando noticia..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-texInactivo mb-2">{error}</p>
        {apiUrl && (
          <p className="text-texInactivo text-xs">
            URL: <span className="text-primary">{apiUrl}</span>
          </p>
        )}
      </div>
    );
  }

  if (!article) {
    return (
      <div className="text-center py-10">
        <p className="text-texInactivo">No se encontro la noticia</p>
      </div>
    );
  }

  return (
    <>
      {/* HERO - Banner principal */}
      <div className="relative w-full h-96 md:h-[550px] rounded-2xl overflow-hidden">
        <Image src={banner} alt={title} fill className="object-cover block" />
      </div>

      {/* CONTENIDO */}
      <section className="mt-12 space-y-10">
        <p className="text-2xl leading-relaxed font-bold text-text font-primary">
          {title}
        </p>
        {description && (
          <p className="font-primary text-m text-texInactivo">{description}</p>
        )}

        {content && (
          <div className="space-y-4">
            <p className="font-primary text-m text-texInactivo whitespace-pre-line">
              {content}
            </p>
          </div>
        )}

        <div className="relative w-full h-96 md:h-[150px] overflow-hidden">
          <Image src={banner2} alt="Imagen secundaria" fill className="object-cover block" />
        </div>
      </section>
    </>
  );
}

export default function NoticiaPage() {
  return (
    <main className="w-full min-h-screen px-6 py-10 font-[Nunito_Sans] bg-[var(--color-dark)] text-[var(--color-text)]">
      <Suspense fallback={<Loading message="Cargando..." />}>
        <NoticiaContent />
      </Suspense>
    </main>
  );
}
