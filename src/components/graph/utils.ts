import { Position, type Node } from 'reactflow';

// Helper to get the center of a node
function getNodeCenter(node: Node) {
  const x = node.positionAbsolute?.x ?? node.position.x;
  const y = node.positionAbsolute?.y ?? node.position.y;

  return {
    x: x + (node.width || 0) / 2,
    y: y + (node.height || 0) / 2,
  };
}

export function getSmartEdgeParams(source: Node, target: Node) {
  const sourceCenter = getNodeCenter(source);
  const targetCenter = getNodeCenter(target);

  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;

  let sourcePosition = Position.Bottom;
  let targetPosition = Position.Top;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 0) {
      sourcePosition = Position.Right;
      targetPosition = Position.Left;
    } else {
      sourcePosition = Position.Left;
      targetPosition = Position.Right;
    }
  } else {
    if (dy > 0) {
      sourcePosition = Position.Bottom;
      targetPosition = Position.Top;
    } else {
      sourcePosition = Position.Top;
      targetPosition = Position.Bottom;
    }
  }

  // Helper to find handle position using handleBounds if available
  const getHandlePosition = (node: Node, position: Position, type: 'source' | 'target') => {
    // Access internal handleBounds
    const handleBounds = (node as any).handleBounds;

    // Get absolute position
    const nodeX = node.positionAbsolute?.x ?? node.position.x;
    const nodeY = node.positionAbsolute?.y ?? node.position.y;

    if (handleBounds) {
      const handles = type === 'source' ? handleBounds.source : handleBounds.target;
      if (handles) {
        const handle = handles.find((h: any) => h.position === position);
        if (handle) {
          return {
            x: nodeX + handle.x + handle.width / 2,
            y: nodeY + handle.y + handle.height / 2,
          };
        }
      }
    }

    // Fallback if handleBounds not found (e.g. not yet measured)
    const w = node.width || 0;
    const h = node.height || 0;

    switch (position) {
      case Position.Top:
        return { x: nodeX + w / 2, y: nodeY };
      case Position.Right:
        return { x: nodeX + w, y: nodeY + h / 2 };
      case Position.Bottom:
        return { x: nodeX + w / 2, y: nodeY + h };
      case Position.Left:
        return { x: nodeX, y: nodeY + h / 2 };
    }
  };

  const sourcePos = getHandlePosition(source, sourcePosition, 'source');
  const targetPos = getHandlePosition(target, targetPosition, 'target');

  return {
    sourceX: sourcePos.x,
    sourceY: sourcePos.y,
    targetX: targetPos.x,
    targetY: targetPos.y,
    sourcePosition,
    targetPosition,
  };
}
