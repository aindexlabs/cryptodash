import axios from 'axios';

const COINGECKO_BASE_URL = import.meta.env.VITE_COINGECKO_API_BASE_URL || 'https://api.coingecko.com/api/v3';

// Create CoinGecko API client
export const coinGeckoClient = axios.create({
    baseURL: COINGECKO_BASE_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mapping of standard symbols to CoinGecko IDs
export const COINGECKO_IDS: Record<string, string> = {
    'BTC': 'bitcoin',
    'ETH': 'ethereum',
    'SOL': 'solana',
    'BNB': 'binancecoin',
    'ADA': 'cardano',
    'XRP': 'ripple',
    'DOGE': 'dogecoin',
    'DOT': 'polkadot',
    'AVAX': 'avalanche-2',
    'SHIB': 'shiba-inu',
    'MATIC': 'matic-network',
    'LTC': 'litecoin',
    'LINK': 'chainlink',
    'UNI': 'uniswap',
    'ATOM': 'cosmos',
};

// Reverse mapping
export const COINGECKO_SYMBOL_MAP: Record<string, string> = Object.entries(COINGECKO_IDS).reduce(
    (acc, [symbol, id]) => ({ ...acc, [id]: symbol }),
    {} as Record<string, string>
);

/**
 * Get CoinGecko ID from standard symbol
 */
export const getCoinGeckoId = (symbol: string): string => {
    return COINGECKO_IDS[symbol.toUpperCase()] || symbol.toLowerCase();
};

// Type definitions for CoinGecko API responses

export interface CoinGeckoMarketData {
    id: string;
    symbol: string;
    name: string;
    image: string;
    current_price: number;
    market_cap: number;
    market_cap_rank: number;
    fully_diluted_valuation: number | null;
    total_volume: number;
    high_24h: number;
    low_24h: number;
    price_change_24h: number;
    price_change_percentage_24h: number;
    market_cap_change_24h: number;
    market_cap_change_percentage_24h: number;
    circulating_supply: number;
    total_supply: number | null;
    max_supply: number | null;
    ath: number;
    ath_change_percentage: number;
    ath_date: string;
    atl: number;
    atl_change_percentage: number;
    atl_date: string;
    roi: null | {
        times: number;
        currency: string;
        percentage: number;
    };
    last_updated: string;
}

/**
 * Fetch market data for top coins by market cap
 */
export const getMarketData = async (
    vsCurrency: string = 'usd',
    perPage: number = 100,
    page: number = 1
): Promise<CoinGeckoMarketData[]> => {
    const response = await coinGeckoClient.get<CoinGeckoMarketData[]>('/coins/markets', {
        params: {
            vs_currency: vsCurrency,
            order: 'market_cap_desc',
            per_page: perPage,
            page: page,
            sparkline: false,
        },
    });
    return response.data;
};

/**
 * Get market data for specific coins by IDs
 */
export const getMarketDataByIds = async (
    ids: string[],
    vsCurrency: string = 'usd'
): Promise<CoinGeckoMarketData[]> => {
    const idsString = ids.join(',');
    const response = await coinGeckoClient.get<CoinGeckoMarketData[]>('/coins/markets', {
        params: {
            vs_currency: vsCurrency,
            ids: idsString,
            order: 'market_cap_desc',
            sparkline: false,
        },
    });
    return response.data;
};
