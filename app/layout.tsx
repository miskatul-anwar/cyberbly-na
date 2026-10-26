import type { Metadata, Viewport } from "next";
import "./globals.css";
import "vis-network/styles/vis-network.css";
import Navbar from "@/components/Navbar";
import BottomDock from "@/components/BottomDock";

export const metadata: Metadata = {
  title: {
    default: "Supplementary Visualization Viewer",
    template: "%s | Supplementary Visualization Viewer"
  },
  description:
    "Anonymous review-only supplementary website for accessing interactive HTML visualizations.",
  robots: {
    index: false,
    follow: false
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
  themeColor: "#f8fafc"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        {children}
        <BottomDock />
      </body>
    </html>
  );
}
