import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { Box, Group } from '@mantine/core';
import { useMultiWindowStore } from '../../stores/multiWindowState';

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
  name: string; // The new name prop
  windows: { name: string; component: React.FC }[];
}

export const WindowManager: React.FC<WindowManagerProps> = ({ name, windows }) => {
  const windowStates = useMultiWindowStore((s) => s.windowStates);
  const { registerManager, setActiveWindow } = useMultiWindowStore((s) => s.actions);

  useEffect(() => {
    if (windows.length > 0) {
      registerManager(name, windows[0].name);
    }
  }, [name, registerManager, windows]);

  const activeWindowName = windowStates[name] || (windows.length > 0 ? windows[0].name : undefined);

  const activeIndex = useMemo(() => {
    if (!activeWindowName) return 0;
    const index = windows.findIndex((w) => w.name === activeWindowName);
    return index !== -1 ? index : 0;
  }, [activeWindowName, windows]);

  const setActiveWindowByName = useCallback(
    (windowName: string) => {
      setActiveWindow(name, windowName);
    },
    [name, setActiveWindow],
  );

  const ActiveComponent = windows[activeIndex]?.component;

  if (!ActiveComponent) {
    return null; // Or some fallback UI
  }

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
            ':hover > & ': {
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
                onClick={() => setActiveWindow(name, win.name)}
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
