"use client"

import React, { useState, useCallback } from 'react';
import ReactFlow, { 
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FilterNode = ({ data, isConnectable }) => {
  return (
    <div className="border-2 border-gray-300 rounded p-2">
      <h3 className="font-bold">Filter</h3>
      <Select value={data.column || ''} onValueChange={(value) => data.onChange('column', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Column" />
        </SelectTrigger>
        <SelectContent>
          {data.columns.map((col) => (
            <SelectItem key={col} value={col}>{col}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={data.operation || ''} onValueChange={(value) => data.onChange('operation', value)}>
        <SelectTrigger>
          <SelectValue placeholder="Select Operation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="equals">Equals</SelectItem>
          <SelectItem value="greaterThan">Greater Than</SelectItem>
          <SelectItem value="lessThan">Less Than</SelectItem>
        </SelectContent>
      </Select>
      <input
        type="text"
        value={data.value || ''}
        onChange={(e) => data.onChange('value', e.target.value)}
        placeholder="Value"
        className="border border-gray-300 rounded px-2 py-1 mt-1"
      />
    </div>
  );
};

const nodeTypes = {
  filter: FilterNode,
};

const DataManipulationWorkflow = ({ csvData, onDataChange }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback((params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  const addFilterNode = useCallback(() => {
    const newNode = {
      id: `filter-${nodes.length + 1}`,
      type: 'filter',
      data: { 
        columns: Object.keys(csvData[0] || {}),
        onChange: (field, value) => {
          setNodes((nds) =>
            nds.map((node) =>
              node.id === newNode.id ? { ...node, data: { ...node.data, [field]: value } } : node
            )
          );
        },
      },
      position: { x: 250, y: nodes.length * 150 },
    };
    setNodes((nds) => [...nds, newNode]);
  }, [nodes, csvData, setNodes]);

  const processWorkflow = useCallback(() => {
    let processedData = [...csvData];
    nodes.forEach((node) => {
      if (node.type === 'filter' && node.data.column && node.data.operation && node.data.value) {
        processedData = processedData.filter((row) => {
          const columnValue = row[node.data.column];
          const filterValue = node.data.value;
          switch (node.data.operation) {
            case 'equals':
              return columnValue === filterValue;
            case 'greaterThan':
              return columnValue > filterValue;
            case 'lessThan':
              return columnValue < filterValue;
            default:
              return true;
          }
        });
      }
    });
    onDataChange(processedData);
  }, [csvData, nodes, onDataChange]);

  return (
    <div style={{ height: '500px', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
      >
        <Background />
        <Controls />
      </ReactFlow>
      <div className="mt-4 space-x-2">
        <Button onClick={addFilterNode}>Add Filter</Button>
        <Button onClick={processWorkflow}>Process Workflow</Button>
      </div>
    </div>
  );
};

export default DataManipulationWorkflow;