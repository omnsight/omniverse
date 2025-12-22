import type {
  V1Event,
  V1Organization,
  V1Person,
  V1Relation,
  V1Source,
  V1Website,
} from '@omnsight/clients/dist/omndapi/omndapi';
import type { EntityType, EntityTypeLabel } from './types';
import { type Node, type Edge, MarkerType } from 'reactflow';

export const transformNodes = (
  events: V1Event[],
  persons: V1Person[],
  organizations: V1Organization[],
  websites: V1Website[],
  sources: V1Source[],
  relations: V1Relation[],
) => {
  const allNodes: Node[] = [];
  const addNode = (item: EntityType, type: EntityTypeLabel, label: string) => {
    allNodes.push({
      id: item.id || Math.random().toString(),
      type,
      data: {
        label: label,
        details: item,
      },
      position: { x: 0, y: 0 },
    });
  };

  events.forEach((e) => addNode(e, 'event', e.title || 'Unknown'));
  persons.forEach((p) => addNode(p, 'person', p.name || 'Unknown'));
  organizations.forEach((o) => addNode(o, 'organization', o.name || 'Unknown'));
  websites.forEach((w) => addNode(w, 'website', w.url || 'Unknown'));
  sources.forEach((s) => addNode(s, 'source', s.name || 'Unknown'));

  const allEdges: Edge[] = relations
    .map((r) => ({
      id: r.id || `${r.from}-${r.to}`,
      source: r.from || '',
      target: r.to || '',
      label: r.name,
      type: 'relation',
      data: r,
      markerEnd: { type: MarkerType.ArrowClosed },
    }))
    .filter((e) => e.source && e.target);

  return { nodes: allNodes, edges: allEdges };
};
