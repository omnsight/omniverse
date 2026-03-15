import React, { useEffect } from 'react';
import {
  useNetworkWindowManagerStore,
  useNetworkWindowManagerActions,
} from './networkWindowManager';
import { Box, Group, ActionIcon } from '@mantine/core';
import { ChevronLeftIcon, ChevronRightIcon, MinusIcon } from '@heroicons/react/24/solid';
import { SparkGraph } from './SparkGraph';
import { TimelineGraph } from './TimelineGraph';
import { ComparisonView } from './ComparsionView';

export const NetworkWindowManager: React.FC = () => {
  const { windows, activeIndex } = useNetworkWindowManagerStore();
  const { registerWindow, setActiveWindow } = useNetworkWindowManagerActions();

  useEffect(() => {
    if (windows.length === 0) {
      registerWindow('Spark', SparkGraph);
      registerWindow('Timeline', TimelineGraph);
      registerWindow('Comparison', ComparisonView);
    }
  }, [registerWindow, windows.length]);

  const ActiveComponent = windows[activeIndex]?.component;

  if (!ActiveComponent) {
    return null;
  }

  return (
    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
      <ActiveComponent />
      {windows.length > 1 && (
        <Box
          style={{
            position: 'absolute',
            bottom: 20,
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 300,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Group>
            <ActionIcon
              onClick={() => setActiveWindow((activeIndex - 1 + windows.length) % windows.length)}
              variant="default"
              size="lg"
            >
              <ChevronLeftIcon style={{ width: 16, height: 16 }} />
            </ActionIcon>
            <ActionIcon variant="filled" size="lg" disabled>
              <MinusIcon style={{ width: 16, height: 16 }} />
            </ActionIcon>
            <ActionIcon
              onClick={() => setActiveWindow((activeIndex + 1) % windows.length)}
              variant="default"
              size="lg"
            >
              <ChevronRightIcon style={{ width: 16, height: 16 }} />
            </ActionIcon>
          </Group>
        </Box>
      )}
    </Box>
  );
};
