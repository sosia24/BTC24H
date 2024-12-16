"use client";

import { useState, useEffect, Suspense } from "react";
import { useWallet } from "@/services/walletContext";
import Image from "next/image";
import Link from "next/link";
import RegisterModal from "@/componentes/RegisterModal";
import { useSearchParams } from "next/navigation";
import { doLogin } from "@/services/Web3Services";

function HomeContent() {
  const { address, setAddress } = useWallet();
  const [showModal, setShowModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const referral = searchParams.get("ref");
    if (referral) {
      setShowRegisterModal(true); // Abre o modal automaticamente
    }
  }, [searchParams]);

  useEffect(() => {
    if (address) {
      setShowModal(true);
    }
  }, [address]);

  const handleLogin = async () => {
    try {
      const newAddress = await doLogin();
      setAddress(newAddress);
    } catch (err) {
      console.error("Login failed", err);
    }
  };

  return (
    <div className="h-[80%] w-[70%] flex flex-col items-center lg:flex-row">
      <div className="w-[100%] lg:w-[50%] flex justify-center lg:order-2">
        <Image
          src="/images/initialCoins.png"
          alt="Coin3d"
          width={720}
          height={600}
          className="lg:ml-0 ml-[50px]"
        />
      </div>

      <div className="w-[100%] lg:mt-0 mt-[60px] lg:w-[50%] flex flex-col items-center lg:items-start text-center lg:text-left md:order-1">
        <p className="lg:text-[80px] md:text-[65px] text-[35px] font-bold">BTC24H</p>
        <p className="lg:text-[30px] md:text-[22px] text-[18px]">Twenty four hours every day</p>
        {address ? (
          <button className="p-2 w-[300px] bg-[#ffc908] rounded-3xl mt-[10px] text-black">
            {address.slice(0, 6) + "..." + address.slice(-4)}
          </button>
        ) : (
          <button
            className="p-2 w-[300px] bg-[#08ff65] rounded-3xl mt-[10px] text-black hover:bg-[#08ff67d3]"
            onClick={handleLogin}
          >
            Connect Wallet
          </button>
        )}
        <Link
          className="p-2 w-[300px] text-center lg:mb-0 bg-[#08ff65] rounded-3xl mt-[10px] text-black hover:bg-[#08ff67d3]"
          href="/home"
        >
          Enter
        </Link>
        <Link
          className="p-2 w-[300px] text-center lg:mb-0 mb-[100px] bg-[#08ff65] rounded-3xl mt-[10px] text-black hover:bg-[#08ff67d3]"
          href="/preSale"
        >
          Presale
        </Link>
        {showModal ? <RegisterModal /> : ""}
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <main className="w-full h-screen flex justify-center items-center">
      <Suspense fallback={<div>Loading...</div>}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
