"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAccount } from "../provider";
import { Plus } from "lucide-react";
import { db } from "@/lib/indexedDb";
import { getUser } from "@/app/actions/getUser";
import { toast } from "sonner";
import { addAccount } from "@/app/actions/wallet";
import { useCallback, useTransition } from "react";

export function AccountButton() {
  const {
    currentAccount,
    userAccounts,
    setCurrentAccount,
    refetchUserAccounts,
  } = useAccount();
  const [isPending, startTransition] = useTransition();

  function renderRestAccounts() {
    return (
      <div className="flex flex-col">
        {userAccounts.map((account, index) => (
          <Button
            className={index === 0 ? "rounded-b-none" : "rounded-none"}
            key={index}
            onClick={() => {
              setCurrentAccount(account);
            }}
          >{`Account ${index + 1}`}</Button>
        ))}
      </div>
    );
  }

  const handleAddAccount = useCallback(() => {
    startTransition(async () => {
      try {
        const { userId } = await getUser();
        const seed = await db.seeds.get({ id: userId });
        if (!seed) {
          toast.error(
            "Seed not found in indexed db. Login and add back mnemonic phrase."
          );
          return;
        }

        const base64Seed = seed.value;

        const { error, success } = await addAccount(
          userAccounts.length + 1,
          base64Seed,
          ["solana", "ethereum"]
        );
        if (error) {
          toast.error(error);
          return;
        }
        toast.error("Account added successfully");
        refetchUserAccounts();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unable to add account";
        toast.error(errorMessage);
      }
    });
  }, [refetchUserAccounts, userAccounts]);

  return (
    <Popover>
      <PopoverTrigger>
        <div className=" border-2 border-accent/10 py-2 px-8 rounded-full">
          {`Account ${currentAccount?.accountIndex ?? "..."}`}
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col bg-transparent p-0">
        {userAccounts.length > 0 && renderRestAccounts()}
        <Button
          disabled={isPending}
          onClick={handleAddAccount}
          className="rounded-t-none "
          variant={"secondary"}
        >
          <Plus /> Add Account
        </Button>
      </PopoverContent>
    </Popover>
  );
}
