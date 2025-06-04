"use client";
import { Button } from "@/components/ui/button";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { ShieldCheck, CheckCircle, Skull } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { open } = useAppKit();
  const { disconnectAsync } = useDisconnect();
  const { address, isConnected } = useAccount();

  const login = () => {
    open({ view: "Connect" });
  };

  const logout = async () => {
    try {
      await disconnectAsync();
    } catch (err) {
      console.error("Failed to logout:", err);
    }
  };

  return (
    <header className="w-full flex items-center justify-between px-6 py-3 bg-white shadow-md">
      {/* Logo/Title */}
      <div className="flex items-center gap-2">
        <Skull className="text-red-600" size={28} />
        <span className="font-bold text-lg tracking-tight">
          Dead Man&apos;s NFT
        </span>
      </div>
      {/* Navigation */}
      <nav className="flex items-center gap-6">
        <Link
          href="/protect"
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <ShieldCheck size={20} />
          <span>Protect</span>
        </Link>
        <Link
          href="/check-in"
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <CheckCircle size={20} />
          <span>Check-in</span>
        </Link>
      </nav>
      {/* Wallet Button */}
      <div>
        {isConnected ? (
          <Button onClick={logout} variant="outline">
            {address?.toString().slice(0, 6)}...
          </Button>
        ) : (
          <Button onClick={login} variant="default">
            Connect
          </Button>
        )}
      </div>
    </header>
  );
}
