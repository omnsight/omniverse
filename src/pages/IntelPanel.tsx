import { useEffect, useRef } from 'react';
import { Group, Panel, type PanelImperativeHandle } from 'react-resizable-panels';
import { ActionIcon, Box, Paper, Transition } from '@mantine/core';
import { WindowManager } from './windows/WindowManager';
import { EntityListWindow } from './windows/data/EntityListWindow';
import { EntityWindow } from './windows/data/EntityWindow';
import { SparkGraph } from './windows/network/SparkGraph';
import { TimelineGraph } from './windows/network/TimelineGraph';
import { ComparisonView } from './windows/network/ComparsionView';
import { CustomSeparator } from './layouts/CustomSeparator';
import { MapWindow } from './windows/main/MapWindow';
import { InsightListWindow } from './windows/insight/InsightListWindow';
import { InsightWindow } from './windows/insight/InsightWindow';
import { GlobalEventRecommendationWindow } from './windows/context/GlobalEventRecommendationWindow';
import { GlobalEventTimelineGraph } from './windows/context/GlobalEventTimelineWindow';
import { useMediaQuery } from '@mantine/hooks';
import {
  ArrowDownLeftIcon,
  ArrowDownRightIcon,
  ArrowUpLeftIcon,
  ArrowUpRightIcon,
} from '@heroicons/react/24/solid';
import { slideDownLeft, slideUpLeft } from './layouts/transitionSliding';
import { useWindowStore, useWindowStoreActions } from '@/stores/windowState';

export const IntelDashboard: React.FC = () => {
  const { topRightOpen, bottomRightOpen } = useWindowStore();
  const { registerManager, setTopRightOpen, setBottomRightOpen } = useWindowStoreActions();
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isDesktop = useMediaQuery('(max-width: 1440px)');
  const leftPanelRef = useRef<PanelImperativeHandle>(null);
  const mainPanelRef = useRef<PanelImperativeHandle>(null);
  const rightPanelRef = useRef<PanelImperativeHandle>(null);

  useEffect(() => {
    registerManager('network', 'Spark', 'top-right');
    registerManager('data', 'EntityList', 'bottom-right');
  }, [registerManager]);

  useEffect(() => {
    console.log('Resizing panels', isTablet, isDesktop);
    let sizes;
    if (isMobile) {
      sizes = { side: '0%', main: '100%' };
    } else if (isTablet) {
      sizes = { side: '50%', main: '50%' };
    } else if (isDesktop) {
      sizes = { side: '40%', main: '60%' };
    } else {
      sizes = { side: '25%', main: '75%' };
    }
    leftPanelRef.current?.resize(sizes.side);
    mainPanelRef.current?.resize(sizes.main);
    rightPanelRef.current?.resize(sizes.side);
  }, [isTablet, isDesktop]);

  return (
    <Box h="100%" w="100%" bg="light-dark(gray.0, dark.8)">
      <Group orientation="horizontal">
        <Panel panelRef={leftPanelRef} defaultSize={20}>
          <Group orientation="vertical">
            {/* Context Window */}
            <Panel>
              <WindowManager
                name="context"
                windows={[
                  { name: 'GlobalEventRecommendation', component: GlobalEventRecommendationWindow },
                  { name: 'GlobalEventTimeline', component: GlobalEventTimelineGraph },
                ]}
              />
            </Panel>
            <CustomSeparator orientation="vertical" />
            {/* Insight Analysis Window */}
            <Panel>
              <WindowManager
                name="insight"
                windows={[
                  { name: 'InsightList', component: InsightListWindow },
                  { name: 'Insight', component: InsightWindow },
                ]}
              />
            </Panel>
          </Group>
        </Panel>

        <CustomSeparator orientation="horizontal" />

        {/* Main Window */}
        <Panel panelRef={mainPanelRef} defaultSize={80}>
          <WindowManager
            name="main"
            windows={[
              { name: 'Map', component: MapWindow },
              { name: 'Spark', component: SparkGraph },
            ]}
          />
        </Panel>
      </Group>

      {/* Network Window - Top Right */}
      <Box
        pos="absolute"
        top="calc(var(--app-shell-header-offset))"
        right={0}
        display="flex"
        style={{
          flexDirection: 'column',
          alignItems: 'flex-end',
          zIndex: 1000,
          transition: 'top 0.2s ease',
        }}
      >
        <Transition mounted={topRightOpen} transition={slideDownLeft} duration={300}>
          {(styles) => (
            <Paper shadow="xl" withBorder w={450} h={450} style={{ ...styles, overflow: 'hidden' }}>
              <WindowManager
                name="network"
                side="top-right"
                windows={[
                  { name: 'Spark', component: SparkGraph },
                  { name: 'Timeline', component: TimelineGraph },
                  { name: 'Comparison', component: ComparisonView },
                ]}
              />
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setTopRightOpen(false)}
                pos="absolute"
                bottom={0}
                left={0}
                size="xs"
              >
                <ArrowUpRightIcon style={{ width: 14, height: 14 }} />
              </ActionIcon>
            </Paper>
          )}
        </Transition>
        {!topRightOpen && (
          <ActionIcon variant="subtle" color="gray" size="lg" onClick={() => setTopRightOpen(true)}>
            <ArrowDownLeftIcon style={{ width: 22, height: 22 }} />
          </ActionIcon>
        )}
      </Box>

      <Box
        pos="absolute"
        bottom={0}
        right={0}
        display="flex"
        style={{
          flexDirection: 'column',
          alignItems: 'flex-end',
          zIndex: 1000,
          transition: 'top 0.2s ease',
        }}
      >
        <Transition mounted={bottomRightOpen} transition={slideUpLeft} duration={300}>
          {(styles) => (
            <Paper shadow="xl" withBorder w={450} h={500} style={{ ...styles, overflow: 'hidden' }}>
              <WindowManager
                name="data"
                side="bottom-right"
                windows={[
                  { name: 'EntityList', component: EntityListWindow },
                  { name: 'Entity', component: EntityWindow },
                ]}
              />
              <ActionIcon
                variant="subtle"
                color="gray"
                onClick={() => setBottomRightOpen(false)}
                pos="absolute"
                top={0}
                left={0}
                size="xs"
              >
                <ArrowDownRightIcon style={{ width: 14, height: 14 }} />
              </ActionIcon>
            </Paper>
          )}
        </Transition>
        {!bottomRightOpen && (
          <ActionIcon
            variant="subtle"
            color="gray"
            size="lg"
            onClick={() => setBottomRightOpen(true)}
          >
            <ArrowUpLeftIcon style={{ width: 22, height: 22 }} />
          </ActionIcon>
        )}
      </Box>
    </Box>
  );
};
