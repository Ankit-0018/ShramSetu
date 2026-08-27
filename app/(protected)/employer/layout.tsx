import RoleGuard from "@/components/_shared/RoleGuard";
import { ReactNode } from "react";

export default async function EmployerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <RoleGuard role="EMPLOYER">{children}</RoleGuard>
    </>
  );
}
