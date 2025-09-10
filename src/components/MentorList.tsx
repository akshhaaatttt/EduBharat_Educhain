
"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers"
import { Users, MessageSquare, Wallet, ExternalLink, Loader2 } from "lucide-react";

// Types
interface Mentor {
  id: number;
  name: string;
  role: string;
  company: string;
  rate: number;
  availability: "Available" | "Booked";
  walletAddress: string;
  image: string;
}

interface MetaMaskError {
  code: number;
  message: string;
}

// Constants
const EDUCHAIN_CHAIN_ID = "656476"; // Hexadecimal format for 656476
const EDUCHAIN_CONFIG = {
  chainId: EDUCHAIN_CHAIN_ID,
  chainName: "EDU Chain Testnet",
  nativeCurrency: {
    name: "EduChain Ether",
    symbol: "EDU",
    decimals: 18,
  },
  rpcUrls: ["https://open-campus-codex-sepolia.drpc.org"],
  blockExplorerUrls: ["https://opencampus-codex.blockscout.com/"],
};

const MOCK_MENTORS: Mentor[] = [
  {
    id: 1,
    name: "Akshat Jain",
    role: "Senior AI Engineer",
    company: "Google",
    rate: 0.0002,
    availability: "Available",
    walletAddress: "0xa53075634220761e7aAc7018ed5803B18E89b452",
    image: "https://raw.githubusercontent.com/akshhaaatttt/cdns/main/uploads/pic.png",
  },
  {
    id: 2,
    name: "Naman Dangi",
    role: "Lead Developer",
    company: "Microsoft",
    rate: 0.0002,
    availability: "Available",
    walletAddress: "0xa53075634220761e7aAc7018ed5803B18E89b452",
    image: "https://raw.githubusercontent.com/akshhaaatttt/cdns/main/uploads/WhatsApp%20Image%202025-04-27%20at%2005.05.08_09bfa75b.jpg",
  },
  {
    id: 3,
    name: "Vishal Singh",
    role: "Data Scientist",
    company: "Amazon",
    rate: 0.0002,
    availability: "Available",
    walletAddress: "0xa53075634220761e7aAc7018ed5803B18E89b452",
    image: "https://avatars.githubusercontent.com/u/117855423?v=4",
  },
];

export default function MentorList({ careerPath }: { careerPath: string }) {
  // State
  const [isConnected, setIsConnected] = useState(false);
  const [address, setAddress] = useState("");
  const [selectedMentor, setSelectedMentor] = useState<Mentor | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    message: "",
    type: "success",
  });
  const [mentors, setMentors] = useState<Mentor[]>(MOCK_MENTORS);

  // Toast helper
  const showNotification = (title: string, message: string, type: "success" | "error") => {
    setToastMessage({ title, message, type });
    setShowToast(true);
    setTimeout(() => setShowToast(false), 5000);
  };

  // Network checking
  const checkNetwork = async () => {
    if (!window.ethereum) {
      showNotification("MetaMask Required", "MetaMask is not installed or accessible.", "error");
      return false;
    }

    try {
      const currentChainId = await window.ethereum.request({ method: "eth_chainId" });
      if (currentChainId !== EDUCHAIN_CHAIN_ID) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: EDUCHAIN_CHAIN_ID }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [EDUCHAIN_CONFIG],
            });
          } else {
            throw switchError;
          }
        }
      }
      return true;
    } catch (error) {
      console.error("Error switching network:", error);
      showNotification("Network Error", "Failed to switch to EduChain. Please try again.", "error");
      return false;
    }
  };

  // Wallet connection
  const connectWallet = async () => {
    if (!window.ethereum) {
      showNotification("MetaMask Required", "Please install MetaMask to connect your wallet.", "error");
      return;
    }

    try {
      const networkOk = await checkNetwork();
      if (!networkOk) {
        showNotification("Network Error", "Please switch to EduChain network", "error");
        return;
      }

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      setAddress(accounts[0]);
      setIsConnected(true);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      showNotification("Connection Failed", "Failed to connect wallet. Please try again.", "error");
    }
  };

  // Payment handling
  const handlePayment = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }

    if (!selectedMentor) return;

    setIsPaying(true);
    setTxHash(null);

    try {
      // Get the provider and signer
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      // Create transaction object
      const tx = {
        to: selectedMentor.walletAddress,
        value: ethers.utils.parseEther(selectedMentor.rate.toString()),
      };

      // Estimate gas
      const gasEstimate = await signer.estimateGas(tx);
      
      // Send transaction with estimated gas
      const transaction = await signer.sendTransaction({
        ...tx,
        gasLimit: gasEstimate.mul(120).div(100), // Add 20% buffer to gas estimate
      });

      setTxHash(transaction.hash);
      
      // Wait for transaction to be mined
      await transaction.wait();

      // Update mentor's availability to "Booked"
      setMentors(prevMentors => 
        prevMentors.map(mentor => 
          mentor.id === selectedMentor.id 
            ? { ...mentor, availability: "Booked" }
            : mentor
        )
      );

      showNotification("Payment Successful", "Your booking has been confirmed!", "success");
      setSelectedMentor(null);
    } catch (error: any) {
      console.error("Payment error:", error);
      const errorMessage = error?.message || "Transaction could not be completed. Please try again.";
      showNotification("Payment Failed", errorMessage, "error");
    } finally {
      setIsPaying(false);
    }
  };

  // Wallet event listeners
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: "eth_accounts" }).then((accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        }
      });

      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts.length > 0) {
          setAddress(accounts[0]);
          setIsConnected(true);
        } else {
          setAddress("");
          setIsConnected(false);
        }
      });

      window.ethereum.on("chainChanged", () => {
        window.location.reload();
      });
    }
  }, []);

  return (
    <div className="w-full max-w-4xl mx-auto bg-black border border-white rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-white">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-[#39FF14]" />
          <h2 className="text-xl font-bold text-white">Available Mentors</h2>
        </div>
        <button
          onClick={connectWallet}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
            isConnected ? "border border-gray-200 hover:bg-gray-50" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <Wallet className="h-4 w-4" />
          {isConnected ? <span className="text-white">{`${address.slice(0, 6)}...${address.slice(-4)}`}</span> : "Connect Wallet"}
        </button>
      </div>

      {/* Mentor List */}
      <div className="p-6 space-y-6">
        {mentors.map((mentor) => (
          <div
            key={mentor.id}
            className="flex items-start gap-4 rounded-lg border border-white p-4 transition-colors hover:border-[#39FF14] bg-black"
          >
            <img src={mentor.image || "/placeholder.svg"} alt={mentor.name} className="h-12 w-12 rounded-full" />
            <div className="flex-1 space-y-1">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-white">{mentor.name}</h3>
                  <p className="text-sm text-gray-300">
                    {mentor.role} at {mentor.company}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 text-sm rounded-full ${
                    mentor.availability === "Available" ? "bg-green-900 text-green-300 border border-green-500" : "bg-gray-800 text-gray-300 border border-gray-600"
                  }`}
                >
                  {mentor.availability}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-sm font-medium text-white">{mentor.rate} EDU/hour</span>
                <button
                  onClick={() => setSelectedMentor(mentor)}
                  disabled={mentor.availability !== "Available"}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MessageSquare className="h-4 w-4" />
                  Book Session
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment Modal */}
      {selectedMentor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-black border border-white rounded-xl shadow-lg max-w-md w-full p-6">
            <h3 className="text-xl font-bold mb-4 text-white">Confirm Booking</h3>
            <p className="text-gray-300 mb-6">You're about to book a mentoring session</p>

            <div className="space-y-4">
              <div className="flex items-center gap-4 rounded-lg border border-white p-4">
                <img
                  src={selectedMentor.image || "/placeholder.svg"}
                  alt={selectedMentor.name}
                  className="h-12 w-12 rounded-full"
                />
                <div>
                  <h3 className="font-semibold text-white">{selectedMentor.name}</h3>
                  <p className="text-sm text-gray-300">
                    {selectedMentor.role} at {selectedMentor.company}
                  </p>
                </div>
              </div>

              <div className="rounded-lg border border-white p-4">
                <div className="flex justify-between text-sm">
                  <span className="text-white">Session Rate</span>
                  <span className="font-medium text-white">{selectedMentor.rate} EDU</span>
                </div>
              </div>

              {txHash && (
                <div className="rounded-lg bg-gray-900 border border-[#39FF14] p-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-white">Transaction submitted:</span>
                    <a
                      href={`${EDUCHAIN_CONFIG.blockExplorerUrls[0]}/tx/${txHash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-[#39FF14] hover:underline"
                    >
                      View on Explorer
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}

              <div className="flex justify-end gap-2 pt-4">
                <button
                  onClick={() => setSelectedMentor(null)}
                  disabled={isPaying}
                  className="px-4 py-2 rounded-lg border border-white text-white hover:bg-gray-800 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={isPaying}
                  className="min-w-[100px] px-4 py-2 rounded-lg bg-[#39FF14] text-black hover:bg-[#39FF14]/80 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPaying ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing
                    </>
                  ) : (
                    "Confirm & Pay"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {showToast && (
        <div
          className={`fixed bottom-4 right-4 max-w-md w-full rounded-lg shadow-lg p-4 transition-all transform translate-y-0 border ${
            toastMessage.type === "success" ? "bg-green-900 border-green-500" : "bg-red-900 border-red-500"
          }`}
        >
          <div className="flex gap-2">
            <div className="flex-1">
              <h4 className={`font-medium ${toastMessage.type === "success" ? "text-green-300" : "text-red-300"}`}>
                {toastMessage.title}
              </h4>
              <p className={toastMessage.type === "success" ? "text-green-200" : "text-red-200"}>
                {toastMessage.message}
              </p>
            </div>
            <button onClick={() => setShowToast(false)} className="text-gray-400 hover:text-gray-200">
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
