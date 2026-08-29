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

/** Horizontal nav links shown inline in the header on tablet/desktop. */
export function WorkerNavLinks() {
  const pathname = usePathname();
  const { t } = useLanguage();
  const isActive = (path: string) => pathname === path;

  return (
    <div className="hidden md:flex md:items-center md:gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-success-muted text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="size-4" strokeWidth={active ? 2.5 : 2} />
            {t(item.labelKey)}
          </Link>
        );
      })}
    </div>
  );
}

/** Fixed bottom tab bar — mobile/tablet only, hidden on desktop where WorkerNavLinks takes over. */
export function WorkerNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bottom-nav md:hidden">
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
