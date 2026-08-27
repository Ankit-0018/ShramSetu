import RoleGuard from "@/components/_shared/RoleGuard";
import "@/styles/worker.css";
import { ReactNode } from "react";

export default async function WorkerLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <RoleGuard role="WORKER">{children}</RoleGuard>
    </>
  );
}
