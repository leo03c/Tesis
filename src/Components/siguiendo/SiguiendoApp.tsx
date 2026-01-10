"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { getFollowing } from "@/services/followService";
import type { UserProfile } from "@/services/followService";
import { APIError } from "@/services/api";
import Loading from "@/Components/loading/Loading";

const pic4 = "/pic4.jpg";

const SiguiendoApp = () => {
  const [activeTab, setActiveTab] = useState<"siguiendo" | "sugerencias">("siguiendo");
  const [followingList, setFollowingList] = useState<UserProfile[]>([]);
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiUrl, setApiUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        setLoading(true);
        const response = await getFollowing();
        setFollowingList(response.results);
        // For now, suggestions will be empty as we don't have that endpoint
        setSuggestions([]);
        setError(null);
        setApiUrl(null);
      } catch (err) {
        console.error('Error fetching following:', err);
        if (err instanceof APIError) {
          setError(err.message);
          setApiUrl(err.url);
        } else {
          setError('No se pudo cargar la lista de seguidos');
          setApiUrl(null);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, []);

  const handleUnfollow = (id: number) => {
    setFollowingList(followingList.filter((u) => u.id !== id));
  };

  const handleFollow = (id: number) => {
    const userToFollow = suggestions.find((u) => u.id === id);
    if (userToFollow) {
      setFollowingList([...followingList, { ...userToFollow, is_following: true }]);
      setSuggestions(suggestions.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Siguiendo</h1>
        <p className="text-texInactivo">Desarrolladores y usuarios que sigues</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("siguiendo")}
          className={`px-6 py-3 rounded-xl font-medium transition ${
            activeTab === "siguiendo"
              ? "bg-primary text-white"
              : "bg-subdeep text-texInactivo hover:text-white"
          }`}
        >
          Siguiendo ({followingList.length})
        </button>
        <button
          onClick={() => setActiveTab("sugerencias")}
          className={`px-6 py-3 rounded-xl font-medium transition ${
            activeTab === "sugerencias"
              ? "bg-primary text-white"
              : "bg-subdeep text-texInactivo hover:text-white"
          }`}
        >
          Sugerencias ({suggestions.length})
        </button>
      </div>

      {/* Content */}
      <div className="rounded-3xl bg-deep py-10 px-6">
        {loading ? (
          <Loading message="Cargando..." />
        ) : error ? (
          <div className='text-center py-8'>
            <p className='text-texInactivo mb-2'>{error}</p>
            {apiUrl && (
              <p className='text-texInactivo text-xs mt-2'>
                URL: <span className='text-primary'>{apiUrl}</span>
              </p>
            )}
          </div>
        ) : activeTab === "siguiendo" ? (
          <div className="space-y-4">
            {followingList.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-texInactivo mb-4">No estás siguiendo a nadie aún</p>
                <button
                  onClick={() => setActiveTab("sugerencias")}
                  className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition"
                >
                  Ver sugerencias
                </button>
              </div>
            ) : (
              followingList.map((user, i) => (
                <div
                  key={i}
                  className="bg-subdeep rounded-xl p-4 flex items-center gap-4 hover:bg-categorico transition"
                >
                  <div className="w-14 h-14 relative flex-shrink-0">
                    <Image
                      src={user.avatar || pic4}
                      alt={user.name}
                      fill
                      sizes="56px"
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{user.name}</h3>
                      <span className="bg-categorico text-texInactivo px-2 py-0.5 rounded text-xs">
                        {user.type}
                      </span>
                    </div>
                    <p className="text-texInactivo text-sm">
                      {user.followers} seguidores {(user.games && user.games > 0) && `• ${user.games} juegos`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnfollow(user.id)}
                    className="bg-subdeep border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition"
                  >
                    Siguiendo
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-texInactivo">No hay más sugerencias por ahora</p>
              </div>
            ) : (
              suggestions.map((user, i) => (
                <div
                  key={i}
                  className="bg-subdeep rounded-xl p-4 flex items-center gap-4 hover:bg-categorico transition"
                >
                  <div className="w-14 h-14 relative flex-shrink-0">
                    <Image
                      src={user.avatar || pic4}
                      alt={user.name}
                      fill
                      sizes="56px"
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{user.name}</h3>
                      <span className="bg-categorico text-texInactivo px-2 py-0.5 rounded text-xs">
                        {user.type}
                      </span>
                    </div>
                    <p className="text-texInactivo text-sm">
                      {user.followers} seguidores • {user.games} juegos
                    </p>
                  </div>
                  <button
                    onClick={() => handleFollow(user.id)}
                    className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-subprimary transition"
                  >
                    Seguir
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiguiendoApp;
