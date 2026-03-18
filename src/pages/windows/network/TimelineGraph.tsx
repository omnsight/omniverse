import { useEffect, useState } from 'react';
import { type Node, type Edge } from 'reactflow';
import { useEntityDataStore } from './entityData';
import { useEntitySelectionActions, useSelectedEntities } from '../data/entitySelection';
import { EntityGraph } from '../../../components/graph/Graph';
import { Anchor, Box, Breadcrumbs, Paper } from '@mantine/core';
import { useAuth } from '../../../provider/AuthContext';
import { getTimelineLayout } from '../../../components/graph/layout';

export const TimelineGraph: React.FC = () => {
  const { user, hasRole } = useAuth();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [viewMode, setViewMode] = useState<'day' | 'month' | 'year'>('day');
  const { events } = useEntityDataStore();
  const selections = useSelectedEntities();
  const { setSelections } = useEntitySelectionActions();
  const hasWritePermission = user ? hasRole('admin') || hasRole('pro') : false;

  const date = new Date();
  useEffect(() => {
    const [nodes, edges] = getTimelineLayout(events, date, viewMode);
    nodes.forEach((node) => {
      if (selections.some((s) => s.data._id === node.data._id)) {
        node.data.selected = true;
      }
    });

    setNodes(nodes);
    setEdges(edges);
  }, [events, date, viewMode]);

  return (
    <Box pos="relative" h="100%" w="100%">
      <EntityGraph
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        onSelection={(ids) => setSelections(ids)}
        allowOperations={[]}
        hasWritePermission={hasWritePermission}
      />
      <Box
        style={{
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 5,
          pointerEvents: 'none',
        }}
      >
        <Paper
          withBorder
          px="xs"
          py={4}
          radius="md"
          shadow="xs"
          style={{
            pointerEvents: 'all',
            background: 'rgba(255, 255, 255, 0.9)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Breadcrumbs separator="/" separatorMargin="xs">
            <Anchor key={0} onClick={() => setViewMode('year')}>
              {date.getFullYear()}
            </Anchor>
            <Anchor key={1} onClick={() => setViewMode('month')}>
              {date.getMonth() + 1}
            </Anchor>
            <Anchor key={2} onClick={() => setViewMode('day')}>
              {date.getDate()}
            </Anchor>
          </Breadcrumbs>
        </Paper>
      </Box>
    </Box>
  );
};
