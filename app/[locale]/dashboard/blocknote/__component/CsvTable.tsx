"use client"

import React, { useEffect, useState, useMemo } from 'react';
import { BarElement, CategoryScale, Chart as ChartJS, LinearScale, LineElement, PointElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Input } from '@/components/ui/input';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, Title, Tooltip, Legend);



interface CSVTableProps {
  csvData: string;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  numericFilters: { [key: string]: { condition: '>' | '<'; value: number } | null };
  setNumericFilters: React.Dispatch<React.SetStateAction<{ [key: string]: { condition: '>' | '<'; value: number } | null }>>;
}

const CSVTable: React.FC<CSVTableProps> = ({ csvData, searchTerm, setSearchTerm, numericFilters, setNumericFilters }) => {
  const [selectedColumnIndex, setSelectedColumnIndex] = useState<number | null>(null);
  const [secondColumnIndex, setSecondColumnIndex] = useState<number | null>(null);
  const [sortColumn, setSortColumn] = useState<string>('');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [statResult, setStatResult] = useState<{ title: string; value: string } | null>(null);
  const [chartData, setChartData] = useState<any>(null);
  const [correlationData, setCorrelationData] = useState<any>(null);

  const rows = useMemo(() => csvData.trim().split('\n').map(row => row.split(',')), [csvData]);
  const headers = useMemo(() => rows[0], [rows]);
  const initialData = useMemo(() => rows.slice(1), [rows]);

  const sortedData = useMemo(() => {
    if (!sortColumn) return initialData;

    const columnIndex = headers.findIndex(header => header === sortColumn);
    return [...initialData].sort((a, b) => {
      const aValue = parseFloat(a[columnIndex]);
      const bValue = parseFloat(b[columnIndex]);

      if (isNaN(aValue) || isNaN(bValue)) {
        const aString = String(a[columnIndex] || '').toLowerCase();
        const bString = String(b[columnIndex] || '').toLowerCase();
        return sortDirection === 'asc' ? aString.localeCompare(bString) : bString.localeCompare(aString);
      }

      return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
    });
  }, [initialData, headers, sortColumn, sortDirection]);

  const filteredData = useMemo(() => {
    return sortedData.filter(row => {
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
  }, [sortedData, searchTerm, numericFilters]);

  const calculateCorrelationMatrix = () => {
    const numericColumns = headers.map((_, index) => index).filter(index =>
      filteredData.every(row => !isNaN(parseFloat(row[index])))
    );

    const correlationMatrix = numericColumns.map(col1 =>
      numericColumns.map(col2 => parseFloat(calculateCorrelation(col1, col2)))
    );

    setCorrelationData({
      matrix: correlationMatrix,
      labels: numericColumns.map(index => headers[index])
    });
  };

  const handleStatCalculation = (statFunction: (columnIndex: number) => string, title: string) => {
    if (selectedColumnIndex !== null) {
      const result = statFunction(selectedColumnIndex);
      setStatResult({ title, value: result });
      setChartData([
        { name: title, value: parseFloat(result) }
      ]);
    }
  };

  const handleCorrelation = () => {
    calculateCorrelationMatrix();
  };

  const handleNumericFilterChange = (colIndex: number, condition: '>' | '<', value: string) => {
    setNumericFilters(prev => ({
      ...prev,
      [colIndex]: value ? { condition, value: parseFloat(value) } : null
    }));
  };

  const handleColumnSelect = (columnIndex: number) => {
    setSelectedColumnIndex(columnIndex);
  };

  const calculateSum = (columnIndex: number): string => {
    if (columnIndex === null || isNaN(columnIndex)) return "0.00";
    const sum = filteredData.reduce((sum, row) => {
      const cellValue = parseFloat(row[columnIndex]);
      return !isNaN(cellValue) ? sum + cellValue : sum;
    }, 0);
    return sum.toFixed(2);
  };

  const calculateAverage = (columnIndex: number): string => {
    if (columnIndex === null || isNaN(columnIndex)) return '0';
    const sum = filteredData.reduce((acc, row) => {
      const cellValue = parseFloat(row[columnIndex]);
      return !isNaN(cellValue) ? acc + cellValue : acc;
    }, 0);
    return (sum / filteredData.length).toFixed(2);
  };

  const calculateMedian = (columnIndex: number): string => {
    if (columnIndex === null || isNaN(columnIndex)) return '0';
    const sortedValues = filteredData
      .map(row => parseFloat(row[columnIndex]))
      .filter(value => !isNaN(value))
      .sort((a, b) => a - b);
    const mid = Math.floor(sortedValues.length / 2);
    return sortedValues.length % 2 === 0
      ? ((sortedValues[mid - 1] + sortedValues[mid]) / 2).toFixed(2)
      : sortedValues[mid].toFixed(2);
  };

  const calculateStandardDeviation = (columnIndex: number): string => {
    if (columnIndex === null || isNaN(columnIndex)) return '0';
    const values = filteredData
      .map(row => parseFloat(row[columnIndex]))
      .filter(value => !isNaN(value));
    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const squaredDiffs = values.map(value => Math.pow(value - mean, 2));
    const variance = squaredDiffs.reduce((sum, value) => sum + value, 0) / values.length;
    return Math.sqrt(variance).toFixed(2);
  };

  const calculateCorrelation = (columnIndex1: number, columnIndex2: number): string => {
    if (columnIndex1 === null || columnIndex2 === null || isNaN(columnIndex1) || isNaN(columnIndex2)) return '0';
    const pairs = filteredData
      .map(row => [parseFloat(row[columnIndex1]), parseFloat(row[columnIndex2])])
      .filter(pair => !pair.some(isNaN));

    const n = pairs.length;
    const [sumX, sumY] = pairs.reduce(([accX, accY], [x, y]) => [accX + x, accY + y], [0, 0]);
    const [sumXX, sumYY, sumXY] = pairs.reduce(
      ([accXX, accYY, accXY], [x, y]) => [accXX + x * x, accYY + y * y, accXY + x * y],
      [0, 0, 0]
    );

    const numerator = n * sumXY - sumX * sumY;
    const denominator = Math.sqrt((n * sumXX - sumX * sumX) * (n * sumYY - sumY * sumY));

    return (numerator / denominator).toFixed(4);
  };


  const calculateOutliers = (columnIndex: number): { outliers: number[], lowerBound: number, upperBound: number } => {
    const values = filteredData
      .map(row => parseFloat(row[columnIndex]))
      .filter(value => !isNaN(value))
      .sort((a, b) => a - b);

    const q1 = values[Math.floor(values.length / 4)];
    const q3 = values[Math.floor(3 * values.length / 4)];
    const iqr = q3 - q1;
    const lowerBound = q1 - 1.5 * iqr;
    const upperBound = q3 + 1.5 * iqr;

    const outliers = values.filter(value => value < lowerBound || value > upperBound);

    return { outliers, lowerBound, upperBound };
  };

  const calculateFrequencyDistribution = (columnIndex: number, bins: number = 10): { labels: string[], frequencies: number[] } => {
    const values = filteredData
      .map(row => parseFloat(row[columnIndex]))
      .filter(value => !isNaN(value));

    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;
    const binWidth = range / bins;

    const frequencies = new Array(bins).fill(0);
    const labels = [];

    for (let i = 0; i < bins; i++) {
      const binStart = min + i * binWidth;
      const binEnd = binStart + binWidth;
      labels.push(`${binStart.toFixed(2)} - ${binEnd.toFixed(2)}`);

      frequencies[i] = values.filter(value => value >= binStart && value < binEnd).length;
    }

    return { labels, frequencies };
  };

  const calculateZScores = (columnIndex: number): number[] => {
    const values = filteredData
      .map(row => parseFloat(row[columnIndex]))
      .filter(value => !isNaN(value));

    const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
    const stdDev = Math.sqrt(values.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / values.length);

    return values.map(value => (value - mean) / stdDev);
  };



  const handleSort = (column: string) => {
    if (column === sortColumn) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };


  return (
    <div className="w-full h-auto p-4 mt-4 bg-black shadow overflow-x-auto border rounded-md">
      {/* Dialog settings */}
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Open Settings</Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="max-w-[90vw] max-h-[90vh] flex flex-col">
          <AlertDialogHeader className="flex-shrink-0">
            <AlertDialogTitle>Data Analysis Settings</AlertDialogTitle>
          </AlertDialogHeader>
          <AlertDialogDescription className="flex-grow overflow-y-auto">
            <div className="space-y-4">
              <div className="flex justify-between space-x-4">
                <div>
                  <label className="mr-2">First Column:</label>
                  <select className="p-1 border rounded" onChange={(e) => setSelectedColumnIndex(parseInt(e.target.value))} value={selectedColumnIndex ?? -1}>
                    <option value={-1}>-- Select Column --</option>
                    {headers.map((header, index) => (
                      <option key={index} value={index}>{header}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mr-2">Second Column (for Correlation):</label>
                  <select className="p-1 border rounded" onChange={(e) => setSecondColumnIndex(parseInt(e.target.value))} value={secondColumnIndex ?? -1}>
                    <option value={-1}>-- Select Column --</option>
                    {headers.map((header, index) => (
                      <option key={index} value={index}>{header}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Input
                  type="text"
                  placeholder="Search..."
                  className="w-full p-2 border rounded"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {headers.map((header, index) => (
                  <div key={index} className="space-y-1">
                    <span className="text-sm font-medium">{header}:</span>
                    <div className="flex space-x-2">
                      <Input
                        type="number"
                        placeholder=">"
                        className="w-full p-1 text-xs border rounded"
                        onChange={(e) => handleNumericFilterChange(index, '>', e.target.value)}
                      />
                      <Input
                        type="number"
                        placeholder="<"
                        className="w-full p-1 text-xs border rounded"
                        onChange={(e) => handleNumericFilterChange(index, '<', e.target.value)}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={() => handleStatCalculation(calculateSum, 'Sum')}>Sum</Button>
                <Button onClick={() => handleStatCalculation(calculateAverage, 'Average')}>Average</Button>
                <Button onClick={() => handleStatCalculation(calculateMedian, 'Median')}>Median</Button>
                <Button onClick={() => handleStatCalculation(calculateStandardDeviation, 'Standard Deviation')}>Std Dev</Button>
                <Button onClick={handleCorrelation}>Correlation Matrix</Button>
              </div>

              {statResult && chartData && (
                <Card>
                  <CardHeader>
                    <CardTitle>{statResult.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{statResult.value}</p>
                  </CardContent>
                </Card>
              )}

              {correlationData && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>Correlation Heatmap</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <svg width={correlationData.labels.length * 60} height={correlationData.labels.length * 60}>
                        {correlationData.matrix.map((row: number[], i: number) =>
                          row.map((value: number, j: number) => (
                            <g key={`${i}-${j}`}>
                              <rect
                                x={j * 60}
                                y={i * 60}
                                width={60}
                                height={60}
                                fill={`rgb(${255 - Math.abs(value) * 255}, ${255 - Math.abs(value) * 255}, 255)`}
                              />
                              <text x={j * 60 + 30} y={i * 60 + 30} textAnchor="middle" dominantBaseline="middle" fill="black">
                                {value.toFixed(2)}
                              </text>
                            </g>
                          ))
                        )}
                        {correlationData.labels.map((label: string, i: number) => (
                          <React.Fragment key={`label-${i}`}>
                            <text x={-10} y={i * 60 + 30} textAnchor="end" dominantBaseline="middle">{label}</text>
                            <text x={i * 60 + 30} y={correlationData.labels.length * 60 + 20} textAnchor="middle">{label}</text>
                          </React.Fragment>
                        ))}
                      </svg>
                    </div>
                  </CardContent>
                </Card>
              )}

              {chartData && chartData.datasets && (
                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle>{chartData.datasets[0].label}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div style={{ height: '400px' }}>
                      {chartData.datasets[0].label === 'Frequency' ? (
                        <Bar data={chartData} options={{ responsive: true, maintainAspectRatio: false, borderColor: 'rgba(75, 192, 75, 1)' }} />
                      ) : (
                        <Scatter data={chartData} options={{
                          responsive: true,
                          maintainAspectRatio: false,
                          scales: {
                            x: { type: 'linear', position: 'bottom' },
                            y: { type: 'linear', position: 'left' }
                          }
                        }} />
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="mt-4 flex space-x-2">
                {/* ... (previous buttons) */}
                <Button onClick={() => {
                  const result = calculateOutliers(selectedColumnIndex!);
                  setStatResult({
                    title: 'Outliers',
                    value: `Lower bound: ${result.lowerBound.toFixed(2)}, Upper bound: ${result.upperBound.toFixed(2)}, Outliers: ${result.outliers.join(', ')}`
                  });
                }}>Detect Outliers</Button>
                <Button onClick={() => {
                  const { labels, frequencies } = calculateFrequencyDistribution(selectedColumnIndex!);
                  setChartData({ labels, datasets: [{ label: 'Frequency', data: frequencies, backgroundColor: 'rgba(0, 255, 0, 0.6)' }] });
                }}>Frequency Distribution</Button>
                <Button onClick={() => {
                  const zScores = calculateZScores(selectedColumnIndex!);
                  setChartData({
                    datasets: [{
                      label: 'Z-Scores',
                      data: zScores.map((score, index) => ({ x: index, y: score })),
                      backgroundColor: 'rgba(0, 255, 0, 0.6)'
                    }]
                  });
                }}>Z-Scores</Button>
              </div>


              {statResult && chartData && (
                <Card>
                  <CardHeader>
                    <CardTitle>{statResult.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p>{statResult.value}</p>
                  </CardContent>
                </Card>
              )}

            </div>
          </AlertDialogDescription>
          <AlertDialogFooter className="flex-shrink-0">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      );


      <div className="mb-4 flex justify-end space-x-4">
        <div>
          <label className="mr-2">First Column:</label>
          <select className="p-1 border rounded" onChange={(e) => setSelectedColumnIndex(parseInt(e.target.value))} value={selectedColumnIndex ?? -1}>
            <option value={-1}>-- Select Column --</option>
            {headers.map((header, index) => (
              <option key={index} value={index}>{header}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="mr-2">Second Column (for Correlation):</label>
          <select className="p-1 border rounded" onChange={(e) => setSecondColumnIndex(parseInt(e.target.value))} value={secondColumnIndex ?? -1}>
            <option value={-1}>-- Select Column --</option>
            {headers.map((header, index) => (
              <option key={index} value={index}>{header}</option>
            ))}
          </select>
        </div>
      </div>

      <table className="min-w-full">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b border-gray-200">#</th>
            {headers.map((header, index) => (
              <th key={index} className="py-2 px-4 border-b border-gray-200 cursor-pointer" onClick={() => handleSort(header)}>
                <div className="flex flex-col items-center">
                  <span>{header}</span>
                  {sortColumn === header && (
                    <span className="mt-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredData.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="py-2 px-4 border-b border-gray-200">{rowIndex + 1}</td>
              {row.map((cell, cellIndex) => (
                <td key={cellIndex} className={`py-2 px-4 border-b border-gray-200 ${selectedColumnIndex === cellIndex ? 'bg-blue-200 text-black' : ''}`}>{cell}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* <div className="mt-4 flex space-x-2">
        <Button onClick={() => handleStatCalculation(calculateSum, 'Sum')}>Sum</Button>
        <Button onClick={() => handleStatCalculation(calculateAverage, 'Average')}>Average</Button>
        <Button onClick={() => handleStatCalculation(calculateMedian, 'Median')}>Median</Button>
        <Button onClick={() => handleStatCalculation(calculateStandardDeviation, 'Standard Deviation')}>Std Dev</Button>
        <Button onClick={handleCorrelation}>Correlation Matrix</Button>
      </div> */}


      {statResult && chartData && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>{statResult.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{statResult.value}</p>
          </CardContent>
        </Card>
      )}

      {/* {correlationData && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle>Correlation Heatmap</CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ width: '100%', height: '400px', overflowX: 'auto' }}>
              <svg width={correlationData.labels.length * 60} height={correlationData.labels.length * 60}>
                {correlationData.matrix.map((row: number[], i: number) =>
                  row.map((value: number, j: number) => (
                    <g key={`${i}-${j}`}>
                      <rect
                        x={j * 60}
                        y={i * 60}
                        width={60}
                        height={60}
                        fill={`rgb(${255 - Math.abs(value) * 255}, ${255 - Math.abs(value) * 255}, 255)`}
                      />
                      <text x={j * 60 + 30} y={i * 60 + 30} textAnchor="middle" dominantBaseline="middle" fill="black">
                        {value.toFixed(2)}
                      </text>
                    </g>
                  ))
                )}
                {correlationData.labels.map((label: string, i: number) => (
                  <React.Fragment key={`label-${i}`}>
                    <text x={-10} y={i * 60 + 30} textAnchor="end" dominantBaseline="middle">{label}</text>
                    <text x={i * 60 + 30} y={correlationData.labels.length * 60 + 20} textAnchor="middle">{label}</text>
                  </React.Fragment>
                ))}
              </svg>
            </div>
          </CardContent>
        </Card>
      )} */}

    </div>
  );
};

export default CSVTable;
