import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useCoinHistory, useTopCoins } from '@/hooks/useCrypto';
import { CryptoChart } from '@/components/CryptoChart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeftIcon, ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Detail = () => {
    const { symbol } = useParams<{ symbol: string }>();
    const [timeframe, setTimeframe] = useState<'1h' | '24h' | '7d' | '30d'>('24h');

    // In a real app, we might have a specific getCoinDetails endpoint.
    // Here we reuse the top coins list to find metadata.
    const { data: coins } = useTopCoins();
    const coin = coins?.find(c => c.symbol === symbol);

    const { data: history, isLoading: isHistoryLoading } = useCoinHistory(symbol || '', timeframe);

    if (!symbol) return <div>Invalid symbol</div>;

    return (
        <div className="container mx-auto py-8 px-4 space-y-6">
            <Link to="/">
                <Button variant="ghost" className="gap-2 pl-0 hover:pl-2 transition-all">
                    <ArrowLeftIcon className="w-4 h-4" /> Back to Dashboard
                </Button>
            </Link>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Main Chart Section */}
                <Card className="md:col-span-2 border-none shadow-lg bg-card/50 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-bold flex items-center gap-2">
                                {coin ? (
                                    <>
                                        {coin.name} <span className="text-muted-foreground text-lg font-normal">/ USD</span>
                                    </>
                                ) : (
                                    <Skeleton className="h-8 w-48" />
                                )}
                            </CardTitle>
                            <CardDescription>
                                {coin?.symbol} Price Chart
                            </CardDescription>
                        </div>
                        <div className="flex gap-2 bg-muted/50 p-1 rounded-lg">
                            {(['1h', '24h', '7d', '30d'] as const).map((tf) => (
                                <button
                                    key={tf}
                                    onClick={() => setTimeframe(tf)}
                                    className={cn(
                                        "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                        timeframe === tf
                                            ? "bg-background shadow-sm text-foreground"
                                            : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    {tf.toUpperCase()}
                                </button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardContent>
                        {isHistoryLoading ? (
                            <Skeleton className="w-full h-[400px] rounded-lg" />
                        ) : (
                            <div className="rounded-lg overflow-hidden border bg-background/50">
                                <CryptoChart
                                    data={history || []}
                                    colors={{
                                        backgroundColor: 'transparent',
                                        textColor: 'rgba(156, 163, 175, 1)', // gray-400
                                    }}
                                />
                            </div>
                        )}
                    </CardContent>
                </Card>

                {/* Stats Section */}
                <div className="space-y-6">
                    <Card className="border-none shadow-md bg-card/50 backdrop-blur-sm">
                        <CardHeader>
                            <CardTitle>Market Stats</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {coin ? (
                                <>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Current Price</span>
                                        <span className="font-mono font-bold text-lg">
                                            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">24h Change</span>
                                        <div className={cn(
                                            "flex items-center gap-1 font-medium",
                                            coin.change24h >= 0 ? "text-green-500" : "text-red-500"
                                        )}>
                                            {coin.change24h >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                                            {Math.abs(coin.change24h).toFixed(2)}%
                                        </div>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Market Cap</span>
                                        <span className="font-mono">
                                            ${(coin.marketCap / 1e9).toFixed(2)}B
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-border/50">
                                        <span className="text-muted-foreground">Volume (24h)</span>
                                        <span className="font-mono">
                                            ${(coin.volume24h / 1e6).toFixed(2)}M
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-muted-foreground">Circulating Supply</span>
                                        <span className="font-mono">
                                            {(coin.circulatingSupply / 1e6).toFixed(2)}M {coin.symbol}
                                        </span>
                                    </div>
                                </>
                            ) : (
                                Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="flex justify-between py-2">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-32" />
                                    </div>
                                ))
                            )}
                        </CardContent>
                    </Card>

                    <Card className="bg-primary text-primary-foreground border-none">
                        <CardHeader>
                            <CardTitle className="text-lg">About {coin?.name || 'Crypto'}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm opacity-90 leading-relaxed">
                                {coin?.name} is a decentralized digital currency. This dashboard provides real-time tracking of its performance metrics including price action, volume, and market capitalization.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Detail;
