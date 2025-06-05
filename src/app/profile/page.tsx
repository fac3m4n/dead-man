"use client";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import {
  IExecDataProtector,
  IExecDataProtectorCore,
} from "@iexec/dataprotector";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Copy, ExternalLink, Eye } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleString();
}

function multiaddrToIpfsGateway(multiaddr: string) {
  // Extract CID from multiaddr (assumes /p2p/<CID>)
  const match = multiaddr.match(/\/p2p\/(.+)/);
  if (!match) return null;
  const cid = match[1];
  return `https://ipfs.iex.ec/ipfs/${cid}`;
}

function shorten(str: string, chars = 6) {
  return str.length > chars * 2
    ? `${str.slice(0, chars)}...${str.slice(-chars)}`
    : str;
}

export default function Profile() {
  const { isConnected, connector, address } = useAccount();
  const [dataProtectorCore, setDataProtectorCore] =
    useState<IExecDataProtectorCore | null>(null);
  const [protectedDataList, setProtectedDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [canReveal, setCanReveal] = useState(false);

  useEffect(() => {
    const initializeDataProtector = async () => {
      if (isConnected && connector) {
        const provider = await connector.getProvider();
        const dataProtector = new IExecDataProtector(provider as any, {
          iexecOptions: { smsURL: "https://sms.labs.iex.ec/" },
        });
        setDataProtectorCore(dataProtector.core);
      }
    };
    initializeDataProtector();
  }, [isConnected, connector]);

  useEffect(() => {
    const fetchProtectedData = async () => {
      if (dataProtectorCore && address) {
        setLoading(true);
        try {
          const protectedData = await dataProtectorCore.getProtectedData({
            owner: address,
            requiredSchema: {
              article: "string",
              revealMethod: "string",
              revealToken: "string",
            },
          });
          setProtectedDataList(protectedData);
        } catch (err) {
          toast.error("Failed to fetch protected data.");
        }
        setLoading(false);
      }
    };
    fetchProtectedData();
  }, [dataProtectorCore, address]);

  // Fetch last check-in
  useEffect(() => {
    const fetchLastCheckIn = async () => {
      if (!address) return;
      const supabase = createClient();
      const { data, error } = await supabase
        .from("check_ins")
        .select("created_at")
        .eq("wallet_address", address.toLowerCase())
        .order("created_at", { ascending: false })
        .limit(1);
      if (!error && data && data.length > 0) {
        const lastCheckInDate = new Date(data[0].created_at);
        const now = new Date();
        const diff = now.getTime() - lastCheckInDate.getTime();
        setCanReveal(diff > 7 * 24 * 60 * 60 * 1000);
      } else {
        // No check-ins, allow reveal
        setCanReveal(true);
      }
    };
    fetchLastCheckIn();
  }, [address]);

  const revealData = async (protectedData: string) => {
    setLoading(true);
    if (dataProtectorCore) {
      try {
        const revealedData = await dataProtectorCore.processProtectedData({
          protectedData,
          workerpool: "tdx-labs.pools.iexec.eth",
          app: "0x1919ceb0c6e60f3B497936308B58F9a6aDf071eC",
        });
        toast.success("Your data has been revealed!");
        console.log("Revealed Data:", revealedData);
      } catch (err) {
        toast.error("Error revealing data. Please try again.");
        console.error("Error revealing data:", err);
      }
    } else {
      toast.error("Wallet not connected or DataProtector not initialized.");
    }
    setLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white/80 dark:bg-zinc-900/80 rounded-xl shadow-lg border border-zinc-200 dark:border-zinc-800">
      <h1 className="text-2xl font-bold mb-6 text-center">
        Your Protected Data
      </h1>
      {loading ? (
        <div className="text-center">Loading...</div>
      ) : protectedDataList.length === 0 ? (
        <div className="text-center text-muted-foreground">
          No protected data found.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {protectedDataList.map((item) => {
            const ipfsLink = multiaddrToIpfsGateway(item.multiaddr);
            console.log(item.schema.article);
            return (
              <Card key={item.address}>
                <CardHeader className="flex flex-row items-start justify-between">
                  <div>
                    <CardTitle>{item.name}</CardTitle>
                  </div>
                  <div className="flex gap-1">
                    {item.schema && Object.keys(item.schema).length > 0 ? (
                      Object.entries(item.schema).map(([key]) => (
                        <Badge
                          key={key}
                          variant="default"
                          className="capitalize"
                        >
                          {key}
                        </Badge>
                      ))
                    ) : (
                      <Badge variant="outline">Unknown</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground">
                    Created: {formatDate(item.creationTimestamp)}
                  </div>
                  <div className="mb-2 flex items-center gap-2">
                    <span className="font-semibold">Address:</span>{" "}
                    <span className="font-mono">{shorten(item.address)}</span>
                    <span>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          navigator.clipboard.writeText(item.address);
                          toast.success("Address copied!");
                        }}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  {ipfsLink && (
                    <Button
                      size="sm"
                      asChild
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      <a
                        href={ipfsLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <ExternalLink className="w-4 h-4" /> IPFS
                      </a>
                    </Button>
                  )}
                  <span>
                    <Button
                      size="sm"
                      className="flex items-center gap-1 cursor-pointer"
                      onClick={() => canReveal && revealData(item.address)}
                      disabled={!canReveal}
                    >
                      <Eye className="w-4 h-4" /> Reveal
                    </Button>
                    {!canReveal && (
                      <div className="text-xs text-muted-foreground mt-1">
                        You can only reveal if you did not check in for 7 days.
                      </div>
                    )}
                  </span>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
