import 'reactflow/dist/style.css';
import ReactFlow, { Controls, Background, Panel, useReactFlow, ReactFlowProvider } from 'reactflow';
import { Box } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { GraphTools } from './GraphTools';
import { EdgeTypes, NodeTypes, useGraphActions, useGraphData } from '../../store/graphData';

import { SelectedNodePanel } from './SelectedNodePanel';
import { ViewMetadataPanel } from '../common/ViewMetadataPanel';
import { useLocalDataActions } from '../../store/localData';
import { useSelectionActions } from '../../store/selection';
import type { NodeChange, EdgeChange, Connection } from 'reactflow';
import { GraphContextMenu } from './GraphContextMenu';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../provider/AuthContext';

// Helper to generate random ID
const generateId = () => `new${Math.random().toString(36).slice(2, 11)}`;

const EntityGraphContent: React.FC = () => {
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();
  const { nodes, edges, mutated } = useGraphData();
  const { changeNodes, changeEdges } = useGraphActions();
  const { select } = useSelectionActions();
  const { removeEntities, removeRelations, addRelations, hasRelation } = useLocalDataActions();
  const { fitView } = useReactFlow();
  const [menuPosition, setMenuPosition] = useState<{ x: number; y: number } | null>(null);
  const hasWritePermission = user && (hasRole('admin') || hasRole('pro'));

  const onPaneContextMenu = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    const containerBounds = event.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: event.clientX - containerBounds.left,
      y: event.clientY - containerBounds.top,
    });
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      const selectionChanges = changes.filter((c) => c.type === 'select');
      const removeChanges = changes.filter((c) => c.type === 'remove');
      const otherChanges = changes.filter(
        (c) => c.type !== 'select' && c.type !== 'remove' && c.type !== 'add',
      );

      if (selectionChanges.length > 0) {
        select(selectionChanges.map((c) => c.id));
      }

      if (removeChanges.length > 0) {
        removeEntities(removeChanges.map((c) => c.id));
      }

      if (otherChanges.length > 0) {
        changeNodes(otherChanges);
      }
    },
    [changeNodes, select, removeEntities],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      const selectionChanges = changes.filter((c) => c.type === 'select');
      const removeChanges = changes.filter((c) => c.type === 'remove');
      const otherChanges = changes.filter(
        (c) => c.type !== 'select' && c.type !== 'remove' && c.type !== 'add',
      );

      if (selectionChanges.length > 0) {
        select(selectionChanges.map((c) => c.id));
      }

      if (removeChanges.length > 0) {
        removeRelations(removeChanges.map((c) => c.id));
      }

      if (otherChanges.length > 0) {
        changeEdges(otherChanges);
      }
    },
    [changeEdges, select, removeRelations],
  );

  const onConnect = useCallback(
    (params: Connection) => {
      if (!params.source || !params.target) return;

      if (hasRelation(params.source, params.target)) {
        notifications.show({
          title: t('common.error'),
          message: t('common.duplicateRelation'),
          color: 'red',
        });
        return;
      }

      if (!hasWritePermission) {
        notifications.show({
          title: t('common.error'),
          message: t('common.noWritePermission'),
          color: 'red',
        });
        return;
      }

      addRelations([
        {
          id: generateId(),
          from: params.source,
          to: params.target,
          owner: user.id,
        },
      ]);
    },
    [addRelations, hasRelation, t],
  );

  useEffect(() => {
    if (mutated) {
      fitView();
    }
  }, [nodes, edges, mutated, fitView]);

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
        <Panel position="top-left" style={{ top: '50%', transform: 'translateY(-50%)', left: 10 }}>
          <ViewMetadataPanel viewType="sparkgraph" />
        </Panel>
        <Panel position="top-right">
          <GraphTools />
        </Panel>
        <Panel position="bottom-right">
          <SelectedNodePanel />
        </Panel>
      </ReactFlow>
      {menuPosition && (
        <GraphContextMenu
          x={menuPosition.x}
          y={menuPosition.y}
          onClose={() => setMenuPosition(null)}
        />
      )}
    </Box>
  );
};

export const EntityGraph: React.FC = () => {
  return (
    <ReactFlowProvider>
      <EntityGraphContent />
    </ReactFlowProvider>
  );
};
