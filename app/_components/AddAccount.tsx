"use client";
import { Button } from "@/components/ui/button";
import { useCallback, useMemo, useTransition } from "react";
import { getUser } from "../actions/getUser";
import { db } from "@/lib/indexedDb";
import { toast } from "sonner";
import { addAccount } from "../actions/wallet";
import { useAccount } from "../dashboard/provider";
import { Plus } from "lucide-react";

export function AddAccount({
  networks,
  current,
}: {
  networks: string[];
  current?: boolean;
}) {
  const { userAccounts, refetchUserAccounts, currentAccount, setCurrentAccount } = useAccount();
  const [isPending, startTransition] = useTransition();
  const buttonClassName = useMemo(() => {
    return current ? "bg-transparent" : "rounded-t-none";
  }, [current]);
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

        const index = current ? undefined : userAccounts.length + 1;

        const { error, success } = await addAccount(
          base64Seed,
          networks,
          index,
          currentAccount
        );
        if (error) {
          toast.error(error);
          return;
        }
        toast.success("Account added successfully");
        const updatedAccounts = await refetchUserAccounts();
        
        if (current && currentAccount) {
          const updatedCurrentAccount = updatedAccounts.find(
            (acc) => acc.accountIndex === currentAccount.accountIndex
          );
          if (updatedCurrentAccount) {
            setCurrentAccount(updatedCurrentAccount);
          }
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unable to add account";
        toast.error(errorMessage);
      }
    });
  }, [refetchUserAccounts, userAccounts, networks, currentAccount, current, setCurrentAccount]);

  return (
    <Button
      disabled={isPending}
      onClick={handleAddAccount}
      className={buttonClassName}
      variant={"secondary"}
    >
      <Plus /> Add Account
    </Button>
  );
}
