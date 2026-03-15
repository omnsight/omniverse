import {
  type Node,
  type Edge,
  type Connection,
  applyNodeChanges,
  type NodeChange,
  type EdgeChange,
  applyEdgeChanges,
} from 'reactflow';
import { useQueryClient } from '@tanstack/react-query';
import { DeleteService, CreateService } from 'omni-osint-crud-client';
import { EntityGraph } from '../../../components/graph/Graph';
import type { Entity } from '../../../components/models/entity';
import { useEntityDataStore } from './entityData';
import { useEntitySelectionActions } from '../data/entitySelection';
import { useAuth } from '../../../provider/AuthContext';
import { notifications } from '@mantine/notifications';
import { Modal, Button } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { EntityFormRenderer } from '../../../components/forms/EntityFormRenderer';
import { useState, type PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  allowWrite: boolean;
  nodes: Node[];
  edges: Edge[];
  setNodes: (nodes: Node[]) => void;
  setEdges: (edges: Edge[]) => void;
}

export const ActionGraph: React.FC<Props> = ({
  allowWrite,
  nodes,
  edges,
  setNodes,
  setEdges,
  children,
}) => {
  const queryClient = useQueryClient();
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();
  const { queries } = useEntityDataStore();
  const { setSelections } = useEntitySelectionActions();
  const [entityToCreate, setEntityToCreate] = useState<Entity | undefined>(undefined);
  const hasWritePermission = (user ? hasRole('admin') || hasRole('pro') : false) && allowWrite;

  const updateNodes = (changes: NodeChange[]) => {
    const removeChanges = changes.filter((c) => c.type === 'remove');
    const otherChanges = changes.filter(
      (c) => c.type !== 'select' && c.type !== 'remove' && c.type !== 'add',
    );

    if (hasWritePermission && removeChanges.length > 0) {
      const deletePromises = removeChanges.map((rc) => DeleteService.deleteEntity(rc.id));
      Promise.all(deletePromises).then(() => {
        queries.forEach((q) => {
          queryClient.invalidateQueries({ queryKey: q });
        });
      });
    }
    setNodes(applyNodeChanges(otherChanges, nodes));
  };

  const updateEdges = (changes: EdgeChange[]) => {
    const removeChanges = changes.filter((c) => c.type === 'remove');
    const otherChanges = changes.filter(
      (c) => c.type !== 'select' && c.type !== 'remove' && c.type !== 'add',
    );

    if (hasWritePermission && removeChanges.length > 0) {
      const deletePromises = removeChanges.map((rc) => DeleteService.deleteRelation(rc.id));
      Promise.all(deletePromises).then(() => {
        queries.forEach((q) => {
          queryClient.invalidateQueries({ queryKey: q });
        });
      });
    }
    setEdges(applyEdgeChanges(otherChanges, edges));
  };

  const setSelectedIds = (ids: string[]) => {
    setSelections(ids);
  };

  const update = (data: any) => {
    if (!entityToCreate) return;
    setEntityToCreate({
      ...entityToCreate,
      data: { ...entityToCreate.data, ...data },
    });
  };

  const create = () => {
    if (!entityToCreate) return;

    let createPromise;
    switch (entityToCreate.type) {
      case 'Person':
        createPromise = CreateService.createPerson(entityToCreate.data);
        break;
      case 'Organization':
        createPromise = CreateService.createOrganization(entityToCreate.data);
        break;
      case 'Event':
        createPromise = CreateService.createEvent(entityToCreate.data);
        break;
      case 'Website':
        createPromise = CreateService.createWebsite(entityToCreate.data);
        break;
      case 'Source':
        createPromise = CreateService.createSource(entityToCreate.data);
        break;
      default:
        createPromise = Promise.reject(new Error('Unknown entity type'));
    }

    createPromise
      .then(() => {
        notifications.show({
          message: t('network.createEntity.success', 'Entity created successfully'),
          color: 'green',
        });
        queries.forEach((q) => {
          queryClient.invalidateQueries({ queryKey: q });
        });
      })
      .catch(() => {
        notifications.show({
          message: t('network.createEntity.error', 'Error creating entity'),
          color: 'red',
        });
      })
      .finally(() => {
        setEntityToCreate(undefined);
      });
  };

  const onConnection = (connection: Connection) => {
    if (!hasWritePermission) {
      notifications.show({
        message: t('network.spark.error.noPermission'),
        color: 'red',
      });
    } else {
      setEntityToCreate({
        type: 'Relation',
        data: {
          _from: connection.source,
          _to: connection.target,
        },
      });
    }
  };

  const onCreateEntity = (entity: Entity) => {
    setEntityToCreate(entity);
  };

  return (
    <EntityGraph
      nodes={nodes}
      edges={edges}
      onNodesChange={updateNodes}
      onEdgesChange={updateEdges}
      onSelection={setSelectedIds}
      onConnect={onConnection}
      onCreate={onCreateEntity}
      hasWritePermission={hasWritePermission}
    >
      {entityToCreate && (
        <Modal
          opened={!!entityToCreate}
          onClose={() => setEntityToCreate(undefined)}
          title={t('network.createEntity.title', 'Create Entity')}
        >
          <EntityFormRenderer entity={entityToCreate} onUpdate={update} />
          <Button onClick={create}>{t('network.createEntity.create', 'Create')}</Button>
        </Modal>
      )}
      {children}
    </EntityGraph>
  );
};
