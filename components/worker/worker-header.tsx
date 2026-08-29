"use client";

import { LanguageToggle } from "../_shared/language-toggle";
import Image from "next/image";
import Logo from "@/public/logo-icon.png";
import { WorkerNavLinks } from "../navigation/WorkerNav";

type Props = {
  title?: string;
  home?: boolean;
};

export function WorkerHeader({ title, home }: Props) {
  return (
    <div className="worker-header">
      <div className="worker-header-content flex items-center justify-between gap-4">
        {/* Left side */}
        <div className="flex items-center gap-2 shrink-0">
          <Image src={Logo} alt="ApnaKaam" priority className="h-8 w-8 shrink-0" />
          <h1 className="text-lg font-bold text-foreground">
            {title || "ApnaKaam"}
          </h1>
        </div>

        {/* Desktop/tablet nav links */}
        <WorkerNavLinks />

        {/* Right side */}
        {home && (
          <div className="worker-header-actions">
            <LanguageToggle />
          </div>
        )}
      </div>
    </div>
  );
}
