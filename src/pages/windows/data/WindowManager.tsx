import React, { useEffect } from 'react';
import { useDataWindowManagerStore, useDataWindowManagerActions } from './windowManager';
import { Box, Group, ActionIcon } from '@mantine/core';
import { ChevronLeftIcon, ChevronRightIcon, MinusIcon } from '@heroicons/react/24/solid';
import { EntityListWindow } from './EntityListWindow';
import { EntityWindow } from './EntityWindow';

export const DataWindowManager: React.FC = () => {
  const { windows, activeIndex } = useDataWindowManagerStore();
  const { registerWindow, setActiveWindow } = useDataWindowManagerActions();

  useEffect(() => {
    if (windows.length === 0) {
      registerWindow('EntityList', EntityListWindow);
      registerWindow('Entity', EntityWindow);
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
