import type React from "react";
import type { Metadata } from "next";
import "../styles/globals.css";
import "leaflet/dist/leaflet.css";
import AuthProvider from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: "ApnaKaam - Work · People · Opportunities",
  description:
    "Connect with trusted labour workers in your area. Plumbers, electricians, carpenters, and more.",
  generator: "v0.app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
