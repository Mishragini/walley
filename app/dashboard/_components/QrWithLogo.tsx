"use client";

import { useEffect, useMemo, useRef } from "react";
import { useAccount } from "../provider";
import QRCodeStyling from "qr-code-styling";

export function QrWithLogo() {
  const { currentTab, currentAccount } = useAccount();
  const qrRef = useRef<HTMLDivElement>(null);
  const qr = useRef<QRCodeStyling | null>(null);

  const address = useMemo(() => {
    return currentTab === "solana"
      ? currentAccount?.solPublicKey
      : currentAccount?.ethPublicKey;
  }, [currentAccount, currentTab]);

  const logo = useMemo(() => {
    return currentTab === "solana" ? "/solana.png" : "/ethereum.png";
  }, [currentTab]);

  useEffect(() => {
    if (!address || !qrRef.current) return;

    if (!qr.current) {
      qr.current = new QRCodeStyling({
        width: 200,
        height: 200,
        type: "canvas",
        data: address,
        image: logo,

        imageOptions: {
          imageSize: 0.3,
          crossOrigin: "anonymous",
        },

        qrOptions: {
          errorCorrectionLevel: "H",
        },
      });
    } else {
      qr.current.update({ data: address, image: logo });
    }

    qrRef.current.innerHTML = "";
    qr.current.append(qrRef.current);
  }, [address, logo]);

  return <div ref={qrRef} />;
}
