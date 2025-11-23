import Image from "next/image";

export default function Logo() {
  return (
    <div className="flex bg-card items-center justify-center rounded-full aspect-square p-4 w-20 h-20">
      <Image src="/wallet.png" alt="wallet-icon" width={32} height={32} />
    </div>
  );
}
