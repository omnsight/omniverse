import React, { createContext, useCallback, useContext, useState } from 'react';
import { Box, Group } from '@mantine/core';

interface WindowManagerContextType {
  setActiveWindowByName: (name: string) => void;
}

const WindowManagerContext = createContext<WindowManagerContextType | undefined>(undefined);

export const useWindowManager = () => {
  const context = useContext(WindowManagerContext);
  if (!context) {
    throw new Error('useWindowManager must be used within a WindowManagerProvider');
  }
  return context;
};

interface WindowManagerProps {
  windows: { name: string; component: React.FC }[];
}

export const WindowManager: React.FC<WindowManagerProps> = ({ windows }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const setActiveWindowByName = useCallback(
    (name: string) => {
      const index = windows.findIndex((w) => w.name === name);
      if (index !== -1) {
        setActiveIndex(index);
      }
    },
    [windows],
  );

  const ActiveComponent = windows[activeIndex].component;

  return (
    <WindowManagerContext.Provider value={{ setActiveWindowByName }}>
      <Box pos="relative" h="100%" w="100%" style={{ overflow: 'hidden' }}>
        {/* The Actual Content */}
        <ActiveComponent />

        {/* The Floating Navigation (Dots) */}
        <Box
          pos="absolute"
          bottom={15}
          left="50%"
          style={{
            transform: 'translateX(-50%)',
            zIndex: 1000,
            opacity: 0,
            transition: 'opacity 0.2s ease, visibility 0.2s',
            pointerEvents: 'none',
            ':parent:hover &': {
              opacity: 1,
              visibility: 'visible',
              pointerEvents: 'all',
            },
            '.mantineBoxRoot:hover &': {
              opacity: 1,
              visibility: 'visible',
              pointerEvents: 'all',
            },
          }}
        >
          <Group
            gap="xs"
            p="xs"
            style={{
              borderRadius: 100,
              backdropFilter: 'blur(4px)',
            }}
          >
            {windows.map((win, idx) => (
              <Box
                key={win.name}
                onClick={() => setActiveIndex(idx)}
                style={{
                  width: activeIndex === idx ? 20 : 8, // Active dot is wider
                  height: 8,
                  borderRadius: 4,
                  backgroundColor:
                    activeIndex === idx
                      ? 'var(--mantine-color-blue-filled)'
                      : 'var(--mantine-color-gray-4)',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                }}
              />
            ))}
          </Group>
        </Box>
      </Box>
    </WindowManagerContext.Provider>
  );
};
