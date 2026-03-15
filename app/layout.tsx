import type React from "react";
import type { Metadata } from "next";
import "../styles/globals.css";
import "leaflet/dist/leaflet.css";
import { getCurrentUser } from "@/lib/utils/auth";
import UserHydrator from "@/providers/userHydrator";
import AuthProvider from "@/providers/AuthProvider";

export const metadata: Metadata = {
  title: "LabourHub - Hire Trusted Labour Workers",
  description:
    "Connect with trusted labour workers in your area. Plumbers, electricians, carpenters, and more.",
  generator: "v0.app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getCurrentUser();
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans antialiased`} suppressHydrationWarning>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
