import axios from 'axios';

const KRAKEN_BASE_URL = import.meta.env.VITE_KRAKEN_API_BASE_URL || 'https://api.kraken.com';

// Create Kraken API client
export const krakenClient = axios.create({
    baseURL: KRAKEN_BASE_URL,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Mapping of standard symbols to Kraken pair names
export const KRAKEN_PAIRS: Record<string, string> = {
    'BTC': 'XXBTZUSD',
    'ETH': 'XETHZUSD',
    'SOL': 'SOLUSD',
    'BNB': 'BNBUSD',
    'ADA': 'ADAUSD',
    'XRP': 'XRPUSD',
    'DOGE': 'XDGUSD',
    'DOT': 'DOTUSD',
    'AVAX': 'AVAXUSD',
    'SHIB': 'SHIBUSD',
    'MATIC': 'MATICUSD',
    'LTC': 'XLTCZUSD',
    'LINK': 'LINKUSD',
    'UNI': 'UNIUSD',
    'ATOM': 'ATOMUSD',
};

// Reverse mapping for normalization
export const KRAKEN_SYMBOL_MAP: Record<string, string> = Object.entries(KRAKEN_PAIRS).reduce(
    (acc, [symbol, pair]) => ({ ...acc, [pair]: symbol }),
    {} as Record<string, string>
);

/**
 * Get Kraken pair name from standard symbol
 */
export const getKrakenPair = (symbol: string): string => {
    return KRAKEN_PAIRS[symbol.toUpperCase()] || `${symbol}USD`;
};

/**
 * Normalize Kraken symbol to standard format
 * e.g., XXBTZUSD -> BTC, XETHZUSD -> ETH
 */
export const normalizeKrakenSymbol = (krakenSymbol: string): string => {
    return KRAKEN_SYMBOL_MAP[krakenSymbol] || krakenSymbol;
};

// Type definitions for Kraken API responses

export interface KrakenAssetInfo {
    aclass: string;
    altname: string;
    decimals: number;
    display_decimals: number;
}

export interface KrakenAssetsResponse {
    error: string[];
    result: Record<string, KrakenAssetInfo>;
}

export interface KrakenTickerInfo {
    a: [string, string, string]; // ask [price, whole lot volume, lot volume]
    b: [string, string, string]; // bid [price, whole lot volume, lot volume]
    c: [string, string]; // last trade closed [price, lot volume]
    v: [string, string]; // volume [today, last 24 hours]
    p: [string, string]; // volume weighted average price [today, last 24 hours]
    t: [number, number]; // number of trades [today, last 24 hours]
    l: [string, string]; // low [today, last 24 hours]
    h: [string, string]; // high [today, last 24 hours]
    o: string; // today's opening price
}

export interface KrakenTickerResponse {
    error: string[];
    result: Record<string, KrakenTickerInfo>;
}

export interface KrakenOHLCData {
    time: number;
    open: string;
    high: string;
    low: string;
    close: string;
    vwap: string;
    volume: string;
    count: number;
}

export interface KrakenOHLCResponse {
    error: string[];
    result: Record<string, [number, string, string, string, string, string, string, number][] | number>;
}

/**
 * Fetch ticker data for multiple pairs
 */
export const getTickerData = async (pairs: string[]): Promise<KrakenTickerResponse> => {
    const pairString = pairs.join(',');
    const response = await krakenClient.get<KrakenTickerResponse>('/0/public/Ticker', {
        params: { pair: pairString },
    });
    return response.data;
};

/**
 * Fetch OHLC (candlestick) data for a pair
 */
export const getOHLCData = async (
    pair: string,
    interval: number = 1
): Promise<KrakenOHLCResponse> => {
    const response = await krakenClient.get<KrakenOHLCResponse>('/0/public/OHLC', {
        params: { pair, interval },
    });
    return response.data;
};

/**
 * Map timeframe to Kraken interval
 */
export const getKrakenInterval = (timeframe: '1h' | '24h' | '7d' | '30d'): number => {
    const intervalMap = {
        '1h': 1,    // 1 minute
        '24h': 5,   // 5 minutes
        '7d': 60,   // 1 hour
        '30d': 1440 // 1 day
    };
    return intervalMap[timeframe];
};
