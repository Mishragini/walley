"use client";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAccount } from "../provider";
import { AddAccount } from "@/app/_components/AddAccount";

export function AccountButton() {
  const { currentAccount, userAccounts, setCurrentAccount } = useAccount();

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

  return (
    <Popover>
      <PopoverTrigger>
        <div className=" border-2 border-border py-2 px-8 rounded-full">
          {`Account ${currentAccount?.accountIndex ?? "..."}`}
        </div>
      </PopoverTrigger>
      <PopoverContent className="flex flex-col bg-transparent p-0">
        {userAccounts.length > 0 && renderRestAccounts()}
        <AddAccount networks={["solana", "ethereum"]} />
      </PopoverContent>
    </Popover>
  );
}
