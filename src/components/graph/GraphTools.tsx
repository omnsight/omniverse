import { useTranslation } from 'react-i18next';
import { Card, Text, Group, SegmentedControl } from '@mantine/core';
import {
  useGraphToolState,
  useGraphToolStateActions,
  type GraphViewMode,
} from '../../store/graphToolState';
import { useCallback, useEffect } from 'react';
import { notifications } from '@mantine/notifications';
import { useGraphData, useGraphActions } from '../../store/graphData';
import { useSelection } from '../../store/selection';
import { getCompareLayout, getStressLayout } from './layout';
import type { NodePositionChange } from 'reactflow';

interface ViewModeOption {
  label: string;
  value: GraphViewMode;
}

export const GraphTools: React.FC = () => {
  const { t } = useTranslation();
  const { nodes } = useGraphData();
  const selectedIds = useSelection((state) => state.selectedIds);
  const selectedNodes = nodes.filter((n) => selectedIds.includes(n.id));

  const { viewMode } = useGraphToolState();
  const { changeViewMode } = useGraphToolStateActions();
  const { changeNodes } = useGraphActions();

  const viewModeOptions: ViewModeOption[] = [
    { label: t('components.GraphTools.graph'), value: 'graph' },
    { label: t('components.GraphTools.compare'), value: 'compare' },
  ];

  useEffect(() => {
    const applyLayout = async () => {
      const { nodes, edges } = useGraphData.getState();
      const { selectedIds } = useSelection.getState();
      let changes: NodePositionChange[] = [];

      if (viewMode === 'compare') {
        changes = await getCompareLayout(nodes, edges, selectedIds);
      } else if (viewMode === 'graph') {
        changes = await getStressLayout(nodes, edges);
      }

      if (changes.length > 0) {
        changeNodes(changes);
      }
    };

    applyLayout();
  }, [viewMode, changeNodes]);

  const onModeChange = useCallback(
    (mode: GraphViewMode) => {
      if (
        mode === 'compare' &&
        (selectedNodes.length < 2 ||
          selectedNodes.length > 9 ||
          !selectedNodes.every((node) => node.type === selectedNodes[0]?.type))
      ) {
        notifications.show({
          title: t('common.warning'),
          message: t('components.GraphTools.badSelection'),
          color: 'yellow',
        });
      } else if (mode !== viewMode) {
        changeViewMode(mode);
      }
    },
    [selectedNodes, viewMode, t, changeViewMode],
  );

  return (
    <Card shadow="sm" p="xs" radius="md" withBorder>
      <Group>
        <Text size="sm" fw={500}>
          {t('components.GraphTools.viewMode')}:
        </Text>
        <SegmentedControl
          value={viewMode}
          onChange={(value) => onModeChange(value as GraphViewMode)}
          data={viewModeOptions}
        />
      </Group>
    </Card>
  );
};
