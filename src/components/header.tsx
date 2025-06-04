"use client";
import { Button } from "@/components/ui/button";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import {
  ShieldCheck,
  CheckCircle,
  Skull,
  Wallet,
  User,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

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
      <Link href="/" className="flex items-center gap-2">
        <Skull className="text-red-600" size={28} />
        <span className="font-bold text-lg tracking-tight">
          Dead Man&apos;s NFT
        </span>
      </Link>
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
          href={`/check-in?address=${address?.toLowerCase()}`}
          className="flex items-center gap-1 text-gray-700 hover:text-blue-600 transition-colors"
        >
          <CheckCircle size={20} />
          <span>Check-in</span>
        </Link>
      </nav>
      {/* Wallet Dropdown */}
      <div>
        {isConnected ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Wallet className="text-blue-600" size={18} />
                <span>{address?.toString().slice(0, 6)}...</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  href={`/profile?address=${address?.toLowerCase()}`}
                  className="flex items-center gap-2"
                >
                  <User size={16} /> Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={logout}
                variant="destructive"
                className="flex items-center gap-2"
              >
                <LogOut size={16} /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button onClick={login} variant="default">
            Connect
          </Button>
        )}
      </div>
    </header>
  );
}
