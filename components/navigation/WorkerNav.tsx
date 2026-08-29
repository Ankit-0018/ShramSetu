"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Wallet, User, Briefcase } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const navItems = [
  { labelKey: "Home", href: "/worker/home", icon: Home },
  { labelKey: "Search", href: "/worker/search", icon: Search },
  { labelKey: "Applications", href: "/worker/applications", icon: Briefcase },
  { labelKey: "Earnings", href: "/worker/earnings", icon: Wallet },
  { labelKey: "Profile", href: "/worker/profile", icon: User },
];

/** Fixed bottom tab bar — the single navigation surface at every breakpoint. */
export function WorkerNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-content">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item ${isActive(item.href) ? "active" : ""}`}
            >
              <Icon className="bottom-nav-icon" strokeWidth={isActive(item.href) ? 2.5 : 2} />
              <span className="text-xs font-medium">{t(item.labelKey)}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
