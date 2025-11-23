"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MouseEventHandler, useCallback } from "react";
import { useOnboarding } from "../provider";

export default function StepTwo({
  handleClick,
}: {
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const { hasWallet, selectedNetworks, setSelectedNetworks } = useOnboarding();

  const selectNetwork = useCallback(
    (network: string) => {
      if (selectedNetworks.includes(network)) {
        const networks = selectedNetworks.filter(
          (selectedNetwork) => selectedNetwork !== network
        );
        setSelectedNetworks(networks);
      } else {
        if (hasWallet) {
          setSelectedNetworks([network]);
        } else {
          setSelectedNetworks([...selectedNetworks, network]);
        }
      }
    },
    [hasWallet, selectedNetworks, setSelectedNetworks]
  );

  const baseButtonClasses =
    "flex justify-start items-center gap-4 px-4 py-2 w-[200px] h-10 text-lg font-medium hover:pointer";

  const getNetworkButtonClasses = useCallback(
    (network: string) =>
      selectedNetworks.includes(network)
        ? `${baseButtonClasses} border border-blue-300 bg-blue-500`
        : baseButtonClasses,
    [selectedNetworks]
  );

  return (
    <div className="flex flex-col h-full pt-10 gap-10">
      <div className="flex flex-col items-center gap-2">
        <div className="text-2xl font-medium ">Select one or more networks</div>
        <div>You can always change this later.</div>
      </div>
      <div className="flex flex-col h-full justify-between py-8">
        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
          <Button
            variant="secondary"
            onClick={() => selectNetwork("solana")}
            className={getNetworkButtonClasses("solana")}
          >
            <Image src="/solana.png" alt="solana icon" width={32} height={32} />
            Solana
          </Button>

          <Button
            variant="secondary"
            onClick={() => selectNetwork("ethereum")}
            className={getNetworkButtonClasses("ethereum")}
          >
            <Image
              src="/ethereum.png"
              alt="ethereum icon"
              width={32}
              height={32}
            />
            Ethereum
          </Button>
          {/* 
          <Button
            onClick={() => selectNetwork("bitcoin")}
            className={getNetworkButtonClasses("bitcoin")}
          >
            <Image
              src="/bitcoin.png"
              alt="bitcoin icon"
              width={32}
              height={32}
            />
            Bitcoin
          </Button> */}
        </div>
        <div>
          <Button
            disabled={selectedNetworks.length === 0}
            onClick={handleClick}
            className="h-12 w-md text-base font-semibold"
          >
            {selectedNetworks.length === 0
              ? hasWallet
                ? "Select a network"
                : "Select networks"
              : "Generate Wallet"}
          </Button>
        </div>
      </div>
    </div>
  );
}
