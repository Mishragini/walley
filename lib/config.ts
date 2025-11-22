export const NODE_ENV = process.env.NODE_ENV

export const SOL_RPC_ENDPOINT = process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_SOLANA_DEVNET_RPC_URL
    : process.env.NEXT_PUBLIC_SOLANA_MAINNET_RPC_URL;

export const ETH_RPC_ENDPOINT = process.env.NODE_ENV === "development"
    ? process.env.NEXT_PUBLIC_ETHEREUM_SEPOLIA_RPC_URL
    : process.env.NEXT_PUBLIC_ETHEREUM_MAINNET_RPC_URL;

export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY || ""

export const BUNGEE_BASE_URL = process.env.NODE_ENV === "development"
    ? process.env.BUNGEE_PUBLIC_URL : process.env.BUNGEE_BACKEND_PROD_URL

export const BUNGEE_QUOTE_URL = "api/v1/bungee/quote"
export const BUNGEE_BUILD_TX_URL = "api/v1/bungee/build-tx"

export const BUNGEE_API_KEY = process.env.BUNGEE_API_KEY
export const BUNGEE_AFFILIATE = process.env.BUNGEE_AFFILIATE

export const CHAIN_IDS = {
    ETH: 1,
    SOL: 89999
}

export const NATIVE_TOKENS = {
    ETH: "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",
    SOL: "So11111111111111111111111111111111111111112",
};