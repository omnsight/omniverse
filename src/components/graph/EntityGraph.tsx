import 'reactflow/dist/style.css';
import ReactFlow, { Controls, Background, Panel, useReactFlow, ReactFlowProvider } from 'reactflow';
import { Box } from '@mantine/core';
import { useCallback, useEffect } from 'react';
import { GraphTools } from './GraphTools';
import { EdgeTypes, NodeTypes, useGraphActions, useGraphData } from '../../store/graphData';

import { SelectedNodePanel } from './SelectedNodePanel';
import { useLocalDataActions } from '../../store/localData';
import { useSelectionActions } from '../../store/selection';
import type { NodeChange, EdgeChange } from 'reactflow';

const EntityGraphContent: React.FC = () => {
  const { nodes, edges, version } = useGraphData();
  const { changeNodes, changeEdges } = useGraphActions();
  const { select } = useSelectionActions();
  const { removeEntities, removeRelations } = useLocalDataActions();
  const { fitView } = useReactFlow();

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

  useEffect(() => {
    if (version > 0) {
      fitView();
    }
  }, [version, fitView]);

  return (
    <Box style={{ height: '100%', width: '100%', position: 'relative' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={NodeTypes}
        edgeTypes={EdgeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <GraphTools />
        </Panel>
        <Panel position="bottom-right">
          <SelectedNodePanel />
        </Panel>
      </ReactFlow>
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
