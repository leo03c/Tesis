"use client";

import React, { useCallback, useEffect, useState } from "react";
import { patchProject, Project, UpdateProjectData } from "@/services/catalogService";
import { getPlatforms, getTags, Platform, Tag } from "@/services/gamesService";

interface ModalEditarProyectoProps {
  project: Project;
  onClose: () => void;
  onUpdated: (updatedProject: Project) => void;
}

const statusOptions = [
  { value: "borrador", label: "Borrador" },
  { value: "en_desarrollo", label: "En desarrollo" },
  { value: "en_revision", label: "En revisión" },
  { value: "publicado", label: "Publicado" },
];

const ModalEditarProyecto: React.FC<ModalEditarProyectoProps> = ({
  project,
  onClose,
  onUpdated,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [title, setTitle] = useState(project.title ?? "");
  const [description, setDescription] = useState(project.description ?? "");
  const [status, setStatus] = useState<Project["status"]>(project.status);
  const [progress, setProgress] = useState(project.progress ?? 0);
  const [image, setImage] = useState<File | null>(null);
  const [price, setPrice] = useState(project.price ?? "");
  const [discount, setDiscount] = useState(
    typeof project.discount === "number" ? String(project.discount) : ""
  );
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>(
    project.tags ? project.tags.map((tag) => typeof tag === 'number' ? tag : tag.id).filter((id): id is number => id !== undefined) : []
  );
  const [showTagModal, setShowTagModal] = useState(false);
  const [showPlatformModal, setShowPlatformModal] = useState(false);
  const [platforms, setPlatforms] = useState<Platform[]>([]);
  const [selectedPlatforms, setSelectedPlatforms] = useState<number[]>(
    project.plataformas ? project.plataformas.map((platform) => typeof platform === 'number' ? platform : platform.id).filter((id): id is number => id !== undefined) : []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleClose = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    setIsVisible(false);
    window.setTimeout(onClose, 180);
  }, [isClosing, onClose]);

  const toggleTag = (tagId: number) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  const togglePlatform = (platformId: number) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platformId)
        ? prev.filter((id) => id !== platformId)
        : [...prev, platformId]
    );
  };

  const selectedTagNames = tags
    .filter((tag) => selectedTags.includes(tag.id))
    .map((tag) => tag.name);

  const selectedPlatformNames = platforms
    .filter((platform) => selectedPlatforms.includes(platform.id))
    .map((platform) => platform.nombre);

  useEffect(() => {
    const id = window.requestAnimationFrame(() => setIsVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [tagsResponse, platformsResponse] = await Promise.all([
          getTags(),
          getPlatforms(),
        ]);
        setTags(tagsResponse.results || []);
        setPlatforms(platformsResponse.results || []);
      } catch (err) {
        console.error("Error cargando categorias o plataformas:", err);
      }
    };

    fetchMeta();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("El titulo es obligatorio.");
      return;
    }

    if (progress < 0 || progress > 100) {
      setError("El progreso debe estar entre 0 y 100.");
      return;
    }

    if (price && Number(price) < 0) {
      setError("El precio no puede ser negativo.");
      return;
    }

    if (discount && (Number(discount) < 0 || Number(discount) > 100)) {
      setError("El descuento debe estar entre 0 y 100.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: Partial<UpdateProjectData> = {
        title,
        description,
        status,
        progress,
        price: price || undefined,
        discount: discount ? Number(discount) : undefined,
        tags: selectedTags,
        plataformas: selectedPlatforms,
      };

      if (image) {
        payload.image = image;
      }

      const updatedProject = await patchProject(project.id, payload);
      onUpdated(updatedProject);
      onClose();
    } catch (err: any) {
      console.error("Error actualizando proyecto (objeto detallado):", err);
      if (err.data) {
        console.error("Payload HTTP 400 devuelto por el servidor:", err.data);
        const formatError = (obj: any): string => {
          if (typeof obj !== 'object' || obj === null) return String(obj);
          return Object.entries(obj)
            .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
            .join(' | ');
        };
        setError(`Error del backend: ${formatError(err.data.detalle || err.data)}`);
      } else {
        setError(err.message || "No se pudo actualizar el proyecto.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-200 ${
        isVisible ? "bg-black/70 opacity-100" : "bg-black/0 opacity-0"
      }`}
      onClick={handleClose}
      role="presentation"
    >
      <div
        className={`w-full max-w-4xl overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-deep via-subdeep to-deep shadow-2xl transition-all duration-200 ${
          isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-2 scale-95 opacity-0"
        }`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <h2 className="text-2xl font-bold">Editar proyecto</h2>
            <p className="text-texInactivo text-sm">
              Actualiza los datos principales del proyecto.
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-texInactivo hover:text-white transition"
            aria-label="Cerrar modal"
          >
            <span aria-hidden="true">×</span>
          </button>
        </div>

        <div className="flex max-h-[80vh] flex-col">
          <div className="px-6 py-5 overflow-y-auto">
            {error && <p className="mb-4 text-red-500">{error}</p>}

            <form
              onSubmit={handleSubmit}
              className="grid grid-cols-1 gap-4 lg:grid-cols-3"
            >
              <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-deep/70 p-4">
                <div className="mb-4">
                  <p className="text-sm font-semibold">Detalles del proyecto</p>
                  <p className="text-xs text-texInactivo">Actualiza la informacion principal del juego.</p>
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium">Titulo *</label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-deep px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-1 block text-sm font-medium">Descripcion</label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full resize-none rounded-xl border border-white/10 bg-deep px-3 py-2 text-white focus:border-primary focus:ring-1 focus:ring-primary"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Estado</label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value as Project["status"])}
                      className="w-full rounded-xl border border-white/10 bg-deep px-3 py-2 text-white focus:border-primary"
                    >
                      {statusOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Progreso (%)</label>
                    <input
                      type="number"
                      value={progress}
                      onChange={(e) => setProgress(Number(e.target.value))}
                      min={0}
                      max={100}
                      className="w-full rounded-xl border border-white/10 bg-deep px-3 py-2 text-white focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-white/10 bg-deep/70 p-4">
                <div className="mb-4">
                  <p className="text-sm font-semibold">Publicacion</p>
                  <p className="text-xs text-texInactivo">Define tags, precio e imagen.</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">Categoria/Tag</label>
                    <button
                      type="button"
                      onClick={() => setShowTagModal(true)}
                      className="w-full rounded-xl border border-white/10 bg-deep px-3 py-2 text-left text-sm text-white transition hover:border-primary"
                    >
                      Seleccionar categorias
                    </button>
                    {selectedTagNames.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedTagNames.map((name) => (
                          <span
                            key={name}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Plataformas</label>
                    <button
                      type="button"
                      onClick={() => setShowPlatformModal(true)}
                      className="w-full rounded-xl border border-white/10 bg-deep px-3 py-2 text-left text-sm text-white transition hover:border-primary"
                    >
                      Seleccionar plataformas
                    </button>
                    {selectedPlatformNames.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedPlatformNames.map((name) => (
                          <span
                            key={name}
                            className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white"
                          >
                            {name}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Precio</label>
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-deep px-3 py-2 text-white focus:border-primary"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Descuento (%)</label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      step="1"
                      value={discount}
                      onChange={(e) => setDiscount(e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-deep px-3 py-2 text-white focus:border-primary"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">Imagen</label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                      className="w-full rounded-xl border border-white/10 bg-deep px-3 py-2 text-white file:mr-4 file:rounded-lg file:border-0 file:bg-subdeep file:px-3 file:py-2 file:text-sm file:text-white"
                    />
                    <p className="mt-2 text-xs text-texInactivo">
                      Deja vacio para mantener la imagen actual.
                    </p>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-3 flex flex-wrap justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleClose}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-2 text-sm text-white transition hover:bg-white/10"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-primary px-6 py-2 text-sm font-semibold text-white transition hover:bg-subprimary"
                  disabled={loading}
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showTagModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowTagModal(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-deep p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Seleccionar categorias</h3>
                <p className="text-xs text-texInactivo">
                  Marca todas las categorias que apliquen.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowTagModal(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-texInactivo hover:text-white transition"
                aria-label="Cerrar selector"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-subdeep/40 p-3">
              {tags.length === 0 ? (
                <p className="text-xs text-texInactivo">No hay categorias disponibles.</p>
              ) : (
                tags.map((tag) => (
                  <label
                    key={tag.id}
                    className="flex cursor-pointer items-center justify-between gap-3 text-sm text-white"
                  >
                    <span>{tag.name}</span>
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag.id)}
                      onChange={() => toggleTag(tag.id)}
                      className="h-4 w-4 accent-primary"
                    />
                  </label>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowTagModal(false)}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-subprimary"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}

      {showPlatformModal && (
        <div
          className="fixed inset-0 z-60 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowPlatformModal(false)}
          role="presentation"
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-deep p-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Seleccionar plataformas</h3>
                <p className="text-xs text-texInactivo">
                  Marca donde estara disponible tu proyecto.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowPlatformModal(false)}
                className="rounded-full border border-white/10 bg-white/5 p-2 text-texInactivo hover:text-white transition"
                aria-label="Cerrar selector"
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>

            <div className="max-h-64 space-y-2 overflow-y-auto rounded-xl border border-white/10 bg-subdeep/40 p-3">
              {platforms.length === 0 ? (
                <p className="text-xs text-texInactivo">No hay plataformas disponibles.</p>
              ) : (
                platforms.map((platform) => (
                  <label
                    key={platform.id}
                    className="flex cursor-pointer items-center justify-between gap-3 text-sm text-white"
                  >
                    <span>{platform.nombre}</span>
                    <input
                      type="checkbox"
                      checked={selectedPlatforms.includes(platform.id)}
                      onChange={() => togglePlatform(platform.id)}
                      className="h-4 w-4 accent-primary"
                    />
                  </label>
                ))
              )}
            </div>

            <div className="mt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setShowPlatformModal(false)}
                className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-subprimary"
              >
                Listo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModalEditarProyecto;
