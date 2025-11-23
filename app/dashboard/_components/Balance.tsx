"use client";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useEffect, useState, useTransition } from "react";
import { useAccount } from "../provider";
import { ethers } from "ethers";
import { ETH_RPC_ENDPOINT, SOL_RPC_ENDPOINT } from "@/lib/config";
import { Spinner } from "@/app/_components/Spinner";
import { AddAccount } from "@/app/_components/AddAccount";
import { Network } from "@/lib/type";

export function Balance({ network }: { network: Network }) {
  const { currentAccount } = useAccount();
  const [balance, setBalance] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();
  const [showAddAccount, setShowAddAccount] = useState(false);
  useEffect(() => {
    async function getBalance() {
      const rpcUrl = network === "solana" ? SOL_RPC_ENDPOINT : ETH_RPC_ENDPOINT;
      if (!rpcUrl) {
        throw new Error("RPC endpoint not found");
      }
      if (network === "solana") {
        //fetch solana balance

        const connection = new Connection(rpcUrl);

        const solPublicKey = currentAccount?.solPublicKey;

        if (!solPublicKey) {
          setShowAddAccount(true);
          return;
        }

        // Reset showAddAccount if public key exists
        setShowAddAccount(false);

        const address = new PublicKey(solPublicKey);

        const lamportsBalance = await connection.getBalance(address);
        const solBalance = lamportsBalance / LAMPORTS_PER_SOL;
        setBalance(solBalance);
      }
      if (network === "ethereum") {
        if (!rpcUrl) {
          throw new Error("RPC endpoint not found");
        }

        const provider = new ethers.JsonRpcProvider(rpcUrl);

        const address = currentAccount?.ethPublicKey;

        if (!address) {
          setShowAddAccount(true);
          return;
        }

        setShowAddAccount(false);

        const balanceWei = await provider.getBalance(address);
        const balanceEth = parseFloat(ethers.formatEther(balanceWei));
        setBalance(balanceEth);
      }
    }
    startTransition(() => {
      getBalance();
    });
  }, [currentAccount, network]);

  if (isPending) {
    return (
      <div className="h-40">
        <Spinner />
      </div>
    );
  }

  if (showAddAccount) {
    return (
      <div className="flex items-center justify-center p-8">
        <AddAccount networks={[network]} current={true} />
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center gap-2 text-3xl p-8 font-semibold">
      <div>{balance}</div>
      <div>{network === "solana" ? "SOL" : "ETH"}</div>
    </div>
  );
}
