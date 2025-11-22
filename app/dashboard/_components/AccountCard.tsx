import { AccountButton } from "./AccountButton";
import { Balance } from "./Balance";
import { NetworkTabs } from "./NetworkTabs";
import { Receive } from "./Receive";
import { Send } from "./Send";
import { Swap } from "./Swap";

export function AccountCard() {
  return (
    <div className="flex justify-center items-center flex-col">
      <AccountButton />
      <NetworkTabs />
      <Balance />
      <div className="flex items-center justify-between gap-2">
        <Send />
        <Receive />
        <Swap />
      </div>
    </div>
  );
}
