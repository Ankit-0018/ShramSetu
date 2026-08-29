"use client";

import { LanguageToggle } from "../_shared/language-toggle";
import Image from "next/image";
import Logo from "@/public/logo-icon.png";

type Props = {
  title?: string;
  home?: boolean;
};

export function WorkerHeader({ title, home }: Props) {
  return (
    <div className="worker-header">
      <div className="worker-header-content">
        {/* Left side */}
        <div className="flex items-center gap-2 min-w-0">
          <Image src={Logo} alt="ApnaKaam" priority className="h-8 w-8 shrink-0" />
          <h1 className="text-lg font-bold text-foreground truncate">
            {title || "ApnaKaam"}
          </h1>
        </div>

        {/* Right side */}
        {home && (
          <div className="worker-header-actions shrink-0">
            <LanguageToggle />
          </div>
        )}
      </div>
    </div>
  );
}
