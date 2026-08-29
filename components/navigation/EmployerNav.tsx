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

/** Fixed bottom tab bar — the single navigation surface at every breakpoint. */
export function EmployerNav() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(`${path}/`);

  return (
    <nav className="bottom-nav employer-nav">
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
