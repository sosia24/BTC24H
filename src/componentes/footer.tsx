"use client"
import Link from "next/link"
import { useState } from "react";
import { usePathname } from "next/navigation";
import { IoHome } from "react-icons/io5";
import { RiNftFill } from "react-icons/ri";
import { FaPeopleGroup } from "react-icons/fa6";
import { AiFillDollarCircle } from "react-icons/ai";
import { useWallet } from '@/services/walletContext';
import { FaUserCog } from "react-icons/fa";
import { useEffect } from "react";
import Image from "next/image";
import { useRef } from "react";




export default function Footer(){
    const pathname = usePathname();
    const isActive = (pathName:string) => pathname === pathName;
    const [popUp, setPopUp] = useState(false);
    const { address, setAddress } = useWallet();
    const popUpRef = useRef<HTMLDivElement | null>(null);

    const handleClickOutside = (event: MouseEvent) => {
      // Verifica se o clique foi fora do pop-up
      if (popUpRef.current && !popUpRef.current.contains(event.target as Node)) {
        closePopUp(); // Fecha o pop-up se o clique for fora da área
      }
    };
    useEffect(() => {
      // Adiciona o listener de clique
      document.addEventListener('mousedown', handleClickOutside);
  
      return () => {
        // Remove o listener ao desmontar o componente
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }, []);

    async function closePopUp(){
      setPopUp((prevValue) => !prevValue);
    }

    const switchAccount = async () => {
      if (window.ethereum) {
        try {
          // Isso solicita que o usuário escolha uma conta
          const permissions = await window.ethereum.request({
            method: 'wallet_requestPermissions',
            params: [{ eth_accounts: {} }]
          });
    
          // Verifica as contas novamente após a permissão ser solicitada
          const accounts = await window.ethereum.request({ method: 'eth_accounts' });
          setAddress(accounts[0]); // Atualiza a conta conectada
          window.location.reload()
        } catch (error) {
          console.error("Erro ao trocar de conta:", error);
        }
      }
    };



    const handleDisconnect = () => {
      setAddress(null); // Limpa o estado da conta conectada
  
      // Remove todas as variáveis do localStorage relacionadas à conexão
      localStorage.removeItem('userAddress'); // Adicione outras chaves conforme necessário
  
      // Recarrega a página
      window.location.reload();
  };
  


    useEffect(() => {
      // Obtém a conta inicial no carregamento
      async function fetchAccount() {
        if (typeof window.ethereum !== "undefined") {
          const accounts = await window.ethereum.request({
            method: "eth_accounts",
          });
          if (accounts && accounts.length > 0) {
            setAddress(accounts[0]);
          }
        }
      }
  
      fetchAccount();
    }, []);

  
    
    return(
      <>
      <footer className="flex items-center justify-center z-30">
      <div className="rounded-[35px] w-[80%] md:w-[98%] max-w-[1280px] p-1 h-[80px] fixed bottom-[17px] bg-[#7F7F7F]"></div>
<aside className="rounded-[33px] w-[80%] md:w-[98%] max-w-[1280px] p-5 fixed bottom-[20px] bg-[#171717] flex justify-between items-center">
  {/* Home */}
  <div className="flex flex-col items-center text-[14px] md:text-[10px]">
    <Link href="/home" className="flex flex-col items-center hover:scale-105 transition-all duration-300">
      <IoHome className="w-[30px] h-[30px] md:w-[20px] md:h-[20px] text-[#FFE501]"></IoHome>
      <p className={isActive('/home') ? 'text-[#FFE501]' : 'text-white'}>Home</p>
    </Link>
  </div>

  {/* Donation */}
  <div className="flex flex-col items-center text-[14px] md:text-[10px]">
    <Link href="/donation" className="flex flex-col items-center hover:scale-105 transition-all duration-300">
      <AiFillDollarCircle className="w-[30px] h-[30px] md:w-[20px] md:h-[20px] text-[#FFE501]"></AiFillDollarCircle>
      <p className={isActive('/donation') ? 'text-[#FFE501]' : 'text-white'}>Donation</p>
    </Link>
  </div>

  {/* Queues (Central Logo) */}
  <div className="flex flex-col items-center justify-end">
    <Link href="/queues" className="flex flex-col items-center">
      <div className="bg-[#171717] bottom-[20px] absolute flex flex-col justify-center items-center rounded-full w-[120px] h-[120px] md:w-[80px] md:h-[80px]">
        <div className="hover:scale-105 transition-all duration-300 text-center">
          <Image priority width={80} height={80} className="w-[100px] h-[100px] md:w-[60px] md:h-[60px]" src="/images/logo.png" alt="logo"></Image>
          <p className={isActive('/queues') ? 'text-[#FFE501] text-[18px] sm:text-[14px]' : 'text-white text-[18px] sm:text-[14px]'}>Queues</p>
        </div>
      </div>
    </Link>
  </div>

  {/* NFTs */}
  <div className="flex flex-col items-center text-[14px] md:text-[10px]">
    <Link href="/nfts" className="flex flex-col items-center hover:scale-105 transition-all duration-300">
      <RiNftFill className="w-[30px] h-[30px] md:w-[20px] md:h-[20px] text-[#FFE501]"></RiNftFill>
      <p className={isActive('/nfts') ? 'text-[#FFE501]' : 'text-white'}>Nfts/Gas</p>
    </Link>
  </div>

  {/* User Settings */}
  <div className="flex flex-col items-center text-[14px] md:text-[10px]">
    <Link onClick={closePopUp} href="" className="flex flex-col items-center hover:scale-105 transition-all duration-300">
      <FaUserCog className="w-[30px] h-[30px] md:w-[20px] md:h-[20px] text-[#FFE501]"></FaUserCog>
      <p className={isActive('/networking') ? 'text-[#FFE501]' : 'text-white'}>
        {address?.slice(0, 6) + "..." + address?.slice(-4)}
      </p>
    </Link>
  </div>
</aside>

      </footer>

      {popUp?(
        <div  className="popup-content fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
  <div ref={popUpRef} className="bg-white p-8 rounded-xl shadow-2xl w-[92%] max-w-[500px] relative">
    <button
      onClick={closePopUp}
      className="absolute top-3 right-3 text-gray-500 hover:text-gray-700"
    >
      ✕
    </button>
    <h2 className="text-2xl font-bold mb-4 text-gray-800">Account</h2>
    <p className="text-gray-700 mb-6">
      Account:{" "}
      <span className="font-mono text-blue-600 break-all">
        {address?.slice(0,8)+'...'+address?.slice(-6) || "Nenhuma conta conectada"}
      </span>
    </p>
    <div className="flex flex-col space-y-3">
      <button
        onClick={switchAccount}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600"
      >
        Switch Account
      </button>
      <button
        onClick={() => navigator.clipboard.writeText(address || "")}
        className="w-full px-4 py-2 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600"
        disabled={!address}
      >
        Copy Address
      </button>
      <button
      onClick={handleDisconnect}
        className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
      >
        Disconnect
      </button>
    </div>
  </div>
</div>

      ):(
        ""
      )}

      </>
    )
}