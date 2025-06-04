"use client";
import { Button } from "@/components/ui/button";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";

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
    <header>
      {isConnected ? (
        <Button onClick={logout}>{address?.toString().slice(0, 6)}...</Button>
      ) : (
        <Button onClick={login}>Connect</Button>
      )}
    </header>
  );
}
