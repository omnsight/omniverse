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

export const getCompareLayout = async (nodes: Node[], edges: Edge[], selectedNodeIds: string[]) => {
  if (!selectedNodeIds.length || !nodes.length) return [];

  // 1. Separate Nodes
  // Sort fixed nodes by x-position to maintain relative order in the new row
  const fixedNodes = nodes
    .filter((n) => selectedNodeIds.includes(n.id))
    .sort((a, b) => a.position.x - b.position.x);

  const movingNodes = nodes.filter((n) => !selectedNodeIds.includes(n.id));

  // 2. Calculate the Geometric Centroid
  // This point serves as the anchor for both the Row and the Radial circle
  const centroid = fixedNodes.reduce(
    (acc, node) => ({
      x: acc.x + node.position.x,
      y: acc.y + node.position.y,
    }),
    { x: 0, y: 0 },
  );
  centroid.x /= fixedNodes.length;
  centroid.y /= fixedNodes.length;

  // ---------------------------------------------------------
  // PART A: Layout Selected Nodes (Linear Row)
  // ---------------------------------------------------------
  const ROW_SPACING = 50;

  // Calculate total width of the row to center it
  const totalRowWidth = fixedNodes.reduce((acc, node, index) => {
    const width = node.width ?? 150; // Fallback width
    const isLast = index === fixedNodes.length - 1;
    return acc + width + (isLast ? 0 : ROW_SPACING);
  }, 0);

  let currentXOffset = -(totalRowWidth / 2); // Start from left relative to centroid

  const fixedNodeChanges: NodePositionChange[] = fixedNodes.map((node) => {
    const width = node.width ?? 150;
    const height = node.height ?? 50;

    // Calculate position: Centered on Centroid X, Centered on Centroid Y
    const newX = centroid.x + currentXOffset;
    const newY = centroid.y - height / 2;

    currentXOffset += width + ROW_SPACING;

    return {
      id: node.id,
      type: 'position',
      position: { x: newX, y: newY },
    };
  });

  // If there are no moving nodes, return just the row alignment
  if (movingNodes.length === 0) return fixedNodeChanges;

  // ---------------------------------------------------------
  // PART B: Layout Unselected Nodes (Radial via ELK)
  // ---------------------------------------------------------
  const DUMMY_ID = '__VIRTUAL_CENTER__';

  const dummyNode = {
    id: DUMMY_ID,
    position: { x: 0, y: 0 },
    width: 10,
    height: 10,
  } as Node;

  const virtualNodes = [dummyNode, ...movingNodes];

  // Rewire edges: Connect Moving nodes to the Dummy Node instead of Fixed nodes
  const virtualEdges = edges
    .map((edge) => {
      const isSourceFixed = selectedNodeIds.includes(edge.source);
      const isTargetFixed = selectedNodeIds.includes(edge.target);

      // Edge between two fixed nodes? Ignore (handled by Row layout)
      if (isSourceFixed && isTargetFixed) return null;

      // Edge between two moving nodes? Keep as is
      if (!isSourceFixed && !isTargetFixed) return edge;

      // Edge between Fixed <-> Moving? Rewire to Dummy <-> Moving
      if (isSourceFixed) return { ...edge, id: `v-${edge.id}`, source: DUMMY_ID };
      if (isTargetFixed) return { ...edge, id: `v-${edge.id}`, target: DUMMY_ID };

      return null;
    })
    .filter((e): e is Edge => e !== null);

  const elkOptions = {
    'elk.algorithm': 'radial',
    'elk.spacing.nodeNode': '80',
    'elk.radial.compaction': '0.5',
  };

  const elkChanges = await runElkLayout(virtualNodes, virtualEdges, elkOptions);

  // ---------------------------------------------------------
  // PART C: Merge and Align
  // ---------------------------------------------------------

  // Find where ELK placed the dummy center
  const dummyChange = elkChanges.find((c) => c.id === DUMMY_ID);

  // Calculate offset to move ELK's result to the real Centroid
  const offsetX = dummyChange?.position ? centroid.x - dummyChange.position.x : 0;
  const offsetY = dummyChange?.position ? centroid.y - dummyChange.position.y : 0;

  const radialNodeChanges = elkChanges
    .filter((c) => c.id !== DUMMY_ID)
    .map((c) => ({
      ...c,
      position: {
        x: c.position!.x + offsetX,
        y: c.position!.y + offsetY,
      },
    }));

  return [...fixedNodeChanges, ...radialNodeChanges];
};

export const getStressLayout = async (nodes: Node[], edges: Edge[]) => {
  const layoutOptions: Record<string, any> = {
    'elk.algorithm': 'stress',
    'elk.stress.desiredEdgeLength': '130.0',
  };
  return runElkLayout(nodes, edges, layoutOptions);
};
