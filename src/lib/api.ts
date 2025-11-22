import type { Time } from 'lightweight-charts';
import {
    getTickerData,
    getOHLCData,
    getKrakenPair,
    getKrakenInterval
} from '@/services/kraken';
import {
    getMarketData,
    COINGECKO_IDS
} from '@/services/coingecko';

const MOCK_MODE = import.meta.env.VITE_USE_MOCK === 'true';

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
            // Get market data from CoinGecko for top coins
            const marketData = await getMarketData('usd', 100, 1);

            // Filter to only coins we have Kraken pairs for
            const supportedCoins = marketData.filter(coin =>
                COINGECKO_IDS[coin.symbol.toUpperCase()]
            );

            // Get the symbols we want to fetch from Kraken
            const symbols = supportedCoins
                .slice(0, 10)
                .map(coin => coin.symbol.toUpperCase());

            // Get Kraken pairs for these symbols
            const krakenPairs = symbols.map(symbol => getKrakenPair(symbol));

            // Fetch ticker data from Kraken
            const tickerResponse = await getTickerData(krakenPairs);

            if (tickerResponse.error && tickerResponse.error.length > 0) {
                console.error('Kraken API Error:', tickerResponse.error);
                return [];
            }

            // Merge Kraken price data with CoinGecko market data
            const coins: Coin[] = [];

            for (const coin of supportedCoins.slice(0, 10)) {
                const symbol = coin.symbol.toUpperCase();
                const krakenPair = getKrakenPair(symbol);
                const tickerData = tickerResponse.result[krakenPair];

                if (tickerData) {
                    // Use Kraken price, CoinGecko for everything else
                    const currentPrice = parseFloat(tickerData.c[0]);
                    const openPrice = parseFloat(tickerData.o);
                    const change24h = ((currentPrice - openPrice) / openPrice) * 100;

                    coins.push({
                        name: coin.name,
                        symbol: symbol,
                        price: currentPrice,
                        change24h: change24h,
                        marketCap: coin.market_cap,
                        volume24h: coin.total_volume,
                        circulatingSupply: coin.circulating_supply,
                    });
                } else {
                    // Fallback to CoinGecko data only
                    coins.push({
                        name: coin.name,
                        symbol: symbol,
                        price: coin.current_price,
                        change24h: coin.price_change_percentage_24h,
                        marketCap: coin.market_cap,
                        volume24h: coin.total_volume,
                        circulatingSupply: coin.circulating_supply,
                    });
                }
            }

            return coins;
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
            const krakenPair = getKrakenPair(symbol);
            const interval = getKrakenInterval(timeframe);

            const ohlcResponse = await getOHLCData(krakenPair, interval);

            if (ohlcResponse.error && ohlcResponse.error.length > 0) {
                console.error('Kraken OHLC Error:', ohlcResponse.error);
                return [];
            }

            // Get the OHLC data array (the key is the pair name)
            const ohlcData = ohlcResponse.result[krakenPair];

            // Type guard: ensure we have an array, not the 'last' timestamp
            if (!ohlcData || typeof ohlcData === 'number' || !Array.isArray(ohlcData) || ohlcData.length === 0) {
                return [];
            }

            // Transform Kraken OHLC format to our Candle format
            // Kraken format: [time, open, high, low, close, vwap, volume, count]
            const candles: Candle[] = ohlcData.map((item: [number, string, string, string, string, string, string, number]) => ({
                time: item[0] as Time,
                open: parseFloat(item[1]),
                high: parseFloat(item[2]),
                low: parseFloat(item[3]),
                close: parseFloat(item[4]),
            }));

            return candles;
        } catch (error) {
            console.error("API Error:", error);
            return [];
        }
    }
};
