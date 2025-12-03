"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { getFollowing, unfollowUser, followUser } from "@/lib/api/social";
import type { FollowUser, PaginatedResponse } from "@/types/api";

const SiguiendoApp = () => {
  const [followingList, setFollowingList] = useState<FollowUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"siguiendo" | "sugerencias">("siguiendo");

  const fetchFollowing = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: PaginatedResponse<FollowUser> = await getFollowing();
      setFollowingList(response.results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la lista');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFollowing();
  }, [fetchFollowing]);

  const handleUnfollow = async (userId: number) => {
    try {
      await unfollowUser(userId);
      setFollowingList(prev => prev.filter((u) => u.id !== userId));
    } catch {
      // Error handling
    }
  };

  const handleFollow = async (userId: number) => {
    try {
      await followUser(userId);
      // Refresh the list after following
      await fetchFollowing();
    } catch {
      // Error handling
    }
  };

  const formatFollowers = (count?: number) => {
    if (!count) return "0";
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count.toString();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-texInactivo">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen text-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button 
            onClick={fetchFollowing}
            className="bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-subprimary transition"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

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
          Sugerencias
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
              followingList.map((user) => (
                <div
                  key={user.id}
                  className="bg-subdeep rounded-xl p-4 flex items-center gap-4 hover:bg-categorico transition"
                >
                  <div className="w-14 h-14 relative flex-shrink-0">
                    <Image
                      src={user.avatar || "/pic4.jpg"}
                      alt={user.username}
                      fill
                      className="object-cover rounded-full"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold truncate">{user.username}</h3>
                      {user.user_type && (
                        <span className="bg-categorico text-texInactivo px-2 py-0.5 rounded text-xs">
                          {user.user_type}
                        </span>
                      )}
                    </div>
                    <p className="text-texInactivo text-sm">
                      {formatFollowers(user.followers_count)} seguidores {user.games_count ? `• ${user.games_count} juegos` : ''}
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
            <div className="text-center py-10">
              <p className="text-texInactivo">Las sugerencias se cargarán pronto</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SiguiendoApp;
