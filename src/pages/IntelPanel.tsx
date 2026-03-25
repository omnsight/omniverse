import { useEffect, useRef } from 'react';
import { Group, Panel, type PanelImperativeHandle } from 'react-resizable-panels';
import { Box } from '@mantine/core';
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

export const IntelDashboard: React.FC = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isTablet = useMediaQuery('(max-width: 1024px)');
  const isDesktop = useMediaQuery('(max-width: 1440px)');
  const isLargeScreen = useMediaQuery('(max-width: 1800px)');
  const leftPanelRef = useRef<PanelImperativeHandle>(null);
  const mainPanelRef = useRef<PanelImperativeHandle>(null);
  const rightPanelRef = useRef<PanelImperativeHandle>(null);

  useEffect(() => {
    console.log('Resizing panels', isTablet, isDesktop, isLargeScreen);
    let sizes;
    if (isMobile) {
      sizes = { side: "20%", main: "60%" };
    } else if (isTablet) {
      sizes = { side: "20%", main: "60%" };
    } else if (isDesktop) {
      sizes = { side: "30%", main: "40%" };
    } else if (isLargeScreen) {
      sizes = { side: "25%", main: "50%" };
    } else {
      sizes = { side: "20%", main: "60%" };
    }
    leftPanelRef.current?.resize(sizes.side);
    mainPanelRef.current?.resize(sizes.main);
    rightPanelRef.current?.resize(sizes.side);
  }, [isTablet, isDesktop, isLargeScreen]);

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
        <Panel panelRef={mainPanelRef} defaultSize={60}>
          <WindowManager
            name="main"
            windows={[
              { name: 'Map', component: MapWindow },
              { name: 'Spark', component: SparkGraph },
            ]}
          />
        </Panel>

        <CustomSeparator orientation="horizontal" />

        <Panel panelRef={rightPanelRef} defaultSize={20}>
          <Group orientation="vertical">
            {/* Network Window */}
            <Panel>
              <WindowManager
                name="network"
                windows={[
                  { name: 'Spark', component: SparkGraph },
                  { name: 'Timeline', component: TimelineGraph },
                  { name: 'Comparison', component: ComparisonView },
                ]}
              />
            </Panel>
            <CustomSeparator orientation="vertical" />
            {/* Raw Data Window */}
            <Panel>
              <WindowManager
                name="data"
                windows={[
                  { name: 'EntityList', component: EntityListWindow },
                  { name: 'Entity', component: EntityWindow },
                ]}
              />
            </Panel>
          </Group>
        </Panel>
      </Group>
    </Box>
  );
};
