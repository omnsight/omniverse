import { useMultiWindowStoreActions } from '../../../stores/multiWindowState';
import { useEffect, useState, useRef } from 'react';
import { type Node, type Edge, applyNodeChanges, MarkerType } from 'reactflow';
import { getStressLayout } from '../../../components/graph/layout';
import { useEntityDataActions, useEntityDataStore } from './entityData';
import { useEntitySelectionActions, useEntitySelectionStore } from '../data/entitySelection';
import { EntityGraph } from '../../../components/graph/Graph';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../../provider/AuthContext';
import { EntityCreationModal } from '../../../components/entity/CreationModal';
import { type Entity } from '../../../components/entity/entity';
import { deleteEntity, deleteRelation } from 'omni-osint-crud-client';
import { queryNeighbors } from 'omni-osint-query-client';
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
  const { selectedIds } = useEntitySelectionStore();
  const { setSelections } = useEntitySelectionActions();
  const { setActiveWindow } = useMultiWindowStoreActions();
  const [entityToCreate, setEntityToCreate] = useState<Entity | undefined>(undefined);
  const hasWritePermission = user ? hasRole('admin') || hasRole('pro') : false;
  const expandedEventIds = useRef(new Set());

  useEffect(() => {
    const fetchNeighbors = async () => {
      if (events) {
        for (const event of events) {
          if (event._id && !expandedEventIds.current.has(event._id)) {
            expandedEventIds.current.add(event._id); // Mark as processed to avoid re-fetching.
            const response = await queryNeighbors({ path: { id: event._id } });
            if (response.data) {
              addEntities(
                {
                  events: response.data.events,
                  organizations: response.data.organizations,
                  people: response.data.persons,
                  sources: response.data.sources,
                  websites: response.data.websites,
                  relations: response.data.relations,
                },
                ['neighbors', event._id]
              );
            }
          }
        }
      }
    };
    fetchNeighbors();
  }, [events, addEntities]);

  useEffect(() => {
    const allNodes: Node[] = [];
    (persons || []).forEach((p) =>
      allNodes.push({
        id: p._id || '',
        type: 'person',
        position: { x: 0, y: 0 },
        data: p,
      }),
    );
    (organizations || []).forEach((o) =>
      allNodes.push({
        id: o._id || '',
        type: 'organization',
        position: { x: 0, y: 0 },
        data: o,
      }),
    );
    (events || []).forEach((e) => {
      allNodes.push({
        id: e._id || '',
        type: 'event',
        position: { x: 0, y: 0 },
        data: e,
      });
    });
    (websites || []).forEach((w) =>
      allNodes.push({
        id: w._id || '',
        type: 'website',
        position: { x: 0, y: 0 },
        data: w,
      }),
    );
    (sources || []).forEach((s) =>
      allNodes.push({
        id: s._id || '',
        type: 'source',
        position: { x: 0, y: 0 },
        data: s,
      }),
    );

    const allEdges: Edge[] = (relations || []).map((r) => ({
      id: r._id || '',
      source: r._from || '',
      target: r._to || '',
      type: 'relation',
      data: r,
      markerEnd: { type: MarkerType.ArrowClosed },
    }));

    getStressLayout(allNodes, allEdges).then((changes) => {
      setNodes(applyNodeChanges(changes, allNodes));
      setEdges(allEdges);
    });
  }, [events, organizations, persons, sources, websites, relations]);

  useEffect(() => {
    setNodes((nds) =>
      nds.map((n) => ({
        ...n,
        selected: selectedIds.includes(n.id),
      })),
    );
  }, [selectedIds]);

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

  const handleCreate = (entity: Entity) => {
    console.debug('Creating entity', entity);
    setEntityToCreate(entity);
  };

  return (
    <Box pos="relative" h="100%" w="100%">
      <EntityGraph
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        onSelection={(ids) => {
          setSelections(ids);
          if (ids.length > 0) {
            setActiveWindow('data', 'Entity');
          }
        }}
        onCreate={handleCreate}
        onRemove={handleRemove}
        allowOperations={['move', 'connect', 'remove', 'create']}
        hasWritePermission={hasWritePermission}
      />
      <EntityCreationModal
        entity={entityToCreate}
        setEntity={setEntityToCreate}
        onCreated={(entities) => addEntities(entities, undefined)}
      />
    </Box>
  );
};
