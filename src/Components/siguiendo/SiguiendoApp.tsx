"use client";

import React, { useState } from "react";
import Image from "next/image";

const siguiendo = [
  { name: "CD Projekt Red", avatar: "/pic4.jpg", followers: "2.5M", games: 3, isFollowing: true, type: "Desarrollador" },
  { name: "FromSoftware", avatar: "/pic5.jpg", followers: "1.8M", games: 12, isFollowing: true, type: "Desarrollador" },
  { name: "Supergiant Games", avatar: "/pic6.jpg", followers: "850K", games: 4, isFollowing: true, type: "Desarrollador" },
  { name: "GamerPro123", avatar: "/pic4.jpg", followers: "125K", games: 0, isFollowing: true, type: "Usuario" },
  { name: "StreamerElite", avatar: "/pic5.jpg", followers: "500K", games: 0, isFollowing: true, type: "Usuario" },
  { name: "Riot Games", avatar: "/pic6.jpg", followers: "5.2M", games: 8, isFollowing: true, type: "Desarrollador" },
];

const sugerencias = [
  { name: "Naughty Dog", avatar: "/pic4.jpg", followers: "3.1M", games: 15, isFollowing: false, type: "Desarrollador" },
  { name: "Insomniac Games", avatar: "/pic5.jpg", followers: "1.2M", games: 20, isFollowing: false, type: "Desarrollador" },
];

const SiguiendoApp = () => {
  const [activeTab, setActiveTab] = useState<"siguiendo" | "sugerencias">("siguiendo");
  const [followingList, setFollowingList] = useState(siguiendo);
  const [suggestions, setSuggestions] = useState(sugerencias);

  const handleUnfollow = (name: string) => {
    setFollowingList(followingList.filter((u) => u.name !== name));
  };

  const handleFollow = (name: string) => {
    const userToFollow = suggestions.find((u) => u.name === name);
    if (userToFollow) {
      setFollowingList([...followingList, { ...userToFollow, isFollowing: true }]);
      setSuggestions(suggestions.filter((u) => u.name !== name));
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
        {activeTab === "siguiendo" ? (
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
                      src={user.avatar}
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
                      {user.followers} seguidores {user.games > 0 && `• ${user.games} juegos`}
                    </p>
                  </div>
                  <button
                    onClick={() => handleUnfollow(user.name)}
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
                      src={user.avatar}
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
                    onClick={() => handleFollow(user.name)}
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
