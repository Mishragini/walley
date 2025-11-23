"use client";
import { getUserAccounts } from "@/app/actions/wallet";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { Spinner } from "../_components/Spinner";
import { AccountData, AccountContextValues, Network } from "@/lib/type";

const AccountContext = createContext<AccountContextValues | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [currentAccount, setCurrentAccount] = useState<AccountData | undefined>(
    undefined
  );
  const currentAccountInitialised = useRef(false);
  const [currentTab, setCurrentTab] = useState<Network>("solana");

  const [isPending, startTransition] = useTransition();

  const refetchUserAccounts = useCallback(async () => {
    const { error, userAccounts } = await getUserAccounts();
    if (error || !userAccounts) {
      toast.error(error);
      return [];
    }
    setAccounts(userAccounts);
    return userAccounts;
  }, []);

  useEffect(() => {
    async function fetchUserAccounts() {
      const userAccounts = await refetchUserAccounts();
      if (
        !currentAccountInitialised.current &&
        userAccounts &&
        userAccounts.length !== 0
      ) {
        currentAccountInitialised.current = true;
        setCurrentAccount(userAccounts[0]);
      }
    }
    startTransition(() => {
      fetchUserAccounts();
    });
  }, [refetchUserAccounts]);

  if (isPending || !currentAccount) {
    return (
      <div className="h-screen">
        <Spinner />
      </div>
    );
  }
  return (
    <AccountContext.Provider
      value={{
        userAccounts: accounts,
        currentAccount,
        setCurrentAccount,
        refetchUserAccounts,
        currentTab,
        setCurrentTab,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const accountContext = useContext(AccountContext);
  if (!accountContext) {
    throw new Error("useAccount must be used within AccountProvider");
  }
  return accountContext;
}
