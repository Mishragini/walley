import { Button } from "@/components/ui/button";
import { logout } from "../actions/logout";

import { getUserAccounts } from "../actions/wallet";

export default async function Dashboard() {
  const userAccounts = await getUserAccounts();

  return (
    <div>
      <div>Dashboard</div>
      {JSON.stringify(userAccounts)}
    </div>
  );
}
