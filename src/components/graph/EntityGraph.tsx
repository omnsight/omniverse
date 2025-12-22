import 'reactflow/dist/style.css';
import ReactFlow, {
  Controls,
  Background,
  Panel,
  useNodesState,
  useEdgesState,
  useReactFlow,
  ReactFlowProvider,
  applyNodeChanges,
  applyEdgeChanges,
  addEdge,
} from 'reactflow';
import { Card, Text, Group, SegmentedControl, Box } from '@mantine/core';
import type { Connection, EdgeChange, Node, NodeChange } from 'reactflow';
import type {
  V1Event,
  V1Organization,
  V1Person,
  V1Relation,
  V1Source,
  V1Website,
} from '@omnsight/clients/dist/omndapi/omndapi';
import { useCallback, useEffect, useMemo } from 'react';
import { NodeTypes, EdgeTypes, type GraphMode } from './types';
import { getDefaultGraphLayout } from './layout';
import { transformNodes } from './transform';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

interface Props {
  events: V1Event[];
  persons: V1Person[];
  organizations: V1Organization[];
  websites: V1Website[];
  sources: V1Source[];
  relations: V1Relation[];
  selectedNodeIds: Set<string>;
  setSelectedNodeIds: (ids: Set<string>) => void;
  mode: GraphMode;
  setMode: (mode: GraphMode) => void;
}

const EntityGraphContent: React.FC<Props> = ({
  events,
  persons,
  organizations,
  websites,
  sources,
  relations,
  selectedNodeIds,
  setSelectedNodeIds,
  mode,
  setMode,
}) => {
  const { t } = useTranslation();
  const [nodes, setNodes] = useNodesState([]);
  const [edges, setEdges] = useEdgesState([]);
  const { fitView } = useReactFlow();

  // Prepare Data
  const rawData = useMemo(() => {
    console.log('transformNodes', events, persons, organizations, websites, sources, relations);
    return transformNodes(events, persons, organizations, websites, sources, relations);
  }, [events, persons, organizations, websites, sources, relations]);

  useEffect(() => {
    const { nodes: layoutNodes, edges: layoutEdges } = getDefaultGraphLayout(
      rawData.nodes,
      rawData.edges,
    );

    // Restore selections
    const nodesWithSelection = layoutNodes.map((n) => ({
      ...n,
      selected: selectedNodeIds.has(n.id),
    }));

    setNodes(nodesWithSelection);
    setEdges(layoutEdges);
    if (nodes.length === 0) {
      // Only fit view on initial load
      window.requestAnimationFrame(() => fitView());
    }
  }, [rawData, setNodes, setEdges]);

  // Handle Selection
  const onSelectionChange = useCallback(({ nodes }: { nodes: Node[] }) => {
    const ids = new Set(nodes.map((n) => n.id));
    setSelectedNodeIds(ids);
  }, []);

  const onModeChange = useCallback((mode: GraphMode) => {
    if (mode === 'compare' && selectedNodeIds.size < 2) {
      notifications.show({
        title: t('graph.EntityGraph.error'),
        message: t('graph.EntityGraph.compareError'),
        color: 'yellow',
      });
    } else {
      setMode(mode);
    }
  }, []);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [],
  );

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onSelectionChange={onSelectionChange}
        nodeTypes={NodeTypes}
        edgeTypes={EdgeTypes}
        fitView
      >
        <Background />
        <Controls />
        <Panel position="top-right">
          <Card shadow="sm" p="xs" radius="md" withBorder>
            <Group>
              <Text size="sm" fw={500}>
                View Mode:
              </Text>
              <SegmentedControl
                value={mode}
                onChange={(value) => onModeChange(value as GraphMode)}
                data={[
                  { label: 'Graph', value: 'graph' },
                  { label: 'Compare', value: 'compare' },
                ]}
              />
            </Group>
          </Card>
        </Panel>
      </ReactFlow>
    </Box>
  );
};

export const EntityGraph: React.FC<Props> = (props) => {
  return (
    <ReactFlowProvider>
      <EntityGraphContent {...props} />
    </ReactFlowProvider>
  );
};
