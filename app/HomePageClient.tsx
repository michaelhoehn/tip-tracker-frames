"use client";

import { useState } from "react";

export default function HomePageClient() {
  const [username, setUsername] = useState("");
  const [tipAmount, setTipAmount] = useState<number | null>(null);
  const [error, setError] = useState("");

  const handleCheckTips = async () => {
    try {
      const response = await fetch("/api/frame", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action: "checkTips" }),
      });

      if (!response.ok) throw new Error("Request failed");

      const data = await response.json();
      const { fid, username, tipAmount } = data;

      setUsername(username);
      setTipAmount(tipAmount);
    } catch (error) {
      console.error("Error checking daily tips", error);
      setError("An error occurred while checking daily tips.");
    }
  };

  return (
    <div>
      <h1>Daily Tips Checker</h1>
      <button onClick={handleCheckTips}>Check Daily Tips</button>
      {error && <p>{error}</p>}
      {username && tipAmount !== null && (
        <div>
          <p>Username: {username}</p>
          <p>Daily Tip Amount: {tipAmount}</p>
        </div>
      )}
    </div>
  );
}
