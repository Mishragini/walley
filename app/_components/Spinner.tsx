import { Loader2 } from "lucide-react";

export function Spinner() {
  return (
    <div className="h-full flex justify-center items-center animate-spin">
      <Loader2 />
    </div>
  );
}
