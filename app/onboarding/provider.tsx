import { createContext, ReactNode, useContext, useState } from "react";

type OnboardingProviderValues = {
  hasWallet: boolean;
  setHasWallet: React.Dispatch<React.SetStateAction<boolean>>;
  selectedNetworks: string[];
  setSelectedNetworks: React.Dispatch<React.SetStateAction<string[]>>;
  mnemonicPhrase: string[];
  setMnemonicPhrase: React.Dispatch<React.SetStateAction<string[]>>;
};

const OnboardingContext = createContext<OnboardingProviderValues | null>(null);

export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [hasWallet, setHasWallet] = useState(false);
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [mnemonicPhrase, setMnemonicPhrase] = useState(
    Array<string>(12).fill("")
  );

  return (
    <OnboardingContext.Provider
      value={{
        hasWallet,
        setHasWallet,
        selectedNetworks,
        setSelectedNetworks,
        mnemonicPhrase,
        setMnemonicPhrase,
      }}
    >
      {children}
    </OnboardingContext.Provider>
  );
};

export function useOnboarding() {
  const ctx = useContext(OnboardingContext);
  if (!ctx)
    throw new Error("useOnboarding must be used within OnboardingProvider");
  return ctx;
}
