import { AuthMode } from "@/lib/types";
import Image from "next/image";
import Logo from "@/public/logo-icon.png";

export default function AuthHeader({ mode }: { mode: AuthMode }) {
  return (
    <div className="flex flex-col items-center bg-accent px-6 pt-10 pb-8 text-center">
      <Image src={Logo} alt="ApnaKaam" priority className="h-16 w-auto" />

      <p className="mt-4 text-2xl font-extrabold tracking-tight">
        <span className="text-foreground">Apna</span>
        <span className="text-primary">Kaam</span>
      </p>
      <p className="mt-1 text-[11px] font-semibold tracking-[0.2em] text-muted-foreground">
        WORK · PEOPLE · OPPORTUNITIES
      </p>

      <h1 className="mt-6 text-xl font-bold text-foreground">
        {mode === "REGISTER" ? "Create an account" : "Log in"}
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {mode === "REGISTER"
          ? "Enter your mobile number to get started."
          : "Enter your mobile number to continue."}
      </p>
    </div>
  );
}
