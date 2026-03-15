"use client";

import Link from "next/link";
import { AuthMode } from "@/lib/types";
import AuthHeader from "./AuthHeader";
import AuthForm from "./AuthForm";

export default function AuthView({ mode }: { mode: AuthMode }) {
  const isRegister = mode === "REGISTER";

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-3xl p-8 shadow-lg min-h-130">
          <AuthHeader mode={mode} />

          <AuthForm mode={mode} />

          {/* Toggle Link */}
          <div className="text-center mt-6 text-sm">
            {isRegister ? (
              <p>
                Already have an account?{" "}
                <Link
                  href="/auth?mode=login"
                  className="text-blue-500 font-semibold hover:underline"
                >
                  Login
                </Link>
              </p>
            ) : (
              <p>
                Don’t have an account?{" "}
                <Link
                  href="/auth?mode=register"
                  className="text-blue-500 font-semibold hover:underline"
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
