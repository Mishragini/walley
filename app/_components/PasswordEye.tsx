"use client";

import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";

export default function PasswordEye({
  eyeState,
  setEyeState,
}: {
  eyeState: boolean;
  setEyeState: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  return (
    <Button
      onClick={(e) => {
        e.preventDefault();

        setEyeState(!eyeState);
      }}
      variant="ghost"
      className="absolute right-1 text-muted-foreground hover:bg-transparent hover:text-mutedforeground"
    >
      {eyeState ? <Eye /> : <EyeOff />}
    </Button>
  );
}
