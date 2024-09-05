"use client"

import React from 'react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ChartProps = {
  data: any[];
  title?: string;
  chartType: 'line' | 'bar';
  xAxisKey: string;
  yAxisKeys: string[];
};

const ChartVisualizer: React.FC<ChartProps> = ({ 
  data, 
  title, 
  chartType,
  xAxisKey,
  yAxisKeys
}) => {
  const colors = [
    '#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088FE', '#00C49F', '#FFBB28', '#FF8042',
    '#a4de6c', '#d0ed57', '#ffc658', '#ff7300', '#8dd1e1', '#a4de6c', '#d0ed57', '#82ca9d'
  ];

  const ChartComponent = chartType === 'bar' ? BarChart : LineChart;

  return (
    <div className="chart-container p-4 rounded-lg shadow-md">
      {title && <h2 className="chart-title text-2xl font-bold mb-4 text-center text-gray-800">{title}</h2>}
      <ResponsiveContainer width="100%" height={400}>
        <ChartComponent data={data}>
          <XAxis
            dataKey={xAxisKey}
            label={{ value: xAxisKey, position: 'insideBottom', offset: -5 }}
            tick={{ fill: '#666' }}
          />
          <YAxis
            label={{ value: 'Values', angle: -90, position: 'insideLeft' }}
            tick={{ fill: '#666' }}
          />
          <Tooltip contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '5px' }} />
          <Legend />
          {yAxisKeys.map((key, index) => (
            chartType === 'bar' ? (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
              />
            ) : (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                activeDot={{ r: 8 }}
              />
            )
          ))}
        </ChartComponent>
      </ResponsiveContainer>
    </div>
  );
};

export default ChartVisualizer;