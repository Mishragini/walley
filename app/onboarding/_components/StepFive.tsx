"use client";

import { useOnboarding } from "../provider";
import * as bip39 from "bip39";
import { addAccount } from "@/app/actions/wallet";
import { useEffect, useRef } from "react";
import { db } from "@/lib/indexedDb";
import { toast } from "sonner";
import { getUser } from "@/app/actions/getUser";
import { useRouter } from "next/navigation";

export default function StepFive() {
  const { selectedNetworks, mnemonicPhrase } = useOnboarding();
  const walletGenerated = useRef(false);
  const router = useRouter();

  useEffect(() => {
    if (walletGenerated.current) return;
    walletGenerated.current = true;

    async function generateWallet() {
      try {
        const seed = bip39.mnemonicToSeedSync(mnemonicPhrase.join(" "));
        const base64Seed = Buffer.from(seed).toString("base64");
        const { userId } = await getUser();
        await db.seeds.put({ id: userId, value: base64Seed });

        const response = await addAccount(base64Seed, selectedNetworks, 1);
        if (response?.error) {
          toast.error(response?.error);
        } else {
          toast.success(response.success);
          router.push("/dashboard");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Error while generating the wallet";
        toast.error(errorMessage);
      }
    }

    generateWallet();
  }, [mnemonicPhrase, selectedNetworks, router]);

  return (
    <div className="h-screen flex items-center justify-center relative w-full">
      <div className="absolute w-[300px] h-[300px] rounded-full border-4 border-blue-500 border-t-transparent animate-spin top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="text-lg font-medium">Setting up your wallet</div>
    </div>
  );
}
