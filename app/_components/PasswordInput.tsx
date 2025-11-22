"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { FieldValues, Path, UseFormRegister } from "react-hook-form";

export default function PasswordInput<T extends FieldValues>({
  register,
  eyeState,
  setEyeState,
  fieldName,
  isPending,
}: {
  register: UseFormRegister<T>;
  fieldName: Path<T>;
  eyeState: boolean;
  setEyeState: React.Dispatch<React.SetStateAction<boolean>>;
  isPending: boolean;
}) {
  return (
    <div className="relative">
      <Input
        {...register(fieldName)}
        type={eyeState ? "text" : "password"}
        disabled={isPending}
      />
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
    </div>
  );
}
