"use client";

import React, { useState, useCallback } from "react";

// API Base URL configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

// Endpoint configuration
interface Endpoint {
  name: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  description: string;
  requiresAuth: boolean;
  sampleBody?: Record<string, string | number | boolean>;
}

// List of all endpoints to test
const endpoints: Endpoint[] = [
  // Authentication endpoints
  {
    name: "Login",
    method: "POST",
    path: "/api/login/",
    description: "Authenticate user and get token",
    requiresAuth: false,
    sampleBody: {
      username: "testuser",
      password: "testpassword",
    },
  },
  {
    name: "Register",
    method: "POST",
    path: "/api/register/",
    description: "Register a new user account",
    requiresAuth: false,
    sampleBody: {
      name: "Tesst User",
      email: "tesst@example.com",
      username: "tesstuser",
      password: "tesstpassword",
    },
  },
  // User endpoints
  {
    name: "Get Current User",
    method: "GET",
    path: "/api/users/1",
    description: "Get current authenticated user info",
    requiresAuth: true,
  },
  {
    name: "Update User Profile",
    method: "PUT",
    path: "/api/user/profile/",
    description: "Update user profile information",
    requiresAuth: true,
    sampleBody: {
      name: "Updated Name",
      email: "updated@example.com",
    },
  },
  // Games endpoints
  {
    name: "List Games",
    method: "GET",
    path: "/api/games/",
    description: "Get list of all available games",
    requiresAuth: false,
  },
  {
    name: "Get Game Details",
    method: "GET",
    path: "/api/games/1/",
    description: "Get details for a specific game",
    requiresAuth: false,
  },
  {
    name: "Search Games",
    method: "GET",
    path: "/api/games/search/?q=test",
    description: "Search for games by query",
    requiresAuth: false,
  },
  // Library endpoints
  {
    name: "Get User Library",
    method: "GET",
    path: "/api/library/",
    description: "Get user's game library",
    requiresAuth: true,
  },
  {
    name: "Add to Library",
    method: "POST",
    path: "/api/library/",
    description: "Add a game to user library",
    requiresAuth: true,
    sampleBody: {
      game_id: 1,
    },
  },
  // Catalog endpoints
  {
    name: "Get User Catalog",
    method: "GET",
    path: "/api/catalog/",
    description: "Get user's catalog/projects",
    requiresAuth: true,
  },
  {
    name: "Create Catalog Item",
    method: "POST",
    path: "/api/catalog/",
    description: "Create a new catalog item",
    requiresAuth: true,
    sampleBody: {
      title: "New Project",
      description: "Project description",
      status: "borrador",
    },
  },
  // Favorites endpoints
  {
    name: "Get Favorites",
    method: "GET",
    path: "/api/favorites/",
    description: "Get user's favorite games",
    requiresAuth: true,
  },
  {
    name: "Add to Favorites",
    method: "POST",
    path: "/api/favorites/",
    description: "Add game to favorites",
    requiresAuth: true,
    sampleBody: {
      game_id: 1,
    },
  },
  {
    name: "Remove from Favorites",
    method: "DELETE",
    path: "/api/favorites/1/",
    description: "Remove game from favorites",
    requiresAuth: true,
  },
  // Following endpoints
  {
    name: "Get Following",
    method: "GET",
    path: "/api/following/",
    description: "Get users being followed",
    requiresAuth: true,
  },
  {
    name: "Follow User",
    method: "POST",
    path: "/api/following/",
    description: "Follow another user",
    requiresAuth: true,
    sampleBody: {
      user_id: 1,
    },
  },
  // News endpoints
  {
    name: "Get News",
    method: "GET",
    path: "/api/news/",
    description: "Get latest news articles",
    requiresAuth: false,
  },
  {
    name: "Get News Article",
    method: "GET",
    path: "/api/news/1/",
    description: "Get specific news article",
    requiresAuth: false,
  },
  // Categories endpoints
  {
    name: "Get Categories",
    method: "GET",
    path: "/api/categories/",
    description: "Get all game categories",
    requiresAuth: false,
  },
  // Store endpoints
  {
    name: "Get Store Items",
    method: "GET",
    path: "/api/store/",
    description: "Get store/shop items",
    requiresAuth: false,
  },
  {
    name: "Get Featured Games",
    method: "GET",
    path: "/api/store/featured/",
    description: "Get featured store items",
    requiresAuth: false,
  },
  {
    name: "Get Free Games",
    method: "GET",
    path: "/api/store/free/",
    description: "Get free games",
    requiresAuth: false,
  },
];

// Result type for endpoint tests
interface EndpointResult {
  endpoint: Endpoint;
  status: "pending" | "loading" | "success" | "error";
  statusCode?: number;
  responseTime?: number;
  response?: unknown;
  error?: string;
}

const EndpointTester: React.FC = () => {
  const [results, setResults] = useState<EndpointResult[]>(
    endpoints.map((endpoint) => ({
      endpoint,
      status: "pending",
    }))
  );
  const [authToken, setAuthToken] = useState<string>("");
  const [isTestingAll, setIsTestingAll] = useState(false);
  const [expandedResult, setExpandedResult] = useState<number | null>(null);
  const [customBody, setCustomBody] = useState<string>("");
  const [selectedEndpoint, setSelectedEndpoint] = useState<number | null>(null);

  // Test a single endpoint
  const testEndpoint = useCallback(
    async (index: number, customBodyJson?: string): Promise<EndpointResult> => {
      const endpoint = endpoints[index];
      const startTime = performance.now();

      setResults((prev) =>
        prev.map((r, i) =>
          i === index ? { ...r, status: "loading" as const } : r
        )
      );

      try {
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (endpoint.requiresAuth && authToken) {
          headers["Authorization"] = `Token ${authToken}`;
        }

        const requestBody =
          customBodyJson ||
          (endpoint.sampleBody ? JSON.stringify(endpoint.sampleBody) : undefined);

        const response = await fetch(`${API_BASE_URL}${endpoint.path}`, {
          method: endpoint.method,
          headers,
          body:
            endpoint.method !== "GET" && endpoint.method !== "DELETE"
              ? requestBody
              : undefined,
        });

        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        let responseData: unknown;
        const contentType = response.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          responseData = await response.json();
        } else {
          responseData = await response.text();
        }

        const result: EndpointResult = {
          endpoint,
          status: response.ok ? "success" : "error",
          statusCode: response.status,
          responseTime,
          response: responseData,
          error: response.ok ? undefined : `HTTP ${response.status}`,
        };

        setResults((prev) => prev.map((r, i) => (i === index ? result : r)));
        return result;
      } catch (err) {
        const endTime = performance.now();
        const responseTime = Math.round(endTime - startTime);

        const result: EndpointResult = {
          endpoint,
          status: "error",
          responseTime,
          error: err instanceof Error ? err.message : "Unknown error",
        };

        setResults((prev) => prev.map((r, i) => (i === index ? result : r)));
        return result;
      }
    },
    [authToken]
  );

  // Test all endpoints
  const testAllEndpoints = async () => {
    setIsTestingAll(true);
    for (let i = 0; i < endpoints.length; i++) {
      await testEndpoint(i);
      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 200));
    }
    setIsTestingAll(false);
  };

  // Reset all results
  const resetResults = () => {
    setResults(
      endpoints.map((endpoint) => ({
        endpoint,
        status: "pending",
      }))
    );
    setExpandedResult(null);
  };

  // Get status color
  const getStatusColor = (status: EndpointResult["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-600";
      case "error":
        return "bg-red-600";
      case "loading":
        return "bg-yellow-600";
      default:
        return "bg-gray-600";
    }
  };

  // Get method color
  const getMethodColor = (method: string) => {
    switch (method) {
      case "GET":
        return "bg-blue-600";
      case "POST":
        return "bg-green-600";
      case "PUT":
        return "bg-yellow-600";
      case "DELETE":
        return "bg-red-600";
      case "PATCH":
        return "bg-purple-600";
      default:
        return "bg-gray-600";
    }
  };

  // Render sample body helper
  const renderSampleBody = (sampleBody: Endpoint["sampleBody"]) => {
    if (!sampleBody) return null;
    return (
      <div className="mb-3">
        <div className="text-sm font-semibold mb-1">Sample Body:</div>
        <pre className="bg-dark p-3 rounded-lg text-xs overflow-x-auto">
          {JSON.stringify(sampleBody, null, 2)}
        </pre>
      </div>
    );
  };

  // Render response helper
  const renderResponse = (response: unknown) => {
    if (!response) return null;
    return (
      <div>
        <div className="text-sm font-semibold mb-1">Response:</div>
        <pre className="bg-dark p-3 rounded-lg text-xs overflow-x-auto max-h-64">
          {typeof response === "string"
            ? response
            : JSON.stringify(response, null, 2)}
        </pre>
      </div>
    );
  };

  // Count results by status
  const successCount = results.filter((r) => r.status === "success").length;
  const errorCount = results.filter((r) => r.status === "error").length;
  const pendingCount = results.filter((r) => r.status === "pending").length;

  return (
    <div className="min-h-screen text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">🔌 Endpoint Tester</h1>
        <p className="text-texInactivo">
          Test all API endpoints to verify backend connectivity
        </p>
        <p className="text-sm text-texInactivo mt-1">
          Base URL: <code className="bg-subdeep px-2 py-1 rounded">{API_BASE_URL}</code>
        </p>
      </div>

      {/* Auth Token Input */}
      <div className="mb-6 bg-deep rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">🔐 Authentication</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter auth token for protected endpoints"
            value={authToken}
            onChange={(e) => setAuthToken(e.target.value)}
            className="flex-1 px-4 py-3 rounded-xl bg-subdeep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            onClick={() => setAuthToken("")}
            className="px-6 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
          >
            Clear Token
          </button>
        </div>
        <p className="text-xs text-texInactivo mt-2">
          Get a token by testing the Login endpoint first, then copy the token from the response.
        </p>
      </div>

      {/* Control Buttons */}
      <div className="mb-6 flex flex-wrap gap-4">
        <button
          onClick={testAllEndpoints}
          disabled={isTestingAll}
          className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-subprimary transition disabled:opacity-50"
        >
          {isTestingAll ? "⏳ Testing..." : "🚀 Test All Endpoints"}
        </button>
        <button
          onClick={resetResults}
          className="px-6 py-3 rounded-xl bg-subdeep text-white font-semibold hover:bg-categorico transition"
        >
          🔄 Reset All
        </button>
      </div>

      {/* Summary Stats */}
      <div className="mb-6 grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-deep rounded-xl p-4 text-center">
          <div className="text-2xl font-bold">{endpoints.length}</div>
          <div className="text-texInactivo text-sm">Total</div>
        </div>
        <div className="bg-green-900/30 rounded-xl p-4 text-center border border-green-600/30">
          <div className="text-2xl font-bold text-green-400">{successCount}</div>
          <div className="text-green-400/70 text-sm">Success</div>
        </div>
        <div className="bg-red-900/30 rounded-xl p-4 text-center border border-red-600/30">
          <div className="text-2xl font-bold text-red-400">{errorCount}</div>
          <div className="text-red-400/70 text-sm">Errors</div>
        </div>
        <div className="bg-gray-900/30 rounded-xl p-4 text-center border border-gray-600/30">
          <div className="text-2xl font-bold text-gray-400">{pendingCount}</div>
          <div className="text-gray-400/70 text-sm">Pending</div>
        </div>
      </div>

      {/* Endpoints List */}
      <div className="bg-deep rounded-2xl p-6">
        <h2 className="text-xl font-semibold mb-4">📋 Endpoints ({endpoints.length})</h2>
        <div className="space-y-3">
          {results.map((result, index) => (
            <div key={index} className="bg-subdeep rounded-xl overflow-hidden">
              {/* Endpoint Header */}
              <div
                className="p-4 cursor-pointer hover:bg-categorico transition flex flex-col sm:flex-row sm:items-center gap-3"
                onClick={() =>
                  setExpandedResult(expandedResult === index ? null : index)
                }
              >
                {/* Method badge */}
                <span
                  className={`${getMethodColor(result.endpoint.method)} px-3 py-1 rounded-lg text-xs font-bold w-fit`}
                >
                  {result.endpoint.method}
                </span>

                {/* Path and name */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold">{result.endpoint.name}</div>
                  <code className="text-sm text-texInactivo truncate block">
                    {result.endpoint.path}
                  </code>
                </div>

                {/* Auth badge */}
                {result.endpoint.requiresAuth && (
                  <span className="bg-yellow-600/20 text-yellow-400 px-2 py-1 rounded text-xs">
                    🔒 Auth
                  </span>
                )}

                {/* Status badge */}
                <span
                  className={`${getStatusColor(result.status)} px-3 py-1 rounded-lg text-xs font-semibold`}
                >
                  {result.status === "loading"
                    ? "Testing..."
                    : result.status === "success"
                      ? `✓ ${result.statusCode}`
                      : result.status === "error"
                        ? `✗ ${result.statusCode || "Error"}`
                        : "Pending"}
                </span>

                {/* Response time */}
                {result.responseTime !== undefined && (
                  <span className="text-texInactivo text-sm">
                    {result.responseTime}ms
                  </span>
                )}

                {/* Test button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedEndpoint(index);
                    setCustomBody(
                      result.endpoint.sampleBody
                        ? JSON.stringify(result.endpoint.sampleBody, null, 2)
                        : ""
                    );
                  }}
                  className="px-4 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-subprimary transition"
                >
                  Test
                </button>
              </div>

              {/* Expanded details */}
              {expandedResult === index && (
                <div className="border-t border-categorico p-4 bg-dark/30">
                  <p className="text-texInactivo text-sm mb-3">
                    {result.endpoint.description}
                  </p>

                  {/* Sample body */}
                  {renderSampleBody(result.endpoint.sampleBody)}

                  {/* Response */}
                  {renderResponse(result.response)}

                  {/* Error */}
                  {result.error && !result.response && (
                    <div>
                      <div className="text-sm font-semibold mb-1 text-red-400">
                        Error:
                      </div>
                      <pre className="bg-red-900/20 border border-red-600/30 p-3 rounded-lg text-xs text-red-400">
                        {result.error}
                      </pre>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Custom Test Modal */}
      {selectedEndpoint !== null && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-deep rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-xl font-bold mb-4">
              Test: {endpoints[selectedEndpoint].name}
            </h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm font-semibold mb-1">Endpoint:</div>
                <code className="bg-subdeep px-3 py-2 rounded-lg block">
                  {endpoints[selectedEndpoint].method}{" "}
                  {API_BASE_URL}
                  {endpoints[selectedEndpoint].path}
                </code>
              </div>

              {endpoints[selectedEndpoint].method !== "GET" &&
                endpoints[selectedEndpoint].method !== "DELETE" && (
                  <div>
                    <div className="text-sm font-semibold mb-1">
                      Request Body (JSON):
                    </div>
                    <textarea
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                      className="w-full h-40 px-4 py-3 rounded-xl bg-subdeep text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary font-mono text-sm"
                      placeholder='{"key": "value"}'
                    />
                  </div>
                )}

              <div className="flex gap-4">
                <button
                  onClick={async () => {
                    await testEndpoint(selectedEndpoint, customBody || undefined);
                    setExpandedResult(selectedEndpoint);
                    setSelectedEndpoint(null);
                  }}
                  className="flex-1 px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-subprimary transition"
                >
                  🚀 Send Request
                </button>
                <button
                  onClick={() => setSelectedEndpoint(null)}
                  className="px-6 py-3 rounded-xl bg-subdeep text-white font-semibold hover:bg-categorico transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EndpointTester;
