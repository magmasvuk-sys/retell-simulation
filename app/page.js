"use client";

import { useState } from "react";
import { RetellWebClient } from "retell-client-js-sdk";

export default function Home() {
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCall() {
    setLoading(true);
    setStatus("Starting call...");

    try {
      const res = await fetch("/api/start-call", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || JSON.stringify(data));
      }

      const retellWebClient = new RetellWebClient();

      retellWebClient.on("call_started", () => {
        setStatus("Call started! Allow microphone access if prompted.");
      });

      retellWebClient.on("call_ended", () => {
        setStatus("Call ended.");
        setLoading(false);
      });

      retellWebClient.on("error", (error) => {
        console.error("Retell error:", error);
        setStatus("Error: " + (error?.message || "Unknown Retell error"));
        setLoading(false);
        retellWebClient.stopCall();
      });

      await retellWebClient.startCall({
        accessToken: data.access_token,
      });
    } catch (err) {
      console.error(err);
      setStatus("Error: " + err.message);
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        maxWidth: 700,
        margin: "60px auto",
        padding: 20,
        textAlign: "center",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <h1>Customer Service Simulation</h1>
      <p>Click below to start your exercise.</p>

      <button
        onClick={startCall}
        disabled={loading}
        style={{
          padding: "14px 24px",
          fontSize: 18,
          cursor: "pointer",
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      >
        {loading ? "Starting..." : "Start Simulation"}
      </button>

      <p style={{ marginTop: 20 }}>{status}</p>
    </main>
  );
}
