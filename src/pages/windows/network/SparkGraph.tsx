import { useEffect, useMemo, useState } from 'react';
import { type Node, type Edge, applyNodeChanges, MarkerType } from 'reactflow';
import { getStressLayout } from '../../../components/graph/layout';
import { useEntityDataActions, useEntityDataStore } from './entityData';
import { useEntitySelectionActions, useSelectedEntities } from '../data/entitySelection';
import { EntityGraph } from '../../../components/graph/Graph';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../provider/AuthContext';
import { EntityCreationModal } from '../../../components/entity/CreationModal';
import { type Entity } from '../../../components/entity/entity';
import { deleteEntity, deleteRelation } from 'omni-osint-crud-client';
import { Box } from '@mantine/core';
import { notifications } from '@mantine/notifications';

export const SparkGraph: React.FC = () => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const { queries, events, organizations, persons, sources, websites, relations } =
    useEntityDataStore();
  const { addEntities } = useEntityDataActions();
  const selections = useSelectedEntities();
  const { setSelections } = useEntitySelectionActions();
  const [entityToCreate, setEntityToCreate] = useState<Entity | undefined>(undefined);
  const hasWritePermission = user ? hasRole('admin') || hasRole('pro') : false;

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
    (events || []).forEach((e) => {
      allNodes.push({
        id: e._id || '',
        type: 'event',
        position: { x: 0, y: 0 },
        data: e,
        selected: selections.some((s) => s.data._id === e._id),
      });
    });
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

  const handleRemove = async (ids: string[], isEdge: boolean) => {
    for (const id of ids) {
      if (isEdge) {
        const { error } = await deleteRelation({ path: { id } });
        if (error) {
          notifications.show({
            message: t('pages.windows.network.SparkGraph.deleteEdgeError', '?'),
            color: 'red',
          });
        }
      } else {
        const { error } = await deleteEntity({ path: { id } });
        if (error) {
          notifications.show({
            message: t('pages.windows.network.SparkGraph.deleteEntityError', '?'),
            color: 'red',
          });
        }
      }
    }
    queries.forEach((q) => {
      queryClient.invalidateQueries({ queryKey: q });
    });
  };

  return (
    <Box pos="relative" h="100%" w="100%">
      <EntityGraph
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        onSelection={(ids) => setSelections(ids)}
        onCreate={setEntityToCreate}
        onRemove={handleRemove}
        allowOperations={['move', 'connect', 'remove', 'create']}
        hasWritePermission={hasWritePermission}
      >
        {entityToCreate && (
          <EntityCreationModal
            entity={entityToCreate}
            setEntity={setEntityToCreate}
            onCreated={(entities) => addEntities(entities, undefined)}
          />
        )}
      </EntityGraph>
    </Box>
  );
};
