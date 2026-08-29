"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Briefcase, ClipboardList, PlusCircle, User } from "lucide-react";

const navItems = [
  { label: "Home", href: "/employer/home", icon: Home },
  { label: "Jobs", href: "/employer/my-jobs", icon: Briefcase },
  { label: "Post", href: "/employer/post-job", icon: PlusCircle },
  { label: "Active", href: "/employer/assignments", icon: ClipboardList },
  { label: "Profile", href: "/employer/profile", icon: User },
];

/** Horizontal nav links shown inline in the header on tablet/desktop. */
export function EmployerNavLinks() {
  const pathname = usePathname();
  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <div className="hidden md:flex md:items-center md:gap-1">
      {navItems.map((item) => {
        const Icon = item.icon;
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
              active
                ? "bg-success-muted text-primary"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground"
            }`}
          >
            <Icon className="size-4" strokeWidth={active ? 2.5 : 2} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

/** Fixed bottom tab bar — mobile/tablet only, hidden on desktop where EmployerNavLinks takes over. */
export function EmployerNav() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav className="bottom-nav employer-nav md:hidden">
      <div className="bottom-nav-content">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`bottom-nav-item ${active ? "active" : ""}`}
              aria-current={active ? "page" : undefined}
            >
              <Icon
                className="bottom-nav-icon"
                strokeWidth={active ? 2.5 : 2}
              />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
