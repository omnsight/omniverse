import 'reactflow/dist/style.css';
import ReactFlow, {
  Controls,
  Background,
  useReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
} from 'reactflow';
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
import type { Entity } from '../forms/entityForm/entity';
import { GraphContextMenu } from './ContextMenu';
import { PersonNode } from './nodes/PersonNode';
import { OrganizationNode } from './nodes/OrganizationNode';
import { EventNode } from './nodes/EventNode';
import { WebsiteNode } from './nodes/WebsiteNode';
import { SourceNode } from './nodes/SourceNode';
import { RelationEdge } from './edges/RelationEdge';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

type OperationType = 'move' | 'connect' | 'remove' | 'create';

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
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
  onSelection?: (ids: string[]) => void;
  onCreate?: (entity: Entity) => void;
  onRemove?: (ids: string[], isEdge: boolean) => void;
  allowOperations: OperationType[];
  hasWritePermission?: boolean;
}

const EntityGraphContent: React.FC<EntityGraphProps> = ({
  nodes,
  edges,
  setNodes,
  setEdges,
  onSelection,
  onCreate,
  onRemove,
  allowOperations,
  hasWritePermission = false,
  children,
}) => {
  const { t } = useTranslation();
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

  useOnSelectionChange({
    onChange: ({ nodes: selectedNodes, edges: selectedEdges }) => {
      const allSelectedIds = [...selectedNodes.map((n) => n.id), ...selectedEdges.map((e) => e.id)];
      onSelection?.(allSelectedIds);
    },
  });

  useEffect(() => {
    fitView();
  }, [nodes, edges, fitView]);

  const handleNodeChanges = (changes: NodeChange[]) => {
    const otherChanges = changes.filter(
      (c) => c.type !== 'select' && c.type !== 'remove' && c.type !== 'add',
    );
    if (allowOperations.includes('move')) {
      setNodes(applyNodeChanges(otherChanges, nodes));
    }

    const removeChanges = changes.filter((c) => c.type === 'remove');
    if (allowOperations.includes('remove') && removeChanges.length > 0) {
      if (!hasWritePermission) {
        notifications.show({
          message: t('components.graph.remove.noPermission'),
          color: 'red',
        });
      } else {
        onRemove?.(
          removeChanges.map((rc) => rc.id),
          false,
        );
      }
    }
  };

  const handleEdgeChanges = (changes: EdgeChange[]) => {
    const otherChanges = changes.filter(
      (c) => c.type !== 'select' && c.type !== 'remove' && c.type !== 'add',
    );
    if (allowOperations.includes('move')) {
      setEdges(applyEdgeChanges(otherChanges, edges));
    }

    const removeChanges = changes.filter((c) => c.type === 'remove');
    if (allowOperations.includes('remove') && removeChanges.length > 0) {
      if (!hasWritePermission) {
        notifications.show({
          message: t('components.graph.remove.noPermission'),
          color: 'red',
        });
      } else {
        onRemove?.(
          removeChanges.map((rc) => rc.id),
          true,
        );
      }
    }
  };

  const handleConnection = (connection: Connection) => {
    if (!hasWritePermission) {
      notifications.show({
        message: t('components.graph.connect.noPermission'),
        color: 'red',
      });
    } else {
      onCreate?.({
        type: 'Relation',
        data: {
          _from: connection.source,
          _to: connection.target,
        },
      });
    }
  };

  const handleCreate = (entity: Entity) => {
    if (!hasWritePermission) {
      notifications.show({
        message: t('components.graph.connect.noPermission'),
        color: 'red',
      });
    } else {
      onCreate?.(entity);
    }
  };

  return (
    <Box pos="relative" h="100%" w="100%">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={NodeTypes}
        edgeTypes={EdgeTypes}
        onNodesChange={handleNodeChanges}
        onEdgesChange={handleEdgeChanges}
        onConnect={allowOperations.includes('connect') ? handleConnection : undefined}
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
          onCreate={allowOperations.includes('create') ? handleCreate : undefined}
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
