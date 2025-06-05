"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  IExecDataProtector,
  IExecDataProtectorCore,
} from "@iexec/dataprotector";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function Protect() {
  const { isConnected, connector, address } = useAccount();

  const [dataProtectorCore, setDataProtectorCore] =
    useState<IExecDataProtectorCore | null>(null);
  const [dataToProtect, setDataToProtect] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const initializeDataProtector = async () => {
      if (isConnected && connector) {
        const provider = await connector.getProvider();
        const dataProtector = new IExecDataProtector(provider as any, {
          iexecOptions: {
            smsURL: "https://sms.labs.iex.ec/",
          },
        });
        setDataProtectorCore(dataProtector.core);
      }
    };
    initializeDataProtector();
  }, [isConnected, connector]);

  const protectData = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    if (dataProtectorCore) {
      try {
        const protectedData = await dataProtectorCore.protectData({
          data: {
            article: dataToProtect,
          },
        });
        toast.success("Your data has been protected!");
        setDataToProtect("");
        console.log("Protected Data:", protectedData);
      } catch (err) {
        toast.error("Error protecting data. Please try again.");
        console.error("Error protecting data:", err);
      }
    } else {
      toast.error("Wallet not connected or DataProtector not initialized.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-12 p-8 bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
      <h1 className="text-2xl font-bold mb-4 text-center">
        Protect Your Sensitive Data
      </h1>
      <p className="mb-6 text-muted-foreground text-center">
        Enter the information you want to protect. It will be encrypted and only
        revealed if something happens to you.
      </p>
      <form onSubmit={protectData} className="space-y-6">
        <div>
          <label htmlFor="dataToProtect" className="block mb-2 font-medium">
            Sensitive Information
          </label>
          <textarea
            id="dataToProtect"
            className="w-full min-h-[120px] rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            placeholder="Type your secret here..."
            value={dataToProtect}
            onChange={(e) => setDataToProtect(e.target.value)}
            required
          />
        </div>
        <Button
          type="submit"
          disabled={!isConnected || loading || !dataToProtect}
          className="w-full"
        >
          {loading ? "Protecting..." : "Protect Data"}
        </Button>
      </form>
    </div>
  );
}
