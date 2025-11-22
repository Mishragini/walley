"use client";
import { useAccount } from "../provider";
import { Button } from "@/components/ui/button";

export function NetworkTabs() {
  const { currentTab, setCurrentTab } = useAccount();
  return (
    <div className="grid grid-cols-2 w-md py-4">
      <Button
        variant={currentTab === "solana" ? "secondary" : "default"}
        className="rounded-r-none border border-accent/10 disabled:bg-background disabled:opacity-100"
        onClick={() => {
          setCurrentTab("solana");
        }}
        disabled={currentTab === "solana"}
      >
        Solana
      </Button>
      <Button
        variant={currentTab === "ethereum" ? "secondary" : "default"}
        className="rounded-l-none border border-accent/10 disabled:opacity-100"
        onClick={() => {
          setCurrentTab("ethereum");
        }}
        disabled={currentTab === "ethereum"}
      >
        Ethereum
      </Button>
    </div>
  );
}
