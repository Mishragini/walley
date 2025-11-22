"use client";
import { logout } from "@/app/actions/logout";
import { Button } from "@/components/ui/button";
import { useCallback, useTransition } from "react";

export function Logout() {
  const [isPending, startTransaction] = useTransition();
  const handleLogut = useCallback(() => {
    startTransaction(async () => {
      await logout();
    });
  }, []);
  return (
    <div className="flex w-full justify-end">
      <Button
        disabled={isPending}
        onClick={handleLogut}
        variant="secondary"
        className="rounded-full"
        size="sm"
      >
        Logout
      </Button>
    </div>
  );
}
