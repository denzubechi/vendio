import { http, createConfig } from "wagmi";
import { base, baseSepolia } from "wagmi/chains";
import {
  coinbaseWallet,
  metaMask,
  walletConnect,
  injected,
  safe,
} from "wagmi/connectors";
import { farcasterMiniApp } from "@farcaster/miniapp-wagmi-connector";

export function getConfig() {
  return createConfig({
    chains: [base, baseSepolia],
    connectors: [
      farcasterMiniApp(),
      coinbaseWallet({
        appName: "Vendio",
        preference: "all",
      }),
      metaMask(),
      walletConnect({
        projectId:
          process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ||
          "4cc53a01d40ad4850a382034c72ea252",
        showQrModal: false,
      }),
      injected(),
      safe(),
    ],
    transports: {
      [base.id]: http(),
      [baseSepolia.id]: http(),
    },
  });
}

declare module "wagmi" {
  interface Register {
    config: ReturnType<typeof getConfig>;
  }
}

export const wagmiConfig = getConfig();
