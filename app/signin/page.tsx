"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Logo from "../_components/Logo";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "../actions/signin";
import { signinInputs, signinSchema } from "../validations";
import { toast } from "sonner";
import { useCallback, useState, useTransition } from "react";
import PasswordInput from "../_components/PasswordInput";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { db } from "@/lib/indexedDb";
import { mnemonicToSeedSync } from "bip39";
import { ETH_RPC_ENDPOINT } from "@/lib/config";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signinInputs>({
    resolver: zodResolver(signinSchema),
  });

  const [isPending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const [showMnemonicField, setShowMnemonicField] = useState(false);
  const router = useRouter();

  const onSubmit = useCallback(
    async (values: signinInputs) => {
      startTransition(async () => {
        try {
          const res = await signIn(values);

          if (res.error) {
            toast.error(res.error);
            return;
          }
          if (res.userId) {
            if (values.mnemonic) {
              const seed = Buffer.from(
                mnemonicToSeedSync(values.mnemonic)
              ).toString("base64");

              await db.seeds.put({ id: res.userId, value: seed });
            }
            const seed = await db.seeds.get({ id: res.userId });

            if (!seed || !seed.value) {
              setShowMnemonicField(true);
              toast.error("Seed not found. Kindly add the seed.");
              return;
            }
          }
          toast.success("Signed in successfully!");
          router.push("/dashboard");
        } catch (error) {
          const errorMessage =
            error instanceof Error
              ? error.message
              : "Something went wrong while signing up!";
          toast.error(errorMessage);
        }
      });
    },
    [router]
  );

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col gap-4 items-center">
        <Logo />
        <div className="text-2xl font-medium">Login in to your wallet</div>
        <p className="text-muted-foreground">
          {"Don't have an account? "}
          <Link className="hover:pointer underline" href={"/onboarding"}>
            Start Onboarding
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-[#969FAF] font-medium text-base">Email</label>
          <Input {...register("email")} type="text" disabled={isPending} />
          {errors.email && (
            <p className="text-red-500 font-medium text-base">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-[#969FAF] font-medium text-base">
            Password
          </label>
          <PasswordInput
            register={register}
            setEyeState={setShowPassword}
            eyeState={showPassword}
            isPending={isPending}
            fieldName="password"
          />

          {errors.password && (
            <p className="text-red-500 font-medium text-base">
              {errors.password.message}
            </p>
          )}
        </div>

        {showMnemonicField && (
          <div className="flex flex-col gap-2">
            <label>Add Mnemonic</label>
            <Textarea
              {...register("mnemonic")}
              className="max-w-md"
              placeholder="Add your 12/24 word Mnemonic Phrase"
            />
            {errors.mnemonic && (
              <p className="text-red-500 font-medium text-base">
                {errors.mnemonic.message}
              </p>
            )}
          </div>
        )}

        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="w-md text-base font-semibold"
          disabled={isPending}
        >
          {isPending ? "Signing in..." : "Sign In"}
        </Button>
      </form>
    </div>
  );
}
