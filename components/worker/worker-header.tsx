"use client";

import { LanguageToggle } from "../_shared/language-toggle";
import Image from "next/image";
import Logo from "@/public/logo.png";

type Props = {
  title?: string;
  home?: boolean;
};

export function WorkerHeader({ title, home }: Props) {
  return (
    <div className="worker-header">
      <div className="worker-header-content flex items-center justify-between">
        {/* Left side */}
        <div className="flex items-center gap-3">
          <Image src={Logo} alt="Shram Setu" priority className="h-10 w-auto" />
          {title && <h1 className="worker-header-title">{title}</h1>}
        </div>

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
