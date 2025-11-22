"use client";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState, useTransition } from "react";
import { useAccount } from "../provider";
import { toast } from "sonner";
import { ethers } from "ethers";
import { ETH_RPC_ENDPOINT, SOL_RPC_ENDPOINT } from "@/lib/config";
import { Spinner } from "@/app/_components/Spinner";

export function Balance() {
  const { currentAccount, currentTab } = useAccount();
  const [balance, setBalance] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    async function getBalance() {
      const rpcUrl =
        currentTab === "solana" ? SOL_RPC_ENDPOINT : ETH_RPC_ENDPOINT;
      if (!rpcUrl) {
        throw new Error("RPC endpoint not found");
      }
      if (currentTab === "solana") {
        //fetch solana balance

        const connection = new Connection(rpcUrl);

        const solPublicKey = currentAccount?.solPublicKey;

        if (!solPublicKey) {
          toast.error("Could not find solana public key for current account");
          return;
        }

        const address = new PublicKey(solPublicKey);

        const lamportsBalance = await connection.getBalance(address);
        console.log(lamportsBalance);
        const solBalance = lamportsBalance / LAMPORTS_PER_SOL;
        console.log(solBalance);
        setBalance(solBalance);
      }
      if (currentTab === "ethereum") {
        if (!rpcUrl) {
          throw new Error("RPC endpoint not found");
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);

        const address = currentAccount?.ethPublicKey;

        if (!address) {
          toast.error("Could not find ethereum public key for current account");
          return;
        }

        const balanceWei = await provider.getBalance(address);
        console.log(balanceWei);
        const balanceEth = parseFloat(ethers.formatEther(balanceWei));
        console.log(balanceEth);
        setBalance(balanceEth);
      }
    }
    startTransition(() => {
      getBalance();
    });
  }, [currentAccount, currentTab]);

  if (isPending) {
    return (
      <div className="h-40">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center gap-2 text-3xl p-8 font-semibold">
      <div>{balance}</div>
      <div>{currentTab === "solana" ? "SOL" : "ETH"}</div>
    </div>
  );
}
