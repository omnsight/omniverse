import 'reactflow/dist/style.css';
import ReactFlow, { Controls, Background, useReactFlow, ReactFlowProvider } from 'reactflow';
import { Box } from '@mantine/core';
import { useCallback, useEffect, useState, type PropsWithChildren } from 'react';
import {
  type NodeChange,
  type EdgeChange,
  type Connection,
  type Node,
  type Edge,
  useOnSelectionChange,
} from 'reactflow';
import type { Entity } from '../models/entity';
import { GraphContextMenu } from './ContextMenu';
import { PersonNode } from './nodes/PersonNode';
import { OrganizationNode } from './nodes/OrganizationNode';
import { EventNode } from './nodes/EventNode';
import { WebsiteNode } from './nodes/WebsiteNode';
import { SourceNode } from './nodes/SourceNode';
import { RelationEdge } from './edges/RelationEdge';

const NodeTypes = {
  person: PersonNode,
  organization: OrganizationNode,
  event: EventNode,
  website: WebsiteNode,
  source: SourceNode,
};

const EdgeTypes = {
  relation: RelationEdge,
};

interface EntityGraphProps extends PropsWithChildren {
  nodes: Node[];
  edges: Edge[];
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onSelection?: (ids: string[]) => void;
  onConnect?: (connection: Connection) => void;
  onCreate?: (entity: Entity) => void;
  hasWritePermission?: boolean;
}

const EntityGraphContent: React.FC<EntityGraphProps> = ({
  nodes,
  edges,
  onNodesChange,
  onEdgesChange,
  onSelection,
  onConnect,
  onCreate,
  hasWritePermission = false,
  children,
}) => {
  const { fitView } = useReactFlow();
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const containerBounds = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: event.clientX - containerBounds.left,
      y: event.clientY - containerBounds.top,
    });
  }, []);

  const handleCreate = (entity: Entity) => {
    if (onCreate) {
      onCreate(entity);
    }
  };

  useOnSelectionChange({
    onChange: ({ nodes: selectedNodes, edges: selectedEdges }) => {
      const allSelectedIds = [...selectedNodes.map((n) => n.id), ...selectedEdges.map((e) => e.id)];
      onSelection?.(allSelectedIds);
    },
  });

  useEffect(() => {
    fitView();
  }, [nodes, edges, fitView]);

  return (
    <Box style={{ height: '100%', width: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={NodeTypes}
        edgeTypes={EdgeTypes}
        onPaneContextMenu={onPaneContextMenu}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
      {menuPosition && (
        <GraphContextMenu
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={() => setMenuPosition(null)}
          onCreate={handleCreate}
          hasWritePermission={hasWritePermission}
        />
      )}
      {children}
    </Box>
  );
};

export const EntityGraph: React.FC<EntityGraphProps> = (props) => {
  return (
    <ReactFlowProvider>
      <EntityGraphContent {...props} />
    </ReactFlowProvider>
  );
};
