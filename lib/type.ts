import type React from "react";

export interface AccountData {
    id: string;
    userId: string;
    ethPublicKey: string | null;
    solPublicKey: string | null;
    accountIndex: number;
}

export type Network = "solana" | "ethereum";

export interface AccountContextValues {
    userAccounts: AccountData[];
    currentAccount: AccountData | undefined;
    setCurrentAccount: React.Dispatch<
        React.SetStateAction<AccountData | undefined>
    >;
    refetchUserAccounts: () => Promise<AccountData[]>;
    currentTab: Network;
    setCurrentTab: React.Dispatch<React.SetStateAction<Network>>;
}

export type OnboardingProviderValues = {
    hasWallet: boolean;
    setHasWallet: React.Dispatch<React.SetStateAction<boolean>>;
    selectedNetworks: string[];
    setSelectedNetworks: React.Dispatch<React.SetStateAction<string[]>>;
    mnemonicPhrase: string[];
    setMnemonicPhrase: React.Dispatch<React.SetStateAction<string[]>>;
};

export interface Seed {
    id: string;
    value: string;
}

export interface User {
    email: string;
    password: string;
    id: string;
}