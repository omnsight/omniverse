import ELK from 'elkjs/lib/elk.bundled';
import type { Node, Edge, NodePositionChange } from 'reactflow';

const elk = new ELK();

const DEFAULT_WIDTH = 80;
const DEFAULT_HEIGHT = 80;

export type LayoutStrategy = 'layered' | 'radial' | 'stress';

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

export const getDraw2DLayout = async (nodes: Node[], edges: Edge[]) => {
  const layoutOptions: Record<string, any> = {
    'elk.algorithm': 'conn.gmf.layouter.Draw2D',
  };
  return runElkLayout(nodes, edges, layoutOptions);
};

export const getStressLayout = async (nodes: Node[], edges: Edge[]) => {
  const layoutOptions: Record<string, any> = {
    'elk.algorithm': 'stress',
    'elk.stress.desiredEdgeLength': '130.0',
  };
  return runElkLayout(nodes, edges, layoutOptions);
};
