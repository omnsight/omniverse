import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import { Box } from '@mantine/core';
import { useWindowStore, useWindowStoreActions } from '../../stores/windowState';

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
  side?: 'top-right' | 'bottom-right';
}

export const WindowManager: React.FC<WindowManagerProps> = ({ name, windows, side }) => {
  const windowStates = useWindowStore((s) => s.windowStates);
  const { registerManager, setActiveWindow } = useWindowStoreActions();
  const activeWindowName = windowStates[name]?.active;

  useEffect(() => {
    if (windows.length > 0) {
      registerManager(name, windows[0].name, side);
    }
  }, [name, registerManager, windows, side]);

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
      </Box>
    </WindowManagerContext.Provider>
  );
};
