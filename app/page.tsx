import { appURL } from "../utils";
import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Daily Tips Checker",
    other: {
      ...(await fetchMetadata(new URL("/api/frame", appURL()))),
    },
  };
}

export default function HomePage() {
  return (
    <div>
      <h1>Daily Tips Checker</h1>
      <button
        onClick={async () => {
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
            console.log(data);
          } catch (error) {
            console.error("Error checking daily tips", error);
          }
        }}
      >
        Check Daily Tips
      </button>
    </div>
  );
}
