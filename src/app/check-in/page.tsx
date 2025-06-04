"use client";
import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

function formatTimeLeft(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
}

type CheckIn = {
  id: string;
  wallet_address: string;
  created_at: string;
};

export default function CheckIn() {
  const searchParams = useSearchParams();
  const address = searchParams.get("address")?.toLowerCase();
  const [checkIns, setCheckIns] = useState<CheckIn[]>([]);
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [canCheckIn, setCanCheckIn] = useState(false);

  const fetchCheckIns = useCallback(async () => {
    if (!address) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("check_ins")
      .select("*")
      .eq("wallet_address", address)
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to fetch check-ins");
    } else {
      setCheckIns(data || []);
      if (data && data.length > 0) {
        const last = new Date(data[0].created_at);
        const now = new Date();
        // 24 hours in milliseconds
        const diff = 0.1 * 60 * 60 * 1000 - (now.getTime() - last.getTime());
        setTimer(diff > 0 ? diff : 0);
        setCanCheckIn(diff <= 0);
      } else {
        setTimer(0);
        setCanCheckIn(true);
      }
    }
    setLoading(false);
  }, [address]);

  useEffect(() => {
    fetchCheckIns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address]);

  useEffect(() => {
    if (timer <= 0) {
      setCanCheckIn(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1000) {
          clearInterval(interval);
          setCanCheckIn(true);
          return 0;
        }
        return prev - 1000;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleCheckIn = async () => {
    if (!address) return;
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.from("check_ins").insert({
      wallet_address: address,
    });
    if (error) {
      toast.error("Check-in failed. Please try again.");
    } else {
      toast.success("Checked in successfully!");
      fetchCheckIns();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto mt-12 p-8 bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800 flex flex-col gap-8">
      <div className="flex flex-col items-center gap-4">
        <h1 className="text-2xl font-bold mb-2">Daily Check-In</h1>
        <p className="text-muted-foreground text-center mb-2">
          Check in every 24 hours to keep your status active. Your last check-in
          is recorded on-chain.
        </p>
        <Button
          onClick={handleCheckIn}
          disabled={!canCheckIn || loading || !address}
          className="w-48 text-lg"
        >
          {loading
            ? "Checking in..."
            : canCheckIn
            ? "Check In"
            : "Wait to Check In"}
        </Button>
        <div className="mt-2 text-center">
          {canCheckIn ? (
            <span className="text-green-600 font-medium">
              You can check in now!
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">
              Next check-in available in{" "}
              <span className="font-mono">{formatTimeLeft(timer)}</span>
            </span>
          )}
        </div>
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-2">Previous Check-Ins</h2>
        <div className="max-h-64 overflow-y-auto rounded-md border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/40 p-4">
          {checkIns.length === 0 ? (
            <div className="text-muted-foreground text-center">
              No check-ins yet.
            </div>
          ) : (
            <ul className="space-y-2">
              {checkIns.map((ci, idx) => (
                <li key={ci.id || idx} className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                  <span className="font-mono text-sm">
                    {new Date(ci.created_at).toLocaleString()}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
