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
import { redirect } from "next/navigation";

export default function SignIn() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<signinInputs>({
    resolver: zodResolver(signinSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: signinInputs) {
    //signIn logic here
    const res = await signIn(values);
    if (res.error) {
      toast.error(res.error);
    }
    else {
      toast.success(res.success);
      redirect("/dashboard");
    }
  }

  return (
    <div className="h-screen w-full flex flex-col items-center justify-center gap-10">
      <div className="flex flex-col gap-4 items-center">
        <Logo />
        <div className="text-2xl font-medium ">Login in to your wallet</div>
        <p className="text-muted-foreground">
          {`Don't have an account ?`}{" "}
          <Link className="hover:pointer underline" href={"/onboarding"}>
            Start Onboarding
          </Link>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <label className="text-[#969FAF] font-medium text-base">Email</label>
          <Input {...register("email")} type="text" />
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

          <Input {...register("password")} type="password" />
          {errors.password && (
            <p className="text-red-500 font-medium text-base">
              {errors.password.message}
            </p>
          )}
        </div>
        <Button
          type="submit"
          variant="secondary"
          size="lg"
          className="w-md text-base font-semibold"
        >
          SignIn
        </Button>
      </form>
    </div>
  );
}
