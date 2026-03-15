"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { WorkerNav } from "@/components/navigation/WorkerNav";
import "@/styles/worker.css";
import {
  Calendar,
  DollarSign,
  TrendingUp,
  Wallet,
  Loader2,
} from "lucide-react";
import { useUserStore } from "@/lib/stores/useUserStore";
import { getMyAssignedJobs } from "@/lib/queries/assignments";
import { Assignment } from "@/lib/types";
import Spinner from "@/components/_shared/spinner";

export default function WorkerEarningsPage() {
  const [selectedPeriod, setSelectedPeriod] = useState<
    "week" | "month" | "year"
  >("week");
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const { user } = useUserStore();

  useEffect(() => {
    const fetchData = async () => {
      if (!user?.uid) return;
      try {
        setLoading(true);
        const data = await getMyAssignedJobs(user.uid);
        setAssignments(data);
      } catch (error) {
        console.error("Error fetching earnings data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user?.uid]);

  if (loading) {
    return (
      <Spinner />
    );
  }

  const completedAssignments = assignments.filter(
    (a) => a.status === "completed",
  );
  const activeAssignments = assignments.filter((a) => a.status === "active");

  // Calculate earnings from completed assignments
  const now = new Date();
  const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(todayStart);
  weekStart.setDate(weekStart.getDate() - 7);
  const monthStart = new Date(todayStart);
  monthStart.setMonth(monthStart.getMonth() - 1);

  const calcEarnings = (since: Date) =>
    completedAssignments
      .filter((a) => a.completedAt && new Date(a.completedAt) >= since)
      .reduce((sum, a) => sum + (a.wage ?? 0), 0);

  const totalEarnings = completedAssignments.reduce(
    (s, a) => s + (a.wage ?? 0),
    0,
  );

  const earnings = {
    today: calcEarnings(todayStart),
    thisWeek: calcEarnings(weekStart),
    thisMonth: calcEarnings(monthStart),
    total: totalEarnings,
    pending: activeAssignments.reduce((s, a) => s + (a.wage ?? 0), 0),
  };

  const getDisplayAmount = () => {
    switch (selectedPeriod) {
      case "week":
        return earnings.thisWeek;
      case "month":
        return earnings.thisMonth;
      case "year":
        return earnings.total;
      default:
        return 0;
    }
  };

  // Build weekly chart data
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weeklyData = days.map((day, idx) => {
    const dayDate = new Date(weekStart);
    dayDate.setDate(dayDate.getDate() + idx);
    const dayStart = new Date(
      dayDate.getFullYear(),
      dayDate.getMonth(),
      dayDate.getDate(),
    );
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const amount = completedAssignments
      .filter(
        (a) =>
          a.completedAt &&
          new Date(a.completedAt) >= dayStart &&
          new Date(a.completedAt) < dayEnd,
      )
      .reduce((s, a) => s + (a.wage ?? 0), 0);

    return { day, amount };
  });

  const maxAmount = Math.max(...weeklyData.map((d) => d.amount), 1);

  // Recent transactions from completed assignments
  const transactions = completedAssignments.slice(0, 10).map((a) => ({
    id: a.id,
    date: a.completedAt ? new Date(a.completedAt).toLocaleDateString() : "N/A",
    description: a.jobTitle || "Completed Job",
    amount: a.wage ?? 0,
    status: a.status,
  }));

  return (
    <div className="worker-container">
      <div className="worker-layout">
        {/* Header */}
        <div className="worker-header">
          <div className="worker-header-content">
            <h1 className="worker-header-title">Earnings</h1>
          </div>
        </div>

        {/* Scroll Content */}
        <div className="px-4 py-6 space-y-6">
          {/* Period Selection */}
          <div className="flex gap-2 bg-card rounded-lg p-1">
            {(["week", "month", "year"] as const).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`flex-1 py-2 rounded-md text-sm font-medium transition ${
                  selectedPeriod === period
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>

          {/* Main Earnings Card */}
          <div className="bg-card text-primary rounded-lg p-6">
            <div className="flex items-center gap-2 mb-2">
              <Wallet className="w-5 h-5" />
              <span className="text-sm opacity-90">This {selectedPeriod}</span>
            </div>
            <p className="text-4xl font-bold mb-4">
              ₹{getDisplayAmount().toLocaleString()}
            </p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <TrendingUp className="w-4 h-4" />
                <span>Total: ₹{earnings.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-xs">Today</span>
              </div>
              <p className="text-xl font-bold text-primary">
                ₹{earnings.today.toLocaleString()}
              </p>
            </div>
            <div className="bg-card rounded-lg p-4 shadow-sm">
              <div className="flex items-center gap-2 text-muted-foreground mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">Pending</span>
              </div>
              <p className="text-xl font-bold text-amber-600">
                ₹{earnings.pending.toLocaleString()}
              </p>
            </div>
          </div>

          {/* Weekly Chart */}
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Weekly Overview</h3>
            <div className="flex items-end justify-between gap-2 h-32">
              {weeklyData.map((day) => (
                <div
                  key={day.day}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div
                    className="w-full bg-primary rounded-t transition-all duration-300"
                    style={{
                      height: `${maxAmount > 0 ? (day.amount / maxAmount) * 100 : 0}%`,
                      minHeight: day.amount > 0 ? "4px" : "0",
                    }}
                  />
                  <span className="text-xs text-muted-foreground">
                    {day.day}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-card rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold mb-4">Recent Transactions</h3>
            {transactions.length > 0 ? (
              <div className="space-y-3">
                {transactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between py-2 border-b border-border last:border-0"
                  >
                    <div>
                      <p className="font-medium text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.date}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-primary">
                        +₹{transaction.amount}
                      </p>
                      <p className="text-xs text-green-600">
                        {transaction.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-8">
                No transactions yet
              </p>
            )}
          </div>

          {/* Withdraw Button */}
          <Button className="w-full bg-primary hover:bg-primary/90 py-6">
            Withdraw Earnings
          </Button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <WorkerNav />
    </div>
  );
}
