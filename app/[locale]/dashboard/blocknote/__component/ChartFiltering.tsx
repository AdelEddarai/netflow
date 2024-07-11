"use client"

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface ChartComponentProps {
    csvData: string;
    searchTerm: string;
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
    numericFilters: { [key: string]: { condition: '>' | '<'; value: number } | null };
    setNumericFilters: React.Dispatch<React.SetStateAction<{ [key: string]: { condition: '>' | '<'; value: number } | null }>>;
}

const ChartFiltering: React.FC<ChartComponentProps> = ({ csvData, searchTerm, setSearchTerm, numericFilters, setNumericFilters }) => {
    const [chartData, setChartData] = useState<ChartData<'bar' | 'line'>>({
        labels: [],
        datasets: [],
    });
    const [chartType, setChartType] = useState<'bar' | 'line' | 'both'>('bar');
    const [chartTitle, setChartTitle] = useState('CSV Data Visualization');
    const [xTitle, setXTitle] = useState('X-Axis');
    const [yTitle, setYTitle] = useState('Y-Axis');


    const chartRef = useRef<ChartJS>(null);

    const rows = useMemo(() => csvData.trim().split('\n').map(row => row.split(',')), [csvData]);
    const headers = useMemo(() => rows[0], [rows]);
    const initialData = useMemo(() => rows.slice(1), [rows]);

    const filteredData = useMemo(() => {
        return initialData.filter(row => {
            // Apply search filter
            const matchesSearch = row.some(cell =>
                cell.toLowerCase().includes(searchTerm.toLowerCase())
            );

            // Apply numeric filters
            const matchesNumericFilters = Object.entries(numericFilters).every(([colIndex, filter]) => {
                if (!filter) return true;
                const cellValue = parseFloat(row[parseInt(colIndex)]);
                if (isNaN(cellValue)) return true;
                return filter.condition === '>' ? cellValue > filter.value : cellValue < filter.value;
            });

            return matchesSearch && matchesNumericFilters;
        });
    }, [initialData, searchTerm, numericFilters]);

    useEffect(() => {
        const datasets = headers.map((header, index) => ({
            label: header,
            data: filteredData.map(row => parseFloat(row[index]) || 0),
            backgroundColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`,
            borderColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1)`,
            fill: false,
        }));

        setChartData({
            labels: filteredData.map((_, index) => `Row ${index + 1}`),
            datasets,
        });
    }, [filteredData, headers]);



    const options: ChartOptions<'bar' | 'line'> = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top' as const,
            },
            title: {
                display: true,
                text: chartTitle,
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: xTitle,
                },
            },
            y: {
                title: {
                    display: true,
                    text: yTitle,
                },
            },
        },
    };

    const handleDownload = () => {
        if (chartRef.current) {
            const link = document.createElement('a');
            link.download = 'chart.png';
            link.href = chartRef.current.toBase64Image();
            link.click();
        }
    };

    const handleNumericFilterChange = (colIndex: number, condition: '>' | '<', value: string) => {
        setNumericFilters(prev => ({
            ...prev,
            [colIndex]: value ? { condition, value: parseFloat(value) } : null
        }));
    };

    return (
        <>
            <div className="w-full h-auto p-4 bg-black rounded shadow">
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Search..."
                        className="p-2 border rounded"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="mb-4 flex flex-wrap">
                    {headers.map((header, index) => (
                        <div key={index} className="mr-4 mb-2">
                            <span className="text-white">{header}:</span>
                            <input
                                type="number"
                                placeholder=">"
                                className="w-16 p-1 ml-1 text-xs border rounded"
                                onChange={(e) => handleNumericFilterChange(index, '>', e.target.value)}
                            />
                            <input
                                type="number"
                                placeholder="<"
                                className="w-16 p-1 ml-1 text-xs border rounded"
                                onChange={(e) => handleNumericFilterChange(index, '<', e.target.value)}
                            />
                        </div>
                    ))}
                </div>
                <DropdownMenu>
                    <DropdownMenuTrigger><Button>Switch</Button></DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <DropdownMenuLabel>Chart Type</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => setChartType('bar')}>Bar</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setChartType('line')}>Line</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setChartType('both')}>Both</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <div className="my-4">
                    <label className="block text-white">Chart Title:</label>
                    <input
                        type="text"
                        value={chartTitle}
                        onChange={e => setChartTitle(e.target.value)}
                        className="w-full p-2 rounded"
                    />
                    <label className="block text-white">X-Axis Title:</label>
                    <input
                        type="text"
                        value={xTitle}
                        onChange={e => setXTitle(e.target.value)}
                        className="w-full p-2 rounded"
                    />
                    <label className="block text-white">Y-Axis Title:</label>
                    <input
                        type="text"
                        value={yTitle}
                        onChange={e => setYTitle(e.target.value)}
                        className="w-full p-2 rounded"
                    />
                    
                </div>

                {chartType === 'bar' && <Bar ref={chartRef} options={options} data={chartData} />}
                {chartType === 'line' && <Line ref={chartRef} options={options} data={chartData} />}
                {chartType === 'both' && (
                    <>
                        <Bar ref={chartRef} options={options} data={chartData} />
                        <Line ref={chartRef} options={options} data={chartData} />
                    </>
                )}
                <Button onClick={handleDownload}>Download Chart</Button>

            </div>
        </>
    );
};

export default ChartFiltering;
