"use client"

import React, { useEffect, useState, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend, ChartData, ChartOptions } from 'chart.js';
import { Bar, Line } from 'react-chartjs-2';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import CSVTable from './CsvTable';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);

interface ChartComponentProps {
  csvData: string;
}

const ChartComponent: React.FC<ChartComponentProps> = ({ csvData }) => {
  const [chartData, setChartData] = useState<ChartData<'bar' | 'line'>>({
    labels: [],
    datasets: [],
  });
  const [chartType, setChartType] = useState<'bar' | 'line' | 'both'>('bar');
  const [chartTitle, setChartTitle] = useState('CSV Data Visualization');
  const [xTitle, setXTitle] = useState('X-Axis');
  const [yTitle, setYTitle] = useState('Y-Axis');
  const [showMovingAverage, setShowMovingAverage] = useState(false);
  const [movingAveragePeriod, setMovingAveragePeriod] = useState(3);

  const chartRef = useRef<ChartJS>(null);

  useEffect(() => {
    if (csvData) {
      const rows = csvData.trim().split('\n').map(row => row.split(','));
      const headers = rows[0];
      const data = rows.slice(1);

      const datasets = headers.map((header, index) => ({
        label: header,
        data: data.map(row => parseFloat(row[index]) || 0),
        backgroundColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},0.5)`,
        borderColor: `rgba(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255},1)`,
        fill: false,
      }));

      setChartData({
        labels: data.map((_, index) => `Row ${index + 1}`),
        datasets,
      });
    }
  }, [csvData]);

  useEffect(() => {
    if (showMovingAverage && chartData.datasets.length > 0) {
      const originalData = chartData.datasets[0].data as number[];
      const movingAverageData = calculateMovingAverage(originalData, movingAveragePeriod);

      const updatedDatasets = [...chartData.datasets];
      updatedDatasets.push({
        label: `${movingAveragePeriod}-period Moving Average`,
        data: movingAverageData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
        fill: false,
        type: 'line' as const,
      });

      setChartData(prevState => ({
        ...prevState,
        datasets: updatedDatasets,
      }));
    } else {
      setChartData(prevState => ({
        ...prevState,
        datasets: prevState.datasets.filter(dataset => dataset.label && !dataset.label.includes('Moving Average')),
      }));
    }
  }, [showMovingAverage, movingAveragePeriod, chartData.datasets]);

  const calculateMovingAverage = (data: number[], period: number) => {
    return data.map((_, index, array) => {
      const start = Math.max(0, index - period + 1);
      const end = index + 1;
      const subset = array.slice(start, end);
      const sum = subset.reduce((acc, val) => acc + val, 0);
      return sum / subset.length;
    });
  };

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

  return (
    <>
    <div className="w-full h-auto p-4 bg-black rounded shadow">
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
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={showMovingAverage}
            onChange={e => setShowMovingAverage(e.target.checked)}
            className="mr-2"
          />
          <label className="text-white">Show Moving Average</label>
        </div>
        {showMovingAverage && (
          <div className="mt-2">
            <label className="block text-white">Moving Average Period:</label>
            <input
              type="number"
              value={movingAveragePeriod}
              onChange={e => setMovingAveragePeriod(parseInt(e.target.value))}
              min="2"
              max="20"
              className="w-full p-2 rounded"
            />
          </div>
        )}
      </div>
      <Button onClick={handleDownload} className="mb-4 p-2 rounded">
        Download Chart
      </Button>
      {chartType === 'bar' && (
        <Bar options={options} data={chartData} ref={chartRef} />
      )}
      {chartType === 'line' && (
        <Line options={options} data={chartData} ref={chartRef} />
      )}
      {chartType === 'both' && (
        <>
          <Bar options={options} data={chartData} ref={chartRef} />
          <Line options={options} data={chartData} ref={chartRef} />
        </>
      )}
      {chartData.datasets.length === 0 && (
        <div className="flex items-center justify-center h-full text-gray-500">
          No data to display
        </div>
      )}
    </div>
    </>
  );
};

export default ChartComponent;