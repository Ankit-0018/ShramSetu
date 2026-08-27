"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import "@/styles/worker.css";
import { getWorkerDashboard } from "@/lib/queries/dashboard";
import { WorkingStatus, WorkerDashboardData } from "@/lib/types";
import WorkerHomeUI from "@/components/worker/workerHomeUI";
import Spinner from "@/components/_shared/spinner";

export default function WorkerHome() {
  const { user } = useUserStore.getState();
  // Availability is pure client-side UI state; the backend has no
  // persistence for it, so we just keep it in local state.
  const [workStatus, setWorkStatusState] = useState<WorkingStatus>("available");
  const [data, setData] = useState<WorkerDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  if (!user) return null;

  const handleStatusChange = (newStatus: WorkingStatus) => {
    setWorkStatusState(newStatus);
  };

  useEffect(() => {
    const loadDashboard = async () => {
      setLoading(true);
      try {
        const res = await getWorkerDashboard();
        setData(res);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user]);

  if (loading) return <Spinner />;

  return (
    <WorkerHomeUI data={data} workStatus={workStatus} onStatusChange={handleStatusChange} />
  );
}
