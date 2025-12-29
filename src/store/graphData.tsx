import type {
  V1Event,
  V1Person,
  V1Organization,
  V1Website,
  V1Source,
  V1Relation,
} from '@omnsight/clients/dist/omndapi/omndapi.js';
import {
  type Node,
  type Edge,
  MarkerType,
  type NodeChange,
  applyNodeChanges,
  type EdgeChange,
  applyEdgeChanges,
} from 'reactflow';
import { create } from 'zustand';
import { EventNode } from '../components/entity/event/Node';
import { PersonNode } from '../components/entity/person/Node';
import { OrganizationNode } from '../components/entity/organization/Node';
import { WebsiteNode } from '../components/entity/website/Node';
import { SourceNode } from '../components/entity/source/Node';
import { RelationEdge } from '../components/entity/relation/Edge';
import { getStressLayout } from '../components/graph/layout';
import { useSelection } from './selection';
import { useLocalDataState } from './localData';

type EntityTypeLabel = 'event' | 'person' | 'organization' | 'website' | 'source';
export type EntityType = V1Event | V1Person | V1Organization | V1Website | V1Source;

export const NodeTypes = {
  event: EventNode,
  person: PersonNode,
  organization: OrganizationNode,
  website: WebsiteNode,
  source: SourceNode,
};

export const EdgeTypes = {
  relation: RelationEdge,
};

interface GraphDataState {
  nodes: Node<EntityType>[];
  edges: Edge<V1Relation>[];
  version: number;
  actions: {
    changeNodes: (changes: NodeChange[]) => void;
    changeEdges: (changes: EdgeChange[]) => void;
  };
}

export const useGraphData = create<GraphDataState>((set) => {
  return {
    nodes: [],
    edges: [],
    version: 0,
    actions: {
      changeNodes: (changes: NodeChange[]) => {
        set((state) => ({ nodes: applyNodeChanges(changes, state.nodes) }));
      },
      changeEdges: (changes: EdgeChange[]) => {
        set((state) => ({ edges: applyEdgeChanges(changes, state.edges) }));
      },
    },
  };
});

export const useGraphActions = () => useGraphData((state) => state.actions);

// Subscription to localData
useLocalDataState.subscribe(async (state) => {
  try {
    const { events, persons, organizations, websites, sources, relations } = state;

    // Get current state
    const { nodes: currentNodes, edges: currentEdges } = useGraphData.getState();

    // Maps for easy lookup
    const currentNodesMap = new Map(currentNodes.map((n) => [n.id, n]));
    const currentEdgesMap = new Map(currentEdges.map((e) => [e.id, e]));

    const nextNodes: Node<EntityType>[] = [];
    const nextEdges: Edge<V1Relation>[] = [];
    let hasStructuralChanges = false;

    const processNode = (item: EntityType, type: EntityTypeLabel) => {
      if (item.id) {
        const existingNode = currentNodesMap.get(item.id);
        if (existingNode) {
          nextNodes.push({
            ...existingNode,
            type,
            data: item,
          });
          currentNodesMap.delete(item.id);
        } else {
          nextNodes.push({
            id: item.id,
            type,
            data: item,
            position: { x: 0, y: 0 },
          });
          hasStructuralChanges = true;
        }
      } else {
        console.error(`Entity ${type} has no id: ${JSON.stringify(item)}`);
      }
    };

    events.forEach((e) => processNode(e, 'event'));
    persons.forEach((p) => processNode(p, 'person'));
    organizations.forEach((o) => processNode(o, 'organization'));
    websites.forEach((w) => processNode(w, 'website'));
    sources.forEach((s) => processNode(s, 'source'));

    // If there are nodes left in currentNodesMap, they were removed
    if (currentNodesMap.size > 0) {
      hasStructuralChanges = true;
    }

    const processEdge = (r: V1Relation) => {
      if (r.id && r.from && r.to) {
        const existingEdge = currentEdgesMap.get(r.id);
        if (existingEdge) {
          nextEdges.push({
            ...existingEdge,
            source: r.from,
            target: r.to,
            data: r,
          });
          currentEdgesMap.delete(r.id);
        } else {
          nextEdges.push({
            id: r.id,
            source: r.from,
            target: r.to,
            type: 'relation',
            data: r,
            markerEnd: { type: MarkerType.ArrowClosed },
          });
          hasStructuralChanges = true;
        }
      } else {
        console.error(`Relation ${r.id} has no id, from, or to: ${JSON.stringify(r)}`);
      }
    };

    relations.forEach((r) => processEdge(r));

    // If there are edges left in currentEdgesMap, they were removed
    if (currentEdgesMap.size > 0) {
      hasStructuralChanges = true;
    }

    let finalNodes = nextNodes;

    // Only run layout if there are structural changes (add/remove)
    if (hasStructuralChanges) {
      const layoutChanges = await getStressLayout(nextNodes, nextEdges);
      finalNodes = applyNodeChanges(layoutChanges, nextNodes);
    }

    // Apply current selection
    const selectedIds = useSelection.getState().selectedIds;
    finalNodes = finalNodes.map((n) => ({
      ...n,
      selected: selectedIds.includes(n.id),
    }));

    const finalEdges = nextEdges.map((e) => ({
      ...e,
      selected: selectedIds.includes(e.id),
    }));

    useGraphData.setState((state) => ({
      nodes: finalNodes,
      edges: finalEdges,
      version: hasStructuralChanges ? state.version + 1 : state.version,
    }));
  } catch (error) {
    console.error('Error syncing graph data:', error);
  }
});

// Subscription to useSelection
useSelection.subscribe((state) => {
  const { selectedIds } = state;
  useGraphData.setState((graphState) => ({
    nodes: graphState.nodes.map((n) => ({
      ...n,
      selected: selectedIds.includes(n.id),
    })),
    edges: graphState.edges.map((e) => ({
      ...e,
      selected: selectedIds.includes(e.id),
    })),
  }));
});
