"use client";

import { swapInputs, swapSchema } from "@/app/validations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useAccount } from "../provider";
import { buildTx, getQuote } from "@/app/actions/swap";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { parseUnits } from "ethers";
import { toast } from "sonner";
import { swapEthTxn, swapSolTxn } from "@/lib/swapTx";

export function Swap() {
  const { currentTab, currentAccount } = useAccount();
  const [from, setFrom] = useState(currentTab);
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<swapInputs>({
    resolver: zodResolver(swapSchema),
    defaultValues: {
      fromAddress: "",
      toAddress: "",
      amount: "",
    },
  });

  const changeFlow = useCallback(() => {
    if (from === "solana") {
      setFrom("ethereum");
    } else {
      setFrom("solana");
    }
  }, [from]);

  const convertAmount = useCallback(
    (amount: string) => {
      const amountInDecimals = parseFloat(amount);

      if (from === "solana") {
        // lamports are safe as string
        return (amountInDecimals * LAMPORTS_PER_SOL).toString();
      } else {
        // parseUnits returns bigint → convert to string
        return parseUnits(amount, "ether").toString();
      }
    },
    [from]
  );
  const handleSwap = useCallback(
    async (values: swapInputs) => {
      try {
        const { fromAddress, toAddress, amount } = values;
        const to = from === "solana" ? "ethereum" : "solana";
        const inputQuoteAmount = convertAmount(amount);

        if (!currentAccount) {
          return;
        }

        const quoteResponse = await getQuote({
          userAddress: fromAddress,
          to,
          from,
          inputAmount: inputQuoteAmount,
          receiverAddress: toAddress,
        });

        const quoteId = quoteResponse.manualRoutes[0].quoteId;

        const builTxRes = await buildTx(quoteId);

        const { txData } = builTxRes;

        if (from === "ethereum") {
          await swapEthTxn(txData, currentAccount?.accountIndex);
        } else if (from === "solana") {
          await swapSolTxn(txData, currentAccount?.accountIndex);
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Something went wrong while fetching quote";
        toast.error(errorMessage);
      }
    },
    [convertAmount, from, currentAccount]
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" size="lg">
          Swap
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-background h-1/2">
        <DialogHeader>
          <DialogTitle>Swap tokens cross chain</DialogTitle>
        </DialogHeader>
        <div>
          The developer is currently out of mainnet funds to test this feature.
        </div>
        <div>
          If you wish to support, you can send a small $1 worth of SOL/ETH
          below:
        </div>
        <div>SOL: FmiPKF5TyuwNtPkQro3UiWwbuY6LLr48rDDh5LpaQxdE</div>
        <div>ETH: 0x55431f9f93113A16Bf22852049605F47Edf42FbF</div>
        <div>Thanks!</div>
      </DialogContent>
    </Dialog>
  );

  // return (
  //   <Dialog>
  //     <DialogTrigger asChild>
  //       <Button>Swap</Button>
  //     </DialogTrigger>
  //     <DialogContent className="bg-primary">
  //       <DialogHeader>
  //         <DialogTitle>Swap</DialogTitle>
  //         <form onSubmit={handleSubmit(handleSwap)}>
  //           <div>
  //             <label>From:</label>
  //             <div className="relative">
  //               <Input {...register("fromAddress")} />
  //               <div className="absolute top-1/2 -translate-y-1/2 right-0 pr-2">
  //                 {from === "solana" ? "SOL" : "ETH"}
  //               </div>
  //             </div>
  //             {errors.fromAddress && (
  //               <p className="text-red-500">{errors.fromAddress.message}</p>
  //             )}
  //           </div>
  //           <Button onClick={changeFlow}>
  //             <ArrowUp />
  //             <ArrowDown />
  //           </Button>
  //           <div>
  //             <label>To:</label>
  //             <div className="relative">
  //               <Input {...register("toAddress")} />
  //               <div className="absolute top-1/2 -translate-y-1/2 right-0 pr-2">
  //                 {from === "solana" ? "ETH" : "SOL"}
  //               </div>
  //             </div>
  //             {errors.toAddress && (
  //               <p className="text-red-500">{errors.toAddress.message}</p>
  //             )}
  //           </div>
  //           <div>
  //             <label>Amount</label>
  //             <Input {...register("amount")} />
  //           </div>
  //           <Button type="submit">Swap</Button>
  //         </form>
  //       </DialogHeader>
  //     </DialogContent>
  //   </Dialog>
  // );
}
