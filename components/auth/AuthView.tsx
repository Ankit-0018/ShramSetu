"use client";

import Link from "next/link";
import { AuthMode } from "@/lib/types";
import AuthHeader from "./AuthHeader";
import AuthForm from "./AuthForm";

export default function AuthView({ mode }: { mode: AuthMode }) {
  const isRegister = mode === "REGISTER";

  return (
    <div className="min-h-screen bg-background sm:flex sm:items-center sm:justify-center sm:bg-secondary sm:p-4">
      <div className="mx-auto w-full max-w-sm overflow-hidden sm:rounded-3xl sm:shadow-lg">
        <AuthHeader mode={mode} />

        <div className="bg-background px-6 py-8">
          <AuthForm mode={mode} />

          <div className="mt-6 text-center text-sm">
            {isRegister ? (
              <p className="text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/auth?mode=login"
                  className="font-semibold text-primary hover:underline"
                >
                  Login
                </Link>
              </p>
            ) : (
              <p className="text-muted-foreground">
                New here?{" "}
                <Link
                  href="/auth?mode=register"
                  className="font-semibold text-primary hover:underline"
                >
                  Create an account
                </Link>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
