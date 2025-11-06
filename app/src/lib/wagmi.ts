import { createConfig, createStorage, http, cookieStorage, noopStorage } from "wagmi";
import { mainnet } from "wagmi/chains";
import { coinbaseWallet, injected, walletConnect } from "wagmi/connectors";
import { defineChain } from "viem";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || "";

// Define Hanzo Network chains
export const hanzoMainnet = defineChain({
  id: 36963,
  name: "Hanzo Network Mainnet",
  nativeCurrency: { name: "AI", symbol: "AI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc.hanzo.network"] },
  },
  blockExplorers: {
    default: {
      name: "Hanzo Network Explorer",
      url: "https://explorer.hanzo.network",
    },
  },
});

export const hanzoTestnet = defineChain({
  id: 36962,
  name: "Hanzo Network Testnet",
  nativeCurrency: { name: "AI", symbol: "AI", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://rpc-testnet.hanzo.network"] },
  },
  blockExplorers: {
    default: {
      name: "Hanzo Network Testnet Explorer",
      url: "https://explorer-testnet.hanzo.network",
    },
  },
  testnet: true,
});

// Localhost for testing with Foundry/Anvil
export const localhost = defineChain({
  id: 31337,
  name: "Localhost",
  nativeCurrency: { name: "Ether", symbol: "ETH", decimals: 18 },
  rpcUrls: {
    default: { http: ["http://127.0.0.1:8545"] },
  },
  testnet: true,
});

export function getConfig() {
  return createConfig({
    chains: [localhost, mainnet, hanzoMainnet, hanzoTestnet],
    connectors: [
      injected(),
      coinbaseWallet({ appName: "Hanzo Network Faucet" }),
      walletConnect({ projectId }),
    ],
    // Use noopStorage for SSR to completely disable persistence on server
    storage: createStorage({
      storage: typeof window !== "undefined" ? cookieStorage : noopStorage,
    }),
    ssr: true,
    transports: {
      [localhost.id]: http(),
      [mainnet.id]: http(),
      [hanzoMainnet.id]: http(),
      [hanzoTestnet.id]: http(),
    },
  });
}

export const config = getConfig();

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
