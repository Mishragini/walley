"use client";
import { getUserAccounts } from "@/app/actions/wallet";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { toast } from "sonner";

interface AccountData {
  id: string;
  userId: string;
  ethPublicKey: string | null;
  solPublicKey: string | null;
  accountIndex: number;
}

interface AccountContextValues {
  userAccounts: AccountData[];
  currentAccount: AccountData | null;
  setCurrentAccount: React.Dispatch<React.SetStateAction<AccountData | null>>;
  refetchUserAccounts: () => Promise<AccountData[]>;
  currentTab: "solana" | "ethereum";
  setCurrentTab: React.Dispatch<React.SetStateAction<"solana" | "ethereum">>;
}

const AccountContext = createContext<AccountContextValues | null>(null);

export function AccountProvider({ children }: { children: React.ReactNode }) {
  const [accounts, setAccounts] = useState<AccountData[]>([]);
  const [currentAccount, setCurrentAccount] = useState<AccountData | null>(
    null
  );
  const currentAccountInitialised = useRef(false);
  const [currentTab, setCurrentTab] = useState<"solana" | "ethereum">("solana");

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
    fetchUserAccounts();
  }, [refetchUserAccounts]);
  if (!accounts || accounts.length === 0) {
    return <div>Loading..</div>;
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
