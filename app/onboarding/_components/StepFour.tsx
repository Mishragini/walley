"use client";

import PasswordEye from "@/app/_components/PasswordEye";
import { signup } from "@/app/actions/signup";
import { signpInputs, signupSchema } from "@/app/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { MouseEventHandler, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

export default function StepFour({ handleClick }: { handleClick: () => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<signpInputs>({
    mode: "onChange",
    reValidateMode: "onChange",
    resolver: zodResolver(signupSchema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  async function handleSignUp(data: signpInputs) {
    const { email, password } = data;
    const result = await signup(email, password);
    if (result.error) {
      toast.error(result.error);
    }
    handleClick();
  }

  return (
    <div className="h-full flex flex-col items-center justify-between py-8">
      <div className="flex flex-col items-center gap-2">
        <div className="text-2xl font-medium">Set up your account</div>
        <p className="text-[#969FAF] font-medium text-base text-center">
          You&apos;ll use these details to log in to your wallet.
        </p>
      </div>

      <form
        onSubmit={handleSubmit(handleSignUp)}
        className="flex flex-col gap-6 w-full max-w-md"
      >
        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#E5E7EB]">Email</label>
          <Input {...register("email")} className="h-11" />
          {errors.email?.message && (
            <p className="text-xs text-red-500">{errors.email?.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#E5E7EB]">Password</label>
          <div className="flex relative">
            <Input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className="h-11 pr-10"
            />
            <PasswordEye
              eyeState={showPassword}
              setEyeState={setShowPassword}
            />
          </div>
          {errors?.password?.message && (
            <p className="text-xs text-red-500">{errors.password?.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-medium text-[#E5E7EB]">
            Confirm Password
          </label>
          <div className="flex relative">
            <Input
              type={showConfirmPassword ? "text" : "password"}
              {...register("confirmPassword")}
              className="h-11 pr-10"
            />
            <PasswordEye
              eyeState={showConfirmPassword}
              setEyeState={setShowConfirmPassword}
            />
          </div>

          {errors?.confirmPassword?.message && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword?.message}
            </p>
          )}
        </div>

        <div className="pt-2">
          <Button
            type="submit"
            variant="secondary"
            className="h-12 w-full text-base font-semibold hover:pointer"
            disabled={!isValid}
          >
            Next
          </Button>
        </div>
      </form>
    </div>
  );
}
