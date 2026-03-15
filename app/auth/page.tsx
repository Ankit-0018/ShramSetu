"use client"
import { useSearchParams } from "next/navigation";
import AuthView from "@/components/auth/AuthView";
import { AuthMode } from "@/lib/types";

export default function AuthPage() {
  const searchParams = useSearchParams();
  const mode: AuthMode =
    searchParams.get("mode") === "register" ? "REGISTER" : "LOGIN";

  return <AuthView mode={mode} />;
}
