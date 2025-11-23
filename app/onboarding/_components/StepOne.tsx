import Image from "next/image";
import { Button } from "@/components/ui/button";
import { MouseEventHandler } from "react";

export default function StepOne({
  handleExistingWallet,
  handleCreateWallet,
}: {
  handleExistingWallet: MouseEventHandler<HTMLButtonElement> | undefined;
  handleCreateWallet: MouseEventHandler<HTMLButtonElement> | undefined;
}) {
  return (
    <div className="flex flex-col justify-between h-full py-8 items-center">
      <div className="flex flex-col items-center  justify-center gap-4">
        <div className="flex bg-card items-center justify-center rounded-full aspect-square p-4 w-20 h-20">
          <Image src="/wallet.png" alt="wallet-icon" width={32} height={32} />
        </div>
        <div className="text-2xl font-medium ">Welcome to Wallet</div>
        <div className="text-muted-foreground font-medium text-base">{`You'll use this wallet to send and receive crypto and NFTs`}</div>
      </div>
      <div className="flex flex-col gap-4">
        <Button
          onClick={handleCreateWallet}
          className="h-12 w-md text-base font-semibold hover:pointer"
        >
          Create a new wallet
        </Button>
        <Button
          onClick={handleExistingWallet}
          variant="secondary"
          className="h-12 w-md text-base font-semibold hover:pointer"
        >
          I already have a wallet
        </Button>
      </div>
    </div>
  );
}
