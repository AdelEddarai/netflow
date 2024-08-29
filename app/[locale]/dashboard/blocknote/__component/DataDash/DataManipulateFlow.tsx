"use client"

import React, { useState, useCallback, useEffect } from 'react';
import ReactFlow, { 
  Node,
  Edge,
  Connection,
  addEdge,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  Handle,
  Position,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface NodeData {
  label: string;
  column?: string;
  operation?: string;
  value?: string;
}

interface CustomNodeProps {
  id: string;
  data: NodeData;
}

const DataSourceNode: React.FC<CustomNodeProps> = ({ data }) => (
  <div className="border-2 border-gray-300 rounded p-2">
    <Handle type="source" position={Position.Bottom} />
    <h3 className="font-bold">Data Source</h3>
    <p>{data.label}</p>
  </div>
);

const FilterNode: React.FC<CustomNodeProps> = ({ id, data }) => {
  const updateNodeData = useCallback((field: string, value: string) => {
    const event = new CustomEvent('updateNodeData', {
      detail: { id, field, value },
    });
    window.dispatchEvent(event);
  }, [id]);

  return (
    <div className="border-2 border-gray-300 rounded p-2">
      <Handle type="target" position={Position.Top} />
      <h3 className="font-bold">Filter</h3>
      <Select
        value={data.column || ''}
        onValueChange={(value) => updateNodeData('column', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Column" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="column1">Column 1</SelectItem>
          <SelectItem value="column2">Column 2</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={data.operation || ''}
        onValueChange={(value) => updateNodeData('operation', value)}
      >
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
        onChange={(e) => updateNodeData('value', e.target.value)}
        placeholder="Value"
        className="border border-gray-300 rounded px-2 py-1 mt-1"
      />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const AggregateNode: React.FC<CustomNodeProps> = ({ id, data }) => {
  const updateNodeData = useCallback((field: string, value: string) => {
    const event = new CustomEvent('updateNodeData', {
      detail: { id, field, value },
    });
    window.dispatchEvent(event);
  }, [id]);

  return (
    <div className="border-2 border-gray-300 rounded p-2">
      <Handle type="target" position={Position.Top} />
      <h3 className="font-bold">Aggregate</h3>
      <Select
        value={data.column || ''}
        onValueChange={(value) => updateNodeData('column', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Column" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="column1">Column 1</SelectItem>
          <SelectItem value="column2">Column 2</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={data.operation || ''}
        onValueChange={(value) => updateNodeData('operation', value)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select Operation" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="sum">Sum</SelectItem>
          <SelectItem value="average">Average</SelectItem>
          <SelectItem value="count">Count</SelectItem>
        </SelectContent>
      </Select>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

const nodeTypes = {
  dataSource: DataSourceNode,
  filter: FilterNode,
  aggregate: AggregateNode,
};

interface DataManipulationWorkflowProps {
  csvData: any[];
  onDataChange: (newData: any[]) => void;
}

const DataManipulationWorkflow: React.FC<DataManipulationWorkflowProps> = ({ csvData, onDataChange }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    setNodes([
      {
        id: '1',
        type: 'dataSource',
        data: { label: 'CSV Data' },
        position: { x: 250, y: 5 },
      },
    ]);
  }, []);

  useEffect(() => {
    const handleUpdateNodeData = (event: CustomEvent) => {
      const { id, field, value } = event.detail;
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === id) {
            return {
              ...node,
              data: { ...node.data, [field]: value },
            };
          }
          return node;
        })
      );
    };

    window.addEventListener('updateNodeData', handleUpdateNodeData as EventListener);

    return () => {
      window.removeEventListener('updateNodeData', handleUpdateNodeData as EventListener);
    };
  }, []);

  const onConnect = useCallback((params: Connection | Edge) => {
    setEdges((eds) => addEdge(params, eds));
  }, [setEdges]);

  const addNode = (type: string) => {
    const newNode: Node = {
      id: (nodes.length + 1).toString(),
      type,
      data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      position: { x: 250, y: nodes.length * 100 + 50 },
    };
    setNodes((nds) => [...nds, newNode]);
  };

  const processWorkflow = useCallback(() => {
    let processedData = [...csvData];

    const sortedNodes = topologicalSort(nodes, edges);

    sortedNodes.forEach((node) => {
      if (node.type === 'filter') {
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
      } else if (node.type === 'aggregate') {
        const columnValues = processedData.map((row) => parseFloat(row[node.data.column]) || 0);
        switch (node.data.operation) {
          case 'sum':
            processedData = [{ result: columnValues.reduce((a, b) => a + b, 0) }];
            break;
          case 'average':
            processedData = [{ result: columnValues.reduce((a, b) => a + b, 0) / columnValues.length }];
            break;
          case 'count':
            processedData = [{ result: columnValues.length }];
            break;
        }
      }
    });

    onDataChange(processedData);
  }, [csvData, nodes, edges, onDataChange]);

  const topologicalSort = (nodes: Node[], edges: Edge[]): Node[] => {
    const sorted: Node[] = [];
    const visited = new Set<string>();

    const visit = (node: Node) => {
      if (visited.has(node.id)) return;
      visited.add(node.id);

      const outgoingEdges = edges.filter((edge) => edge.source === node.id);
      outgoingEdges.forEach((edge) => {
        const targetNode = nodes.find((n) => n.id === edge.target);
        if (targetNode) visit(targetNode);
      });

      sorted.unshift(node);
    };

    nodes.forEach((node) => {
      if (!visited.has(node.id)) visit(node);
    });

    return sorted;
  };

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
        <Button onClick={() => addNode('filter')}>Add Filter</Button>
        <Button onClick={() => addNode('aggregate')}>Add Aggregate</Button>
        <Button onClick={processWorkflow}>Process Workflow</Button>
      </div>
    </div>
  );
};

export default DataManipulationWorkflow;