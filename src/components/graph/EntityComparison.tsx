import React, { useMemo, useEffect } from 'react';
import ReactFlow, {
  useNodesState,
  Controls,
  Background,
  Panel,
  useReactFlow,
  ReactFlowProvider,
} from 'reactflow';
import type { Node } from 'reactflow';
import 'reactflow/dist/style.css';
import { Button } from '@mantine/core';
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

import { EventNode } from '../entity/event/Node';
import { PersonNode } from '../entity/person/Node';
import { OrganizationNode } from '../entity/organization/Node';
import { WebsiteNode } from '../entity/website/Node';
import { SourceNode } from '../entity/source/Node';

const nodeTypes = {
  event: EventNode,
  person: PersonNode,
  organization: OrganizationNode,
  website: WebsiteNode,
  source: SourceNode,
};

interface EntityComparisonProps {
  entities: any[]; // The raw entity data objects
  onBack: () => void;
}

const getCompareLayout = (nodes: Node[]) => {
  const PADDING = 20;
  const CARD_WIDTH = 100; // Matches node width
  const CARD_HEIGHT = 100; // Matches node height
  const COLS = 4;

  return nodes.map((node, index) => {
    const col = index % COLS;
    const row = Math.floor(index / COLS);

    return {
      ...node,
      position: {
        x: col * (CARD_WIDTH + PADDING),
        y: row * (CARD_HEIGHT + PADDING),
      },
    };
  });
};

const EntityComparisonContent: React.FC<EntityComparisonProps> = ({ entities, onBack }) => {
  const { fitView } = useReactFlow();

  // Transform entities into nodes
  const initialNodes = useMemo(() => {
    return entities.map((item) => ({
      id: item.id || Math.random().toString(),
      type: 'entity',
      data: {
        // We need to reconstruct the data structure expected by EntityNode
        // This assumes 'item' has the necessary fields or we need to pass type info too.
        // Ideally, the parent should pass fully formed nodes or we need type inference here.
        // For this refactor, let's assume 'item' is the node data structure.
        ...item.data,
      },
      position: { x: 0, y: 0 },
      draggable: false, // Lock nodes in grid
    }));
  }, [entities]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);

  // Apply layout on mount
  useEffect(() => {
    const layoutNodes = getCompareLayout(initialNodes);
    setNodes(layoutNodes);

    // Animate zoom in
    setTimeout(() => {
      fitView({ duration: 800, padding: 0.2 });
    }, 100);
  }, [initialNodes, fitView, setNodes]);

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={[]} // No edges in comparison mode
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        fitView
        panOnScroll
        selectionOnDrag={false}
        nodesDraggable={false}
        nodesConnectable={false}
      >
        <Background />
        <Controls />
        <Panel position="top-left">
          <Button
            leftSection={<ArrowLeftIcon style={{ width: 16 }} />}
            onClick={onBack}
            variant="light"
            color="gray"
          >
            Back to Graph
          </Button>
        </Panel>
      </ReactFlow>
    </div>
  );
};

export const EntityComparison: React.FC<EntityComparisonProps> = (props) => {
  return (
    <ReactFlowProvider>
      <EntityComparisonContent {...props} />
    </ReactFlowProvider>
  );
};
