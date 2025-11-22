"use client";

import { useCallback, useState } from "react";
import StepCircle from "./_components/StepCircle";
import StepOne from "./_components/StepOne";
import StepTwo from "./_components/StepTwo";
import StepThree from "./_components/StepThree";
import StepFour from "./_components/StepFour";
import StepFive from "./_components/StepFive";
import { ArrowLeft } from "lucide-react";
import { useOnboarding } from "./provider";

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [0, 1, 2, 3, 4];

  const { setHasWallet, setSelectedNetworks } = useOnboarding();

  const moveToNextStep = useCallback(() => {
    setCurrentStep((c) => c + 1);
  }, []);

  const existingWalletHandler = useCallback(() => {
    setHasWallet(true);
    setSelectedNetworks([]);
    moveToNextStep();
  }, [setSelectedNetworks, moveToNextStep, setHasWallet]);

  const createWalletHandler = useCallback(() => {
    setHasWallet(false);
    setSelectedNetworks([]);
    moveToNextStep();
  }, [setSelectedNetworks, moveToNextStep, setHasWallet]);

  const moveToPrevStep = useCallback(() => {
    setCurrentStep((c) => c - 1);
  }, []);

  const renderStep = useCallback(() => {
    switch (currentStep) {
      case 0:
        return (
          <StepOne
            handleCreateWallet={createWalletHandler}
            handleExistingWallet={existingWalletHandler}
          />
        );

      case 1:
        return <StepTwo handleClick={moveToNextStep} />;

      case 2:
        return <StepThree handleClick={moveToNextStep} />;

      case 3:
        return <StepFour handleClick={moveToNextStep} />;

      case 4:
        return <StepFive />;

      default:
        return null;
    }
  }, [currentStep, createWalletHandler, existingWalletHandler, moveToNextStep]);

  return (
    <div className=" h-screen flex items-center justify-center p-4">
      <div className=" flex flex-col h-full items-start ">
        <div className=" flex items-center pt-20 relative justify-start w-full">
          {currentStep !== 0 && currentStep !== 4 && (
            <ArrowLeft
              onClick={moveToPrevStep}
              height={28}
              width={28}
              className="  text-[#969FAF] hover:pointer"
            />
          )}

          <div className="flex  items-center gap-4 absolute left-1/2 -translate-x-1/2">
            {steps.map((_, i) => (
              <StepCircle
                key={i}
                variant={
                  currentStep === i
                    ? "active"
                    : i < currentStep
                    ? "prev"
                    : "default"
                }
              />
            ))}
          </div>
        </div>
        {renderStep()}
      </div>
    </div>
  );
}
