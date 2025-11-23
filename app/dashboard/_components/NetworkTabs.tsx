"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAccount } from "../provider";
import { Button } from "@/components/ui/button";
import { Balance } from "./Balance";

export function NetworkTabs() {
  const { currentTab, setCurrentTab } = useAccount();
  return (
    <Tabs defaultValue={currentTab} className="pt-4">
      <TabsList className="w-md">
        <TabsTrigger className="w-full " value="solana" asChild>
          <Button
            className="bg-transparent hover:bg-transparent"
            onClick={() => {
              setCurrentTab("solana");
            }}
          >
            Solana
          </Button>
        </TabsTrigger>
        <TabsTrigger className="w-full" value="ethereum" asChild>
          <Button
            className="bg-transparent hover:bg-transparent"
            onClick={() => {
              setCurrentTab("ethereum");
            }}
          >
            Ethereum
          </Button>
        </TabsTrigger>
      </TabsList>
      <TabsContent value="solana">
        <Balance network="solana" />
      </TabsContent>
      <TabsContent value="ethereum">
        <Balance network="ethereum" />
      </TabsContent>
    </Tabs>
  );
}
