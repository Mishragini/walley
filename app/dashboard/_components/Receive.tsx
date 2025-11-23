"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useAccount } from "../provider";
import { QrWithLogo } from "./QrWithLogo";
import { Copy } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";

export function Receive() {
  const { currentTab, currentAccount } = useAccount();
  const publicKey = useMemo(() => {
    return currentTab === "solana"
      ? currentAccount?.solPublicKey
      : currentAccount?.ethPublicKey;
  }, [currentTab, currentAccount]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg" className="w-20">
          Receive
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background flex flex-col  items-center justify-center gap-10">
        <DialogHeader>
          <DialogTitle>
            <div className="flex flex-col  items-center justify-center text-2xl font-medium">
              Account {currentAccount?.accountIndex}/{" "}
              {currentTab.charAt(0).toUpperCase() + currentTab.slice(1)}
            </div>
            <p className="text-muted-foreground font-medium text-base">
              Scan the QR code or copy the address
            </p>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col  items-center justify-center gap-4">
          <QrWithLogo />
          <div className="flex items-center bg-primary-foreground py-2 px-4 rounded-md">
            {publicKey}
            <Button
              variant="ghost"
              onClick={async () => {
                if (!publicKey) return;
                await navigator.clipboard.writeText(publicKey);
                toast.success("Address copied successfully");
              }}
              size="lg"
              className="p-0 dark:hover:bg-transparent"
            >
              <Copy className="text-blue-500" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
