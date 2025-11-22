import React, { useEffect, useRef } from 'react';
import { createChart, ColorType, CandlestickSeries } from 'lightweight-charts';
import type { IChartApi, ISeriesApi, Time } from 'lightweight-charts';
import type { Candle } from '@/lib/api';

interface CryptoChartProps {
    data: Candle[];
    colors?: {
        backgroundColor?: string;
        lineColor?: string;
        textColor?: string;
        areaTopColor?: string;
        areaBottomColor?: string;
    };
}

export const CryptoChart: React.FC<CryptoChartProps> = ({ data, colors = {} }) => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<IChartApi | null>(null);
    const seriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);

    useEffect(() => {
        if (!chartContainerRef.current) return;

        const handleResize = () => {
            if (chartRef.current && chartContainerRef.current) {
                chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
            }
        };

        const chart = createChart(chartContainerRef.current, {
            layout: {
                background: { type: ColorType.Solid, color: colors.backgroundColor || 'transparent' },
                textColor: colors.textColor || '#d1d5db',
            },
            grid: {
                vertLines: { color: 'rgba(197, 203, 206, 0.1)' },
                horzLines: { color: 'rgba(197, 203, 206, 0.1)' },
            },
            width: chartContainerRef.current.clientWidth,
            height: 400,
            timeScale: {
                timeVisible: true,
                secondsVisible: false,
            },
        });

        const newSeries = chart.addSeries(CandlestickSeries, {
            upColor: '#26a69a',
            downColor: '#ef5350',
            borderVisible: false,
            wickUpColor: '#26a69a',
            wickDownColor: '#ef5350',
        });

        seriesRef.current = newSeries;
        chartRef.current = chart;

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
            chart.remove();
        };
    }, [colors.backgroundColor, colors.textColor]);

    useEffect(() => {
        if (seriesRef.current && data.length > 0) {
            // Ensure data is sorted by time and unique
            const sortedData = [...data].sort((a, b) => (a.time as number) - (b.time as number));
            const uniqueData = sortedData.filter((item, index, self) =>
                index === self.findIndex((t) => t.time === item.time)
            );

            seriesRef.current.setData(uniqueData.map(d => ({
                ...d,
                time: d.time as Time // Cast to Time type for lightweight-charts
            })));

            if (chartRef.current) {
                chartRef.current.timeScale().fitContent();
            }
        }
    }, [data]);

    return <div ref={chartContainerRef} className="w-full h-[400px]" />;
};
