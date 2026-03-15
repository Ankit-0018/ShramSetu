"use client";
import { useEffect, useState } from "react";
import { useUserStore } from "@/lib/stores/useUserStore";
import "@/styles/worker.css";
import { getWorkerDashboard } from "@/lib/queries/dashboard";
import { updateWorkerAvailability } from "@/lib/actions/worker";
import { WorkingStatus, WorkerDashboardData } from "@/lib/types";
import WorkerHomeUI from "@/components/worker/workerHomeUI";
import Spinner from "@/components/_shared/spinner";

export default function WorkerHome() {
  const { user, location} = useUserStore.getState();
  const [workStatus, setWorkStatusState] = useState<WorkingStatus>("available");
  const [data, setData] = useState<WorkerDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true)

  if (!user) return null;

  const handleStatusChange = async (newStatus: WorkingStatus) => {
    setWorkStatusState(newStatus);
    try {
      await updateWorkerAvailability(user.uid, newStatus);
    } catch (error) {
      alert("Failed to change availability");
    }
  };

  useEffect(() => {
    if (!user?.uid || !location?.lat || !location?.lng) return;

    const loadDashboard = async () => {
      setLoading(true);
      try {
        const res = await getWorkerDashboard(
          user.uid,
          location.lat,
          location.lng,
          location.city ?? "",
        );
        setData(res);
      } catch (error) {
        console.error("Error loading dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, [user, location]);

if(loading) <Spinner />

  return (
  <WorkerHomeUI data={data} workStatus={workStatus} onStatusChange={handleStatusChange}  />
  );
}
