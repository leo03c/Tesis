"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import followService, { UserProfile } from "@/services/followService";
import Loading from "@/Components/loading/Loading";

const pic4 = "/pic4.jpg"; // imagen por defecto

const SiguiendoApp: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"siguiendo" | "sugerencias">("siguiendo");
  const [followingList, setFollowingList] = useState<UserProfile[]>([]);
  const [suggestions, setSuggestions] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Construye el nombre completo
  const getFullName = (user: UserProfile) => {
    if (user.first_name && user.last_name) {
      return `${user.first_name} ${user.last_name}`.trim();
    }
    return user.username || user.name || "Usuario";
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [followingRes, suggestionsRes] = await Promise.all([
          followService.getFollowing(),
          followService.getSuggestions()
        ]);

        // ---- Mapear Siguiendo ----
        const followingFlattened: UserProfile[] = (followingRes.results || []).map(f => {
          const u = f.user || f;
          return {
            id: u.id,
            username: u.username,
            first_name: u.first_name,
            last_name: u.last_name,
            name: getFullName(u),
            avatar: u.avatar || pic4,
            type: u.type || "Usuario",
            followers: u.followers_count ?? 0,
            games: u.games_count ?? 0,
            is_following: true
          };
        });

        // ---- Mapear Sugerencias ----
        const suggestionsFlattened: UserProfile[] = (suggestionsRes.results || []).map(u => ({
          id: u.id,
          username: u.username,
          first_name: u.first_name,
          last_name: u.last_name,
          name: getFullName(u),
          avatar: u.avatar || pic4,
          type: u.type || "Usuario",
          followers: u.followers_count ?? 0,
          games: u.games_count ?? 0,
          is_following: false
        }));

        setFollowingList(followingFlattened);
        setSuggestions(suggestionsFlattened);
        setError(null);
      } catch (err) {
        console.error("Error cargando sugerencias:", err);
        setError("Error cargando sugerencias");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleUnfollow = (id: number) => {
    const user = followingList.find(u => u.id === id);
    if (!user) return;
    setFollowingList(followingList.filter(u => u.id !== id));
    setSuggestions(prev => [...prev, { ...user, is_following: false }]);
  };

  const handleFollow = (id: number) => {
    const user = suggestions.find(u => u.id === id);
    if (!user) return;
    setFollowingList([...followingList, { ...user, is_following: true }]);
    setSuggestions(suggestions.filter(u => u.id !== id));
  };

  const renderUserCard = (user: UserProfile, followingTab: boolean) => (
    <div key={user.id} className="bg-subdeep rounded-xl p-4 flex items-center gap-4 hover:bg-categorico transition">
      <div className="w-14 h-14 relative flex-shrink-0">
        <Image
          src={user.avatar || pic4}
          alt={user.name || "Avatar del usuario"}
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
      </div>
      {followingTab ? (
        <button
          onClick={() => handleUnfollow(user.id)}
          className="bg-subdeep border border-primary text-primary px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary hover:text-white transition"
        >
          Siguiendo
        </button>
      ) : (
        <button
          onClick={() => handleFollow(user.id)}
          className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-subprimary transition"
        >
          Seguir
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen text-white">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Siguiendo</h1>
        <p className="text-texInactivo">Desarrolladores y usuarios que sigues</p>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("siguiendo")}
          className={`px-6 py-3 rounded-xl font-medium transition ${
            activeTab === "siguiendo" ? "bg-primary text-white" : "bg-subdeep text-texInactivo hover:text-white"
          }`}
        >
          Siguiendo ({followingList.length})
        </button>
        <button
          onClick={() => setActiveTab("sugerencias")}
          className={`px-6 py-3 rounded-xl font-medium transition ${
            activeTab === "sugerencias" ? "bg-primary text-white" : "bg-subdeep text-texInactivo hover:text-white"
          }`}
        >
          Sugerencias ({suggestions.length})
        </button>
      </div>

      <div className="rounded-3xl bg-deep py-10 px-6">
        {loading ? (
          <Loading message="Cargando..." />
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-texInactivo mb-2">{error}</p>
          </div>
        ) : activeTab === "siguiendo" ? (
          followingList.length === 0 ? (
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
            <div className="space-y-4">
              {followingList.map(user => renderUserCard(user, true))}
            </div>
          )
        ) : suggestions.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-texInactivo">No hay más sugerencias por ahora</p>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map(user => renderUserCard(user, false))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SiguiendoApp;
