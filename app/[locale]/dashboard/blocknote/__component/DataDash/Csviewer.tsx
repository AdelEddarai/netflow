"use client"

import React, { useState, useCallback, useMemo, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import Papa from 'papaparse';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { ArrowUpDown, MoreHorizontal, Paintbrush, Maximize2, X, Download } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DialogClose } from '@radix-ui/react-dialog';
import html2canvas from 'html2canvas';
import DataManipulationWorkflow from './DataManipulateFlow';

type PapaParseResult = {
  data: any[][];
  errors: any[];
  meta: any;
};

type SortConfig = {
  key: string;
  direction: 'asc' | 'desc';
} | null;

const CSVViewer = () => {
  const [csvData, setCsvData] = useState<any[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [showChart, setShowChart] = useState(false);
  const [xAxis, setXAxis] = useState<string>('');
  const [yAxis, setYAxis] = useState<string>('');
  const [fileUploaded, setFileUploaded] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>(null);
  const [cellColors, setCellColors] = useState<{ [key: string]: string }>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [showWorkflow, setShowWorkflow] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);



  // to download chart as image
  const chartRef = useRef(null);
  const downloadChartAsPNG = () => {
    if (chartRef.current) {
      html2canvas(chartRef.current).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'chart.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    Papa.parse(file, {
      complete: (result: PapaParseResult) => {
        console.log('Parsed result:', result);
        if (result.data && Array.isArray(result.data) && result.data.length > 0) {
          setHeaders(result.data[0] as string[]);
          setCsvData(result.data.slice(1) as any[]);
          setFileUploaded(true);
          setXAxis(result.data[0][0] as string);
          setYAxis(result.data[0][1] as string);
        } else {
          console.error('Invalid CSV structure:', result);
        }
      },
      error: (error: any) => {
        console.error('Error parsing CSV:', error);
      },
      header: false,
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const sortedData = useMemo(() => {
    let sortableItems = [...csvData];
    if (sortConfig !== null) {
      sortableItems.sort((a, b) => {
        if (a[headers.indexOf(sortConfig.key)] < b[headers.indexOf(sortConfig.key)]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[headers.indexOf(sortConfig.key)] > b[headers.indexOf(sortConfig.key)]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [csvData, sortConfig, headers]);

  const filteredData = useMemo(() => {
    return sortedData.filter(row =>
      row.some((cell: any) =>
        cell.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [sortedData, searchTerm]);

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'asc'
    ) {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const renderChart = () => {
    if (!xAxis || !yAxis) return null;

    const chartData = filteredData.map(row => ({
      [xAxis]: row[headers.indexOf(xAxis)],
      [yAxis]: parseFloat(row[headers.indexOf(yAxis)])
    }));

    return (
      <div ref={chartRef}>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={chartData}>
            <XAxis dataKey={xAxis} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={yAxis} stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
        <Button onClick={downloadChartAsPNG} className="mt-2">
          <Download className="mr-2 h-4 w-4" />
          Download Chart as PNG
        </Button>
      </div>
    );
  };

  const colorCell = (rowIndex: number, cellIndex: number, color: string) => {
    setCellColors(prev => ({
      ...prev,
      [`${rowIndex}-${cellIndex}`]: color
    }));
  };

  const handleDataChange = (newData: any[]) => {
    setProcessedData(newData);
    // Update chart data if needed
    if (xAxis && yAxis) {
      const newChartData = newData.map(row => ({
        [xAxis]: row[headers.indexOf(xAxis)],
        [yAxis]: parseFloat(row[headers.indexOf(yAxis)])
      }));
      // Update your chart state here
    }
  };

  const renderTable = (data: any[]) => (
    <Table>
      <TableHeader>
        <TableRow>
          {headers.map((header, index) => (
            <TableHead key={index}>{header}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.slice(0, 10).map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell: any, cellIndex: number) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  // const renderTable = (fullScreen: boolean = false) => (
  //   <Table className={fullScreen ? "w-full" : "mb-4"}>
  //     <TableHeader>
  //       <TableRow>
  //         {headers.map((header, index) => (
  //           <TableHead key={index} className="cursor-pointer" onClick={() => requestSort(header)}>
  //             <div className="flex items-center">
  //               {header}
  //               <ArrowUpDown className="ml-2 h-4 w-4" />
  //             </div>
  //           </TableHead>
  //         ))}
  //       </TableRow>
  //     </TableHeader>
  //     <TableBody>
  //       {(fullScreen ? filteredData : filteredData.slice(0, 10)).map((row, rowIndex) => (
  //         <TableRow key={rowIndex}>
  //           {row.map((cell: any, cellIndex: number) => (
  //             <TableCell 
  //               key={cellIndex} 
  //               style={{backgroundColor: cellColors[`${rowIndex}-${cellIndex}`] || 'inherit'}}
  //             >
  //               <div className="flex items-center justify-between">
  //                 {cell}
  //                 <Popover>
  //                   <PopoverTrigger>
  //                     <MoreHorizontal className="h-4 w-4" />
  //                   </PopoverTrigger>
  //                   <PopoverContent className="w-40">
  //                     <div className="flex flex-col space-y-2">
  //                       <Button 
  //                         onClick={() => colorCell(rowIndex, cellIndex, 'lightblue')}
  //                         className="flex items-center"
  //                       >
  //                         <Paintbrush className="mr-2 h-4 w-4" />
  //                         Color Blue
  //                       </Button>
  //                       <Button 
  //                         onClick={() => colorCell(rowIndex, cellIndex, 'lightgreen')}
  //                         className="flex items-center"
  //                       >
  //                         <Paintbrush className="mr-2 h-4 w-4" />
  //                         Color Green
  //                       </Button>
  //                       <Button 
  //                         onClick={() => colorCell(rowIndex, cellIndex, 'lightyellow')}
  //                         className="flex items-center"
  //                       >
  //                         <Paintbrush className="mr-2 h-4 w-4" />
  //                         Color Yellow
  //                       </Button>
  //                     </div>
  //                   </PopoverContent>
  //                 </Popover>
  //               </div>
  //             </TableCell>
  //           ))}
  //         </TableRow>
  //       ))}
  //     </TableBody>
  //   </Table>
  // );

  return (
    <div className="p-4">
      {!fileUploaded && (
        <div {...getRootProps()} className="border-2 border-dashed border-gray-300 p-4 mb-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          <p>Drag n drop a CSV file here, or click to select one</p>
        </div>
      )}

      {fileUploaded && (
        <>
          <Button onClick={() => setFileUploaded(false)} className="mb-4">
            Upload New File
          </Button>
        </>
      )}

      {csvData.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">CSV Data</h2>
            <Button variant="outline" onClick={() => setShowWorkflow(!showWorkflow)} className="mr-2">
                {showWorkflow ? 'Hide Workflow' : 'Show Workflow'}
              </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <Maximize2 className="mr-2 h-4 w-4" />
                  View Full Table
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90vw] max-w-[1200px] h-[80vh] max-h-[800px]">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle>Full CSV Data</DialogTitle>
                  <Input
                    type="text"
                    placeholder="Search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-4"
                  />
                  <DialogClose asChild>
                  </DialogClose>

                </DialogHeader>
                <ScrollArea className="h-[calc(80vh-100px)] max-h-[700px]">
                  {renderTable(csvData)}
                </ScrollArea>
              </DialogContent>
            </Dialog>
          </div>

          {renderTable(csvData)}

          <div className="flex space-x-4 mb-4">
            <Select onValueChange={setXAxis} value={xAxis}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select X-Axis" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select onValueChange={setYAxis} value={yAxis}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select Y-Axis" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((header) => (
                  <SelectItem key={header} value={header}>{header}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button onClick={() => setShowChart(!showChart)}>
              {showChart ? 'Hide Chart' : 'Show Chart'}
            </Button>
          </div>

          {showChart && renderChart()}
          
          {showWorkflow && (
            <div className="mb-4">
              <DataManipulationWorkflow csvData={csvData} onDataChange={handleDataChange} />
            </div>
          )}

          {/* <h3 className="text-xl font-bold mt-10">Original Data</h3>
          <div className='mt-6'>
          {renderTable(csvData)}
          </div> */}
          

          {processedData.length > 0 && (
            <>
              <h3 className="text-xl font-bold ">Processed Data</h3>
              {renderTable(processedData)}
            </>
          )}

        </>
      )}
    </div>
  );
};



export default CSVViewer;