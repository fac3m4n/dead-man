"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  IExecDataProtector,
  IExecDataProtectorCore,
} from "@iexec/dataprotector";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { BsTelegram, BsTwitterX } from "react-icons/bs";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export default function Protect() {
  const { isConnected, connector } = useAccount();

  const [dataProtectorCore, setDataProtectorCore] =
    useState<IExecDataProtectorCore | null>(null);
  const [name, setName] = useState("");
  const [dataToProtect, setDataToProtect] = useState("");
  const [revealMethod, setRevealMethod] = useState("");
  const [revealToken, setRevealToken] = useState("");
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
          name,
          data: {
            article: dataToProtect,
            revealMethod,
            revealToken,
          },
        });
        toast.success("Your data has been protected!");
        setDataToProtect("");
        setRevealMethod("");
        setRevealToken("");
        setName("");
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
          <label htmlFor="name" className="block mb-2 font-medium">
            Name
          </label>
          <input
            id="name"
            type="text"
            className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
            placeholder="Enter a name for your protected data"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label htmlFor="revealMethod" className="block mb-2 font-medium">
            Reveal Method
          </label>
          <Select value={revealMethod} onValueChange={setRevealMethod}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a method" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="x">
                <BsTwitterX /> Twitter / X
              </SelectItem>
              <SelectItem value="telegram">
                <BsTelegram />
                Telegram
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
        {revealMethod && (
          <div>
            <label htmlFor="revealToken" className="block mb-2 font-medium">
              {revealMethod === "x"
                ? "X Bot Token"
                : revealMethod === "telegram"
                ? "Telegram Bot Token"
                : "Token"}
            </label>
            <input
              id="revealToken"
              type="text"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] outline-none"
              placeholder={
                revealMethod === "x"
                  ? "Enter your X bot token"
                  : revealMethod === "telegram"
                  ? "Enter your Telegram bot token"
                  : "Enter token"
              }
              value={revealToken}
              onChange={(e) => setRevealToken(e.target.value)}
              required
            />
          </div>
        )}
        <Button
          type="submit"
          disabled={
            !isConnected ||
            loading ||
            !dataToProtect ||
            !revealMethod ||
            !revealToken
          }
          className="w-full"
        >
          {loading ? "Protecting..." : "Protect Data"}
        </Button>
      </form>
    </div>
  );
}
