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
import { Copy, ExternalLink, Share2 } from "lucide-react";

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

export default function Profile() {
  const { isConnected, connector, address } = useAccount();
  const [dataProtectorCore, setDataProtectorCore] =
    useState<IExecDataProtectorCore | null>(null);
  const [protectedDataList, setProtectedDataList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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
            requiredSchema: { article: "string" },
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
                    <div className="text-xs text-muted-foreground">
                      Created: {formatDate(item.creationTimestamp)}
                    </div>
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
                  <div className="mb-2">
                    <span className="font-semibold">Address:</span>{" "}
                    <span
                      className="font-mono truncate block max-w-full overflow-hidden"
                      style={{ wordBreak: "break-all" }}
                    >
                      {item.address}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="flex gap-2">
                  {item.address && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          navigator.clipboard.writeText(item.address);
                          toast.success("Address copied!");
                        }}
                        className="flex items-center gap-1 cursor-pointer"
                      >
                        <Copy className="w-4 h-4" /> Copy Address
                      </Button>
                    </>
                  )}
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
                  <Button
                    size="sm"
                    variant="secondary"
                    className="flex items-center gap-1"
                  >
                    <Share2 className="w-4 h-4" /> Share
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
