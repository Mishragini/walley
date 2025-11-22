"use server";

import { BUNGEE_BASE_URL, CHAIN_IDS, NATIVE_TOKENS, BUNGEE_QUOTE_URL, BUNGEE_BUILD_TX_URL, BUNGEE_API_KEY, BUNGEE_AFFILIATE, NODE_ENV } from "@/lib/config";
import axios from "axios";

interface quoteParams {
    userAddress: string;
    originChainId: number;
    destinationChainId: number;
    inputToken: string;
    inputAmount: string;
    receiverAddress: string;
    outputToken: string;
    enableManual: boolean;
    disableSwapping: boolean;
    disableAuto: boolean;
}

interface buildTxParams {
    quoteId: string
}

interface GetQuoteParams {
    userAddress: string,
    to: string,
    from: string,
    inputAmount: string,
    receiverAddress: string
}

function getChainIdAndToken(network: string) {
    switch (network) {
        case "solana":
            return { chainId: CHAIN_IDS.SOL, token: NATIVE_TOKENS.SOL }
        case "ethereum":
            return { chainId: CHAIN_IDS.ETH, token: NATIVE_TOKENS.ETH }
        default:
            throw new Error("Network not supported.")
    }
}

const baseURL = BUNGEE_BASE_URL

function axiosToCurl(url: string, params?: quoteParams | buildTxParams, headers?: Record<string, string>): string {
    let curlCommand = `curl -X GET "${url}`;

    // Add query parameters
    if (params) {
        const queryString = new URLSearchParams(
            Object.entries(params).reduce((acc, [key, value]) => {
                acc[key] = String(value);
                return acc;
            }, {} as Record<string, string>)
        ).toString();
        if (queryString) {
            curlCommand += `?${queryString}`;
        }
    }

    curlCommand += '"';

    // Add headers
    if (headers) {
        Object.entries(headers).forEach(([key, value]) => {
            curlCommand += ` \\\n  -H "${key}: ${value}"`;
        });
    }

    return curlCommand;
}


export async function getQuote({ userAddress, to, from, inputAmount, receiverAddress }: GetQuoteParams) {
    console.log("amount.......", inputAmount)
    const quoteUrl = baseURL + BUNGEE_QUOTE_URL
    const { chainId: originChainId, token: inputToken } = getChainIdAndToken(from)
    const { chainId: destinationChainId, token: outputToken } = getChainIdAndToken(to)

    console.log("quoteurl....", quoteUrl)

    const params = {
        userAddress,
        originChainId,
        destinationChainId,
        inputToken,
        inputAmount,
        receiverAddress,
        outputToken,
        enableManual: true,
        disableSwapping: true,
        disableAuto: true
    };

    const headers = NODE_ENV === "development" ? undefined : {
        "x-api-key": BUNGEE_API_KEY!,
        "affiliate": BUNGEE_AFFILIATE!

    }
    console.log("Curl command:", axiosToCurl(quoteUrl, params, headers))

    const quoteResponse = await axios.get(quoteUrl, {
        params,
        headers
    })


    if (!quoteResponse || !quoteResponse?.data?.success) {
        throw new Error("Failed to fetch quote")
    }

    console.log("quoteResponse.data.result", quoteResponse.data.result)

    return quoteResponse.data.result;
}

export async function buildTx(quoteId: string) {
    const buildTxUrl = baseURL + BUNGEE_BUILD_TX_URL;
    const headers = NODE_ENV === "development" ? undefined : {
        "x-api-key": BUNGEE_API_KEY!,
        "affiliate": BUNGEE_AFFILIATE!

    }

    const params = {
        quoteId
    }
    console.log("Curl command:", axiosToCurl(buildTxUrl, params, headers))

    const buildTxResponse = await axios.get(buildTxUrl, {
        params, headers
    })

    console.log("buildTxResponse", buildTxResponse)

    if (!buildTxResponse || !buildTxResponse.data || !buildTxResponse.data.success) {
        throw new Error("Build Transaction failed.")

    }

    return buildTxResponse.data.result;
}

