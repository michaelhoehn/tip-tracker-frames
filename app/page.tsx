import { appURL } from "../utils";
import type { Metadata } from "next";
import { fetchMetadata } from "frames.js/next";
import dynamic from "next/dynamic";

// Dynamically import the client-side component
const HomePageClient = dynamic(() => import("./HomePageClient"), {
  ssr: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const baseURL = appURL(); // Use the correct base URL
  return {
    title: "Degen Tip Jar",
    other: {
      ...(await fetchMetadata(new URL("/api/frame", baseURL))),
    },
  };
}

export default function HomePage() {
  return <HomePageClient />;
}
