import { useAccount } from "wagmi";

/**
 * A hook to get the currently connected wallet address.
 * Returns the address if a wallet is connected, otherwise returns null.
 * @returns {string | null} The connected wallet address or null.
 */
export const useGetConnectedWalletAddress = () => {
  const { address, isConnected } = useAccount();

  if (isConnected) {
    return address;
  }

  return null;
};
