// import { format } from 'date-fns';
import type { Time } from 'lightweight-charts';
import axios from 'axios';

const API_BASE = 'https://api.freecryptoapi.com/v1';
const MOCK_MODE = !import.meta.env.VITE_API_KEY; // Use mock if no key

// Create Axios instance
const apiClient = axios.create({
    baseURL: API_BASE,
    timeout: 20000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add interceptor for Bearer token
apiClient.interceptors.request.use((config) => {
    const token = import.meta.env.VITE_API_KEY;
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export interface Coin {
    name: string;
    symbol: string;
    price: number;
    change24h: number;
    marketCap: number;
    volume24h: number;
    circulatingSupply: number;
}

export interface Candle {
    time: Time; // Unix timestamp or string date
    open: number;
    high: number;
    low: number;
    close: number;
}

// Mock Data Generators
const generateMockCoins = (): Coin[] => {
    const coins = [
        { name: 'Bitcoin', symbol: 'BTC', price: 65000, change: 2.5 },
        { name: 'Ethereum', symbol: 'ETH', price: 3500, change: 1.8 },
        { name: 'Solana', symbol: 'SOL', price: 145, change: 5.2 },
        { name: 'Binance Coin', symbol: 'BNB', price: 600, change: -0.5 },
        { name: 'Cardano', symbol: 'ADA', price: 0.45, change: 1.2 },
        { name: 'Ripple', symbol: 'XRP', price: 0.62, change: -1.1 },
        { name: 'Dogecoin', symbol: 'DOGE', price: 0.16, change: 8.5 },
        { name: 'Polkadot', symbol: 'DOT', price: 7.2, change: 0.8 },
        { name: 'Avalanche', symbol: 'AVAX', price: 35, change: 3.4 },
        { name: 'Shiba Inu', symbol: 'SHIB', price: 0.000025, change: -2.1 },
    ];

    return coins.map(c => ({
        name: c.name,
        symbol: c.symbol,
        price: c.price * (1 + (Math.random() * 0.02 - 0.01)), // Add some jitter
        change24h: c.change + (Math.random() * 1 - 0.5),
        marketCap: c.price * 19000000, // Rough estimate
        volume24h: c.price * 500000,
        circulatingSupply: 19000000,
    }));
};

const generateMockHistory = (days: number = 1): Candle[] => {
    const candles: Candle[] = [];
    let price = 50000;
    const now = Math.floor(Date.now() / 1000);
    const interval = days === 1 ? 3600 : 86400; // 1h for 1d view, 1d for others
    const count = days === 1 ? 24 : days;

    for (let i = count; i >= 0; i--) {
        const time = now - i * interval;
        const volatility = price * 0.02;
        const open = price;
        const close = price + (Math.random() * volatility - volatility / 2);
        const high = Math.max(open, close) + Math.random() * volatility * 0.5;
        const low = Math.min(open, close) - Math.random() * volatility * 0.5;

        candles.push({
            time: time as Time, // Lightweight charts handles numbers as UTCTimestamp
            open,
            high,
            low,
            close
        });
        price = close;
    }
    return candles;
};

export const api = {
    getTopCoins: async (): Promise<Coin[]> => {
        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500)); // Simulate latency
            return generateMockCoins();
        }
        try {
            const response = await apiClient.get('/getCryptoList');
            // Note: Adjust response mapping based on actual API structure
            return response.data.data || response.data;
        } catch (error) {
            console.error("API Error:", error);
            return [];
        }
    },

    getCoinHistory: async (symbol: string, timeframe: '1h' | '24h' | '7d' | '30d'): Promise<Candle[]> => {
        if (MOCK_MODE) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const days = timeframe === '1h' ? 1 / 24 : timeframe === '24h' ? 1 : timeframe === '7d' ? 7 : 30;
            return generateMockHistory(days);
        }
        try {
            // Example endpoint mapping
            const response = await apiClient.get(`/getHistory`, {
                params: { symbol, timeframe }
            });
            return response.data.data || response.data;
        } catch (error) {
            console.error("API Error:", error);
            return [];
        }
    }
};
