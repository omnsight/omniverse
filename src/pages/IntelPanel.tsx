import { Group, Panel } from 'react-resizable-panels';
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

export const IntelDashboard: React.FC = () => {
  return (
    <Box h="100%" w="100%" bg="light-dark(gray.0, dark.8)">
      <Group orientation="horizontal">
        <Panel defaultSize={20} minSize={10}>
          <Group orientation="vertical">
            {/* Context Window */}
            <Panel minSize={10}>
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
            <Panel minSize={10}>
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
        <Panel defaultSize={60} minSize={30}>
          <WindowManager
            name="main"
            windows={[
              { name: 'Map', component: MapWindow },
              { name: 'Spark', component: SparkGraph },
            ]}
          />
        </Panel>

        <CustomSeparator orientation="horizontal" />

        <Panel defaultSize={20} minSize={10}>
          <Group orientation="vertical">
            {/* Network Window */}
            <Panel minSize={10}>
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
            <Panel minSize={10}>
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
