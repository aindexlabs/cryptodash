import { useTopCoins } from '@/hooks/useCrypto';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Link } from 'react-router-dom';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

const Home = () => {
    const { data: coins, isLoading, isError } = useTopCoins();

    if (isError) {
        return <div className="p-8 text-center text-red-500">Failed to load crypto data.</div>;
    }

    return (
        <div className="container mx-auto py-8 px-4">
            <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                        Top 10 Cryptocurrencies
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow className="hover:bg-transparent">
                                <TableHead className="w-[50px]">#</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">24h Change</TableHead>
                                <TableHead className="text-right hidden md:table-cell">Market Cap</TableHead>
                                <TableHead className="text-right hidden md:table-cell">Volume (24h)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                Array.from({ length: 10 }).map((_, i) => (
                                    <TableRow key={i}>
                                        <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-20 ml-auto" /></TableCell>
                                        <TableCell><Skeleton className="h-4 w-16 ml-auto" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                                        <TableCell className="hidden md:table-cell"><Skeleton className="h-4 w-24 ml-auto" /></TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                coins?.map((coin, index) => (
                                    <TableRow key={coin.symbol} className="cursor-pointer hover:bg-muted/50 transition-colors">
                                        <TableCell className="font-medium text-muted-foreground">{index + 1}</TableCell>
                                        <TableCell>
                                            <Link to={`/crypto/${coin.symbol}`} className="flex items-center gap-3 group">
                                                <div className="flex flex-col">
                                                    <span className="font-bold group-hover:text-primary transition-colors">{coin.name}</span>
                                                    <span className="text-xs text-muted-foreground">{coin.symbol}</span>
                                                </div>
                                            </Link>
                                        </TableCell>
                                        <TableCell className="text-right font-mono">
                                            ${coin.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 })}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className={cn(
                                                "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
                                                coin.change24h >= 0 ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"
                                            )}>
                                                {coin.change24h >= 0 ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
                                                {Math.abs(coin.change24h).toFixed(2)}%
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right hidden md:table-cell text-muted-foreground">
                                            ${(coin.marketCap / 1e9).toFixed(2)}B
                                        </TableCell>
                                        <TableCell className="text-right hidden md:table-cell text-muted-foreground">
                                            ${(coin.volume24h / 1e6).toFixed(2)}M
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default Home;
