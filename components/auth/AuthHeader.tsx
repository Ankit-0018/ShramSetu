import { AuthMode } from "@/lib/types";
import Image from "next/image";
import Logo from "@/public/logo.png";

export default function AuthHeader({ mode }: { mode: AuthMode }) {
  return (
    <div className="text-center mb-8 flex flex-col items-center">
      
      <Image
        src={Logo}
        alt="Shram Setu"
        priority
        className="h-16 w-auto"
      />

      <p className="text-sm text-gray-500 mt-3">
        {mode === "REGISTER" ? "Register" : "Login"}
      </p>

    </div>
  );
}