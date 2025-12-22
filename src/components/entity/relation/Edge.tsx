import React, { memo } from 'react';
import { BaseEdge, EdgeLabelRenderer, type EdgeProps, getBezierPath } from 'reactflow';
import { HoverCard, Badge, Text } from '@mantine/core';
import { RelationCard } from './Card';

export const RelationEdge: React.FC<EdgeProps> = memo(
  ({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    label,
    data,
  }) => {
    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    });

    return (
      <>
        <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 12,
              // everything inside EdgeLabelRenderer has no pointer events by default
              // if you have an interactive element, set pointer-events: all
              pointerEvents: 'all',
            }}
            className="nodrag nopan"
          >
            <HoverCard width={250} shadow="md" withArrow openDelay={200} closeDelay={0}>
              <HoverCard.Target>
                <Badge
                  variant="filled"
                  color="gray"
                  style={{ cursor: 'pointer', fontSize: 5, height: 8, padding: '0 4px' }}
                >
                  {label || 'Relation'}
                </Badge>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {data ? <RelationCard data={data} /> : <Text size="sm">No details available</Text>}
              </HoverCard.Dropdown>
            </HoverCard>
          </div>
        </EdgeLabelRenderer>
      </>
    );
  },
);
