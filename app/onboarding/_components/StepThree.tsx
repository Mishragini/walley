"use client";
import { MouseEventHandler, useCallback, useEffect } from "react";
import { useOnboarding } from "../provider";
import { Button } from "@/components/ui/button";
import { generateMnemonic } from "bip39";
import Mnemonic from "./Mnemonic";
import { Copy } from "lucide-react";
import { toast } from "sonner";

export default function StepThree({
  handleClick,
}: {
  handleClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  const { hasWallet, mnemonicPhrase, setMnemonicPhrase } = useOnboarding();

  const updateMnemonic = useCallback(
    (mnemonicLength: number) => {
      const newMnemonic = hasWallet
        ? Array<string>(mnemonicLength).fill("")
        : generateMnemonic(mnemonicLength === 12 ? 128 : 256).split(" ");

      setMnemonicPhrase(newMnemonic);
    },
    [hasWallet, setMnemonicPhrase]
  );

  useEffect(() => {
    updateMnemonic(12);
  }, [updateMnemonic]);

  const isImportDisabled = mnemonicPhrase.some((word: string) => !word.trim());

  return (
    <div className="h-full flex flex-col items-center justify-between">
      <div className="flex flex-col gap-8 items-center p-6">
        <div className="flex flex-col items-center">
          <div className="text-2xl font-medium ">Secret Recovery Phrase </div>
          <p className="text-[#969FAF] font-medium text-base">
            {hasWallet
              ? "Enter or paste your phrase"
              : "Backup this phrase securely."}
          </p>
        </div>

        <div className="flex items-center gap-4">
          {mnemonicPhrase.length === 12 ? (
            <Button
              className="w-[200px] h-12 text-base hover:cursor-pointer"
              onClick={() => {
                updateMnemonic(24);
              }}
            >
              Use 24 words
            </Button>
          ) : (
            <Button
              className="w-[200px] h-12 text-base hover:cursor-pointer"
              onClick={() => {
                updateMnemonic(12);
              }}
            >
              Use 12 words
            </Button>
          )}
          {hasWallet ? (
            <Button
              onClick={async () => {
                if (!navigator.clipboard || !navigator.clipboard.readText) {
                  toast.error(
                    "Your browser does not support the Clipboard API or readText."
                  );
                  return;
                }
                const phraseString = await navigator.clipboard.readText();
                const mnemonicArr = phraseString.split(" ");
                setMnemonicPhrase(mnemonicArr);
              }}
              className="w-[200px] h-12  hover:bg-blue-700/40 bg-blue-700/20 text-blue-500 text-base hover:cursor-pointer "
            >
              <Copy /> Paste
            </Button>
          ) : (
            <Button
              onClick={async () => {
                if (!navigator.clipboard || !navigator.clipboard.readText) {
                  toast.error(
                    "Your browser does not support the Clipboard API or readText."
                  );
                  return;
                }
                const copyPhrase = mnemonicPhrase.join(" ");
                await navigator.clipboard.writeText(copyPhrase);
              }}
              className="w-[200px] h-12  hover:bg-blue-700/40 bg-blue-700/20 text-blue-500 text-base hover:cursor-pointer "
            >
              <Copy /> Copy
            </Button>
          )}
        </div>
        <Mnemonic
          mnemonicPhrase={mnemonicPhrase}
          setUserMnemonic={setMnemonicPhrase}
        />
      </div>

      <Button
        onClick={handleClick}
        variant="secondary"
        className="h-12 w-md text-base font-semibold hover:pointer"
        disabled={isImportDisabled}
      >
        {hasWallet ? `Import` : "Generate"} Wallet
      </Button>
    </div>
  );
}
