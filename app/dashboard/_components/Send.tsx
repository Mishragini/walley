"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useAccount } from "../provider";
import { useForm } from "react-hook-form";
import { sendMoneyInputs, sendMoneySchema } from "@/app/validations";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { generateEthWallet, generateSolanaWallet } from "@/lib/wallet";
import { db } from "@/lib/indexedDb";
import { getUser } from "@/app/actions/getUser";
import {
  Connection,
  LAMPORTS_PER_SOL,
  PublicKey,
  sendAndConfirmTransaction,
  SystemProgram,
  Transaction,
} from "@solana/web3.js";
import { JsonRpcProvider, parseEther, Wallet } from "ethers";
import { ETH_RPC_ENDPOINT, SOL_RPC_ENDPOINT } from "@/lib/config";

export function Send() {
  const { currentAccount, currentTab } = useAccount();
  const [sendingMoney, setSendingMoney] = useState(false);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<sendMoneyInputs>({
    resolver: zodResolver(sendMoneySchema),
    defaultValues: {
      amount: 0,
      address: "",
    },
  });

  const sendMoney = useCallback(
    async (values: sendMoneyInputs) => {
      setSendingMoney(true);
      try {
        const accountIndex = currentAccount?.accountIndex;

        if (!accountIndex) {
          throw new Error("Could not find the current account's index");
        }

        const { userId } = await getUser();

        const seed = await db.seeds.get({ id: userId });

        if (!seed) {
          throw new Error("Seed not found in indexed db");
        }

        const seedBuffer = Buffer.from(seed.value, "base64");

        const rpcUrl =
          currentTab === "solana" ? SOL_RPC_ENDPOINT : ETH_RPC_ENDPOINT;

        if (!rpcUrl) {
          throw new Error("RPC endpoint not found");
        }

        if (currentTab === "solana") {
          const derivationPath = `m/44'/501'/${accountIndex - 1}'/0'`;

          const fromKeypair = await generateSolanaWallet(
            derivationPath,
            seedBuffer
          );

          const connection = new Connection(rpcUrl);

          const transferTransaction = new Transaction().add(
            SystemProgram.transfer({
              fromPubkey: fromKeypair.publicKey,
              toPubkey: new PublicKey(values.address),
              lamports: values.amount * LAMPORTS_PER_SOL,
            })
          );

          await sendAndConfirmTransaction(connection, transferTransaction, [
            fromKeypair,
          ]);
          setSendingMoney(false);
        } else if (currentTab === "ethereum") {
          const derivationPath = `m/44'/60'/0'/0/${accountIndex - 1}`;
          const { privateKey } = await generateEthWallet(
            derivationPath,
            seedBuffer
          );

          const connection = new JsonRpcProvider(rpcUrl);
          const signer = new Wallet(privateKey, connection);
          await signer.sendTransaction({
            to: values.address,
            value: parseEther(values.amount.toString()),
          });
        }
        toast.success(
          `Successfully sent ${values.amount} ${
            currentTab === "solana" ? "SOL" : "ETH"
          }to ${values.address}`
        );
      } catch (error) {
        const error_message =
          error instanceof Error ? error.message : "Send Failed";
        toast.error(error_message);
        setSendingMoney(false);
      }
    },
    [currentAccount, currentTab]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          Send
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-foreground h-1/2 flex flex-col items-center justify-center">
        <DialogHeader>
          <DialogTitle className="hidden">Send</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={handleSubmit(sendMoney)}
          className="flex flex-col gap-8 w-full"
        >
          <div className="flex flex-col gap-2">
            <label>{`Enter receiver's ${currentTab} address`}</label>
            <Input {...register("address")} />
            {errors.address && errors.address.message}
          </div>
          <div className="flex flex-col gap-2">
            <label>{`Enter Amount`}</label>
            <div className="relative">
              <Input
                type="number"
                step="any"
                {...register("amount", { valueAsNumber: true })}
              />
              <div className="absolute top-1/2 -translate-y-1/2 right-0 pr-2">
                {currentTab === "solana" ? "SOL" : "ETH"}
              </div>
              {errors.amount && errors.amount.message}
            </div>
          </div>
          <Button
            disabled={sendingMoney}
            className="w-full"
            variant="secondary"
            type="submit"
          >
            Send
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
