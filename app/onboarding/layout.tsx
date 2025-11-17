"use client";

import { OnboardingProvider } from "./provider";

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
}
