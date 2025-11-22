import { AccountCard } from "./_components/AccountCard";
import { AccountProvider } from "./provider";

export default async function Dashboard() {
  return (
    <AccountProvider>
      <div className="h-screen flex items-center justify-center ">
        <div className="border border-accent p-8 rounded-lg bg-primary">
          <AccountCard />
        </div>
      </div>
    </AccountProvider>
  );
}
