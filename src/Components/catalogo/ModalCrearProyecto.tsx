"use client";

import React, { useState } from "react";
import { createProject, Project } from "@/services/catalogService";

interface ModalCrearProyectoProps {
  onClose: () => void;
  onCreated: (newProject: Project) => void;
}

const statusOptions = [
  { value: "borrador", label: "Borrador" },
  { value: "en_desarrollo", label: "En desarrollo" },
  { value: "en_revision", label: "En revisión" },
  { value: "publicado", label: "Publicado" },
];

const ModalCrearProyecto: React.FC<ModalCrearProyectoProps> = ({
  onClose,
  onCreated,
}) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("borrador");
  const [progress, setProgress] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("El título es obligatorio.");
      return;
    }

    if (progress < 0 || progress > 100) {
      setError("El progreso debe estar entre 0 y 100.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload = {
        title,
        description,
        status,
        progress,
        image: image || null,
      };

      const newProject = await createProject(payload);
      onCreated(newProject);
      onClose();
    } catch (err) {
      console.error("Error creando proyecto:", err);
      setError("No se pudo crear el proyecto.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-deep rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Crear nuevo proyecto</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Título */}
          <div>
            <label className="block mb-1 font-medium">Título *</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-subdeep text-white border border-gray-600"
              required
            />
          </div>

          {/* Descripción */}
          <div>
            <label className="block mb-1 font-medium">Descripción</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-subdeep text-white border border-gray-600 resize-none"
              rows={3}
            />
          </div>

          {/* Estado */}
          <div>
            <label className="block mb-1 font-medium">Estado</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-subdeep text-white border border-gray-600"
            >
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Progreso */}
          <div>
            <label className="block mb-1 font-medium">Progreso (%)</label>
            <input
              type="number"
              value={progress}
              onChange={(e) => setProgress(Number(e.target.value))}
              min={0}
              max={100}
              className="w-full px-3 py-2 rounded-lg bg-subdeep text-white border border-gray-600"
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block mb-1 font-medium">Imagen</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setImage(e.target.files ? e.target.files[0] : null)
              }
              className="w-full text-white"
            />
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-500 transition"
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-primary hover:bg-subprimary transition text-white font-semibold"
              disabled={loading}
            >
              {loading ? "Creando..." : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalCrearProyecto;
