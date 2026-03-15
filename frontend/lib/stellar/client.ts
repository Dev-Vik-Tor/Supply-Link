import {
  getPublicKey,
  isConnected,
  signTransaction,
} from "@stellar/freighter-api";

export async function getWalletAddress(): Promise<string | null> {
  const connected = await isConnected();
  if (!connected) return null;
  return getPublicKey();
}

export { signTransaction };

export const CONTRACT_ID =
  process.env.NEXT_PUBLIC_CONTRACT_ID ??
  "CBUWSKT2UGOAXK4ZREVDJV5XHSYB42PZ3CERU2ZFUTUMAZLJEHNZIECA";

export const NETWORK_PASSPHRASE =
  process.env.NEXT_PUBLIC_NETWORK_PASSPHRASE ??
  "Test SDF Network ; September 2015";

export const RPC_URL =
  process.env.NEXT_PUBLIC_RPC_URL ?? "https://soroban-testnet.stellar.org";
