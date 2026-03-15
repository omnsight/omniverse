import { useEffect, useMemo, useState } from 'react';
import { type Node, type Edge, applyNodeChanges, MarkerType } from 'reactflow';
import { getStressLayout } from '../../../components/graph/layout';
import { useEntityDataStore } from './entityData';
import { useSelectedEntities } from '../data/entitySelection';
import { ActionGraph } from './ActionedGraph';

export const SparkGraph: React.FC = () => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { events, organizations, persons, sources, websites, relations } = useEntityDataStore();
  const selections = useSelectedEntities();

  const initialNodes: Node[] = useMemo(() => {
    const allNodes: Node[] = [];
    (persons || []).forEach((p) =>
      allNodes.push({
        id: p._id || '',
        type: 'person',
        position: { x: 0, y: 0 },
        data: p,
        selected: selections.some((s) => s.data._id === p._id),
      }),
    );
    (organizations || []).forEach((o) =>
      allNodes.push({
        id: o._id || '',
        type: 'organization',
        position: { x: 0, y: 0 },
        data: o,
        selected: selections.some((s) => s.data._id === o._id),
      }),
    );
    (events || []).forEach((e) =>
      allNodes.push({
        id: e._id || '',
        type: 'event',
        position: { x: 0, y: 0 },
        data: e,
        selected: selections.some((s) => s.data._id === e._id),
      }),
    );
    (websites || []).forEach((w) =>
      allNodes.push({
        id: w._id || '',
        type: 'website',
        position: { x: 0, y: 0 },
        data: w,
        selected: selections.some((s) => s.data._id === w._id),
      }),
    );
    (sources || []).forEach((s) =>
      allNodes.push({
        id: s._id || '',
        type: 'source',
        position: { x: 0, y: 0 },
        data: s,
        selected: selections.some((selected) => selected.data._id === s._id),
      }),
    );
    return allNodes;
  }, [events, organizations, persons, sources, websites]);

  const initialEdges: Edge[] = useMemo(() => {
    return (relations || []).map((r) => ({
      id: r._id || '',
      source: r._from || '',
      target: r._to || '',
      type: 'relation',
      data: r,
      markerEnd: { type: MarkerType.ArrowClosed },
    }));
  }, [relations]);

  useEffect(() => {
    getStressLayout(initialNodes, initialEdges).then((changes) => {
      setNodes(applyNodeChanges(changes, nodes));
    });
  }, [initialNodes, initialEdges]);

  return (
    <ActionGraph
      allowWrite={true}
      nodes={nodes}
      edges={edges}
      setNodes={setNodes}
      setEdges={setEdges}
    />
  );
};
