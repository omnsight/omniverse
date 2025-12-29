import React, { memo, useCallback } from 'react';
import {
  BaseEdge,
  EdgeLabelRenderer,
  type EdgeProps,
  getBezierPath,
  useStore,
  type ReactFlowState,
} from 'reactflow';
import { HoverCard, Badge, Text } from '@mantine/core';
import { RelationCard } from './Card';
import { getSmartEdgeParams } from '../../graph/utils';
import type { V1Relation } from '@omnsight/clients/dist/omndapi/omndapi';
import { useTranslation } from 'react-i18next';

export const RelationEdge: React.FC<EdgeProps<V1Relation>> = memo(
  ({
    source,
    target,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    style = {},
    markerEnd,
    data,
    selected,
  }) => {
    const { t } = useTranslation();
    const sourceNode = useStore(
      useCallback((s: ReactFlowState) => s.nodeInternals.get(source), [source]),
    );
    const targetNode = useStore(
      useCallback((s: ReactFlowState) => s.nodeInternals.get(target), [target]),
    );

    let edgeParams = {
      sourceX,
      sourceY,
      sourcePosition,
      targetX,
      targetY,
      targetPosition,
    };

    if (sourceNode && targetNode) {
      const smartParams = getSmartEdgeParams(sourceNode, targetNode);
      edgeParams = { ...edgeParams, ...smartParams };
    }

    const [edgePath, labelX, labelY] = getBezierPath({
      sourceX: edgeParams.sourceX,
      sourceY: edgeParams.sourceY,
      sourcePosition: edgeParams.sourcePosition,
      targetX: edgeParams.targetX,
      targetY: edgeParams.targetY,
      targetPosition: edgeParams.targetPosition,
    });

    let badgeColor = 'grey';
    if (data && data.confidence !== undefined) {
      if (data.confidence >= 80) {
        badgeColor = 'green';
      } else if (data.confidence >= 50) {
        badgeColor = 'yellow';
      } else {
        badgeColor = 'red';
      }
    }

    return (
      <>
        <BaseEdge
          path={edgePath}
          markerEnd={markerEnd}
          style={{ ...style, strokeDasharray: selected ? undefined : '5, 5' }}
        />
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
                  color={badgeColor}
                  style={{ cursor: 'pointer', fontSize: 5, height: 8, padding: '0 4px' }}
                >
                  {data?.label || t('placeholder.unknown') + t('entity.relation.name')}
                </Badge>
              </HoverCard.Target>
              <HoverCard.Dropdown>
                {data ? (
                  <RelationCard data={data} readonly={true} />
                ) : (
                  <Text size="sm">{t('placeholder.unknown') + t('entity.relation.name')}</Text>
                )}
              </HoverCard.Dropdown>
            </HoverCard>
          </div>
        </EdgeLabelRenderer>
      </>
    );
  },
);
