import ELK from 'elkjs/lib/elk.bundled';
import type { Node, Edge, NodePositionChange } from 'reactflow';
import { type Event } from 'omni-osint-crud-client';

const elk = new ELK();

const DEFAULT_WIDTH = 80;
const DEFAULT_HEIGHT = 80;

// Reference https://eclipse.dev/elk/reference/algorithms.html for algorithms
const runElkLayout = async (
  nodes: Node[],
  edges: Edge[],
  layoutOptions: Record<string, any>,
  getNodeLayoutOptionsById?: (nodeId: string) => Record<string, any>,
  getEdgeLayoutOptionsById?: (edgeId: string) => Record<string, any>,
): Promise<NodePositionChange[]> => {
  const graph = {
    id: 'root',
    layoutOptions,
    children: nodes.map((node) => ({
      id: node.id,
      width: node.width ?? DEFAULT_WIDTH,
      height: node.height ?? DEFAULT_HEIGHT,
      ...getNodeLayoutOptionsById?.(node.id),
    })),
    edges: edges.map((edge) => ({
      id: edge.id,
      sources: [edge.source],
      targets: [edge.target],
      ...getEdgeLayoutOptionsById?.(edge.id),
    })),
  };

  try {
    const layoutedGraph = await elk.layout(graph);
    const changes: NodePositionChange[] = [];

    layoutedGraph.children?.forEach((node) => {
      if (node.x !== undefined && node.y !== undefined) {
        changes.push({
          id: node.id,
          type: 'position',
          position: { x: node.x, y: node.y },
        });
      }
    });

    return changes;
  } catch (error) {
    console.error('ELK layout error:', error);
    return [];
  }
};

export const getStressLayout = async (nodes: Node[], edges: Edge[]) => {
  const layoutOptions: Record<string, any> = {
    'elk.algorithm': 'stress',
    'elk.stress.desiredEdgeLength': '100.0',
  };
  return runElkLayout(nodes, edges, layoutOptions);
};

const HORIZONTAL_SPACING = 250;
const VERTICAL_SPACING = 80;
const START_Y_OFFSET = 100;

const getSectorLabel = (unit: number, viewType: string): string => {
  if (viewType === 'day') return `${unit.toString().padStart(2, '0')}:00`;
  if (viewType === 'month') return `Day ${unit}`;
  if (viewType === 'year') {
    return new Date(2000, unit).toLocaleString('default', { month: 'short' });
  }
  return unit.toString();
};

export const getTimelineLayout = (
  events: Event[],
  currentDate: Date,
  viewType: 'day' | 'month' | 'year',
): [Node[], Edge[]] => {
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();
  const currentDay = currentDate.getDate();

  const nodes: any[] = [];
  const edges: any[] = [];
  const groups: Record<number, Event[]> = {};

  // 1. Grouping Logic
  events.forEach((event) => {
    const d = new Date(event.happened_at || 0);
    const isMatch =
      viewType === 'day'
        ? d.getFullYear() === currentYear &&
          d.getMonth() === currentMonth &&
          d.getDate() === currentDay
        : viewType === 'month'
          ? d.getFullYear() === currentYear && d.getMonth() === currentMonth
          : d.getFullYear() === currentYear;

    if (isMatch) {
      const unit =
        viewType === 'day' ? d.getHours() : viewType === 'month' ? d.getDate() : d.getMonth();
      if (!groups[unit]) groups[unit] = [];
      groups[unit].push(event);
    }
  });

  // 2. Node and Edge Generation
  Object.entries(groups).forEach(([unitStr, groupEvents]) => {
    const unit = parseInt(unitStr);
    const x = unit * HORIZONTAL_SPACING;
    const isEven = unit % 2 === 0;
    const direction = isEven ? -1 : 1;
    const sectorId = `sector-${unit}`;

    // Add Sector Label Node (The Axis)
    nodes.push({
      id: sectorId,
      type: 'sector',
      data: { label: getSectorLabel(unit, viewType) },
      position: { x, y: 0 },
    });

    // Add Event Nodes and Connectors
    groupEvents.forEach((event, index) => {
      const eventId = event._id;
      const y = direction * (START_Y_OFFSET + index * VERTICAL_SPACING);

      nodes.push({
        id: eventId,
        type: 'event',
        data: event,
        position: { x, y },
      });

      // Edge connecting sector to event
      edges.push({
        id: `edge-${sectorId}-${eventId}`,
        source: sectorId,
        target: eventId,
        type: 'step', // 'step' or 'straight' works well for vertical connectors
        style: { stroke: '#ccc' },
      });
    });
  });

  return [nodes, edges];
};
