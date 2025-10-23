import React, { useState } from "react";
import axios from "axios";

export default function ShortenForm({ onCreated }) {
  const [url, setUrl] = useState("");
  const [short, setShort] = useState(null);
  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

  async function submit(e) {
    e.preventDefault();
    setShort(null);
    try {
      const res = await axios.post(`${API_BASE}/api/shorten`, { url });
      setShort(res.data.shortUrl);
      setUrl("");
      if (onCreated) onCreated();
    } catch (err) {
      console.error(err);
      alert("Error creating short URL");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="bg-[#363535] p-6 rounded-xl shadow-lg  text-white"
    >
      <label className="block mb-3 font-medium text-gray-200">Enter URL</label>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          className="flex-1 bg-[#1e1e1e] text-white placeholder-gray-400 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com/very/long/url"
          required
        />
        <button
          className="px-5 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          type="submit"
        >
          Shorten
        </button>
      </div>

      {short && (
        <div className="mt-4 p-3 bg-[#1e1e1e] rounded-lg ">
          <div className="text-sm text-gray-400 mb-1">Short URL:</div>
          <a
            className="text-blue-400 hover:underline break-all"
            href={short}
            target="_blank"
            rel="noreferrer"
          >
            {short}
          </a>
        </div>
      )}
    </form>
  );
}
