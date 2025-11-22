import { useQuery } from '@tanstack/react-query';
import { api } from '@/lib/api';
import type { Coin, Candle } from '@/lib/api';

export const useTopCoins = () => {
    return useQuery<Coin[]>({
        queryKey: ['topCoins'],
        queryFn: api.getTopCoins,
        refetchInterval: 30000, // 30 seconds
    });
};

export const useCoinHistory = (symbol: string, timeframe: '1h' | '24h' | '7d' | '30d') => {
    return useQuery<Candle[]>({
        queryKey: ['coinHistory', symbol, timeframe],
        queryFn: () => api.getCoinHistory(symbol, timeframe),
        refetchInterval: 10000, // 10 seconds
        enabled: !!symbol,
    });
};
