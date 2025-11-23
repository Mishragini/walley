import { Input } from "@/components/ui/input";
import { useOnboarding } from "../provider";

export default function Mnemonic({
  mnemonicPhrase,
  setUserMnemonic,
}: {
  mnemonicPhrase: string[];
  setUserMnemonic: React.Dispatch<React.SetStateAction<string[]>>;
}) {
  const { hasWallet } = useOnboarding();

  function handleInputChange(index: number, word: string) {
    const phrase = [...mnemonicPhrase];
    phrase[index] = word;
    setUserMnemonic(phrase);
  }
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {mnemonicPhrase.map((word, index) => (
        <div
          className="flex bg-secondary text-secondary-foreground pl-2 rounded-lg items-center "
          key={index}
        >
          <p>{index + 1}</p>
          <Input
            className="w-40 h-10  dark:bg-transparent border-none focus-visible:ring-0 focus-visible:border-transparent "
            value={word}
            disabled={!hasWallet}
            onChange={(e) => {
              handleInputChange(index, e.target.value.trim());
            }}
          />
        </div>
      ))}
    </div>
  );
}
