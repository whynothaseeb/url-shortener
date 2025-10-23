import React, { useState, useEffect } from "react";
import ShortenForm from "./components/ShortenForm";
import axios from "axios";

export default function App() {
  const [recent, setRecent] = useState([]);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  async function fetchRecent() {
    try {
      const res = await axios.get(`${API_BASE}/api/urls`);
      setRecent(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function deleteUrl(id) {
    try {
      await axios.delete(`${API_BASE}/api/urls/${id}`);
      setRecent((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete URL");
    }
  }

  useEffect(() => {
    fetchRecent();
  }, []);

  return (
    <div className="flex h-screen bg-[#121212] text-white relative overflow-hidden">
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-[#1e1e1e] transform transition-transform duration-300 z-20 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="p-4 flex justify-between items-center ">
          <h2 className="text-lg font-semibold">Recent Links</h2>
          <button
            className="text-white text-2xl font-bold"
            onClick={() => setSidebarOpen(false)}
            title="Hide sidebar"
          >
            ☰
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="overflow-y-auto p-4 h-[calc(100%-120px)]">
          {recent.length === 0 ? (
            <p className="text-sm text-gray-400">No recent links yet.</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((r) => (
                <li key={r.id} className="p-2 bg-[#2a2a2a] rounded-lg">
                  <div className="flex justify-between items-center">
                    <a
                      className="text-blue-400 hover:underline break-all"
                      href={`${API_BASE}/r/${r.id}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {(import.meta.env.VITE_FRONTEND_BASE ||
                        "http://localhost:5173") + `/r/${r.id}`}
                    </a>
                    <button
                      className="text-red-400 hover:text-red-500 ml-2 text-sm"
                      onClick={() => deleteUrl(r.id)}
                      title="Delete link"
                    >
                      ✕
                    </button>
                  </div>
                  <div className="text-xs text-gray-500 mt-1 break-all">
                    {r.original_url}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {r.clicks} clicks
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Sticky Refresh Button */}
        <div className="absolute bottom-4 left-0 w-full px-4">
          <button
            onClick={fetchRecent}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg shadow"
          >
            Refresh
          </button>
        </div>
      </div>

      {/* Floating ☰ Button (only when sidebar hidden) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] text-white text-2xl px-3 py-2 rounded-lg z-30 shadow-lg transition-all duration-200"
          title="Show sidebar"
        >
          ☰
        </button>
      )}

      {/* Main Content */}
      <div
        className={`flex-1 flex items-center justify-center transition-all duration-300 ${
          sidebarOpen ? "md:ml-64" : "ml-0"
        }`}
      >
        <main className="w-full flex justify-center items-center p-4">
          <div className="bg-[#2f2f2f] p-8 rounded-xl shadow-lg w-full max-w-xl text-center">
            <header className="mb-6">
              <h1 className="text-3xl font-bold mb-2">URL Shortener</h1>
            </header>
            <ShortenForm onCreated={fetchRecent} />
          </div>
        </main>
      </div>
    </div>
  );
}
