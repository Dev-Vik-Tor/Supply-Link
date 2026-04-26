"use client";

import { useState } from "react";
import { ExternalLink } from "lucide-react";
import { getWalletAddress } from "@/lib/stellar/client";
import { getWalletNetwork, isNetworkMatching, getNetworkName } from "@/lib/stellar/network";
import { getXlmBalance, formatBalance } from "@/lib/stellar/balance";
import { accountUrl } from "@/lib/stellar/explorer";
import { useStore } from "@/lib/state/store";

export function WalletConnect() {
  const { walletAddress, setWalletAddress, xlmBalance, setXlmBalance, setNetworkMismatch } =
    useStore();
  const [loading, setLoading] = useState(false);

  async function connect() {
    setLoading(true);
    try {
      const address = await getWalletAddress();
      setWalletAddress(address);

      if (address) {
        // Check network
        const networkInfo = await getWalletNetwork();
        if (networkInfo && !isNetworkMatching(networkInfo.passphrase)) {
          setNetworkMismatch(true);
        } else {
          setNetworkMismatch(false);
        }

        // Fetch balance
        try {
          const balance = await getXlmBalance(address);
          setXlmBalance(balance);
        } catch (error) {
          console.error("Failed to fetch balance:", error);
        }
      }
    } finally {
      setLoading(false);
    }
  }

  if (walletAddress) {
    return (
      <div className="flex items-center gap-2">
        <button
          onClick={() => openExplorerLink(accountUrl(walletAddress))}
          className="text-sm font-mono text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 flex items-center gap-1 transition-colors"
          title="View on Stellar Expert"
        >
          {walletAddress.slice(0, 6)}…{walletAddress.slice(-4)}
          <ExternalLink size={14} />
        </button>
        {xlmBalance && (
          <span className="text-xs text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
            {formatBalance(xlmBalance)}
          </span>
        )}
      </div>
    );
  }

  return (
    <button
      onClick={connect}
      disabled={loading}
      className="px-4 py-2 bg-violet-600 text-white rounded-lg text-sm disabled:opacity-50 hover:bg-violet-700 transition-colors"
    >
      {loading ? "Connecting…" : "Connect Freighter"}
    </button>
  );
}

function openExplorerLink(url: string): void {
  window.open(url, "_blank", "noopener,noreferrer");
}
