import { Group, Panel } from 'react-resizable-panels';
import { Box } from '@mantine/core';
import { WindowManager } from './windows/WindowManager';
import { EntityListWindow } from './windows/data/EntityListWindow';
import { EntityWindow } from './windows/data/EntityWindow';
import { SparkGraph } from './windows/network/SparkGraph';
import { MonitorListWindow } from './windows/monitor/MonitorListWindow';
import { MonitorWindow } from './windows/monitor/MonitorWindow';
import { CustomSeparator } from './layouts/CustomSeparator';
import { MapWindow } from './windows/main/MapWindow';
import { InsightListWindow } from './windows/insight/InsightListWindow';
import { InsightWindow } from './windows/insight/InsightWindow';
import { useAuth } from '@/provider/AuthContext';
import { Navigate } from 'react-router-dom';

export const MonitorDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/redirect" replace />;
  }

  return (
    <Box h="100%" w="100%" bg="light-dark(gray.0, dark.8)">
      {/* 1. MAIN HORIZONTAL GROUP */}
      <Group orientation="horizontal">
        {/* Monitor Window */}
        <Panel defaultSize={20} minSize={10}>
          <WindowManager
            name="Monitor"
            windows={[
              { name: 'MonitorList', component: MonitorListWindow },
              { name: 'Monitor', component: MonitorWindow },
            ]}
          />
        </Panel>

        <CustomSeparator orientation="horizontal" />

        {/* Main Window */}
        <Panel defaultSize={60} minSize={30}>
          <WindowManager
            name="Main"
            windows={[
              { name: 'Map', component: MapWindow },
              { name: 'Spark', component: SparkGraph },
            ]}
          />
        </Panel>

        <CustomSeparator orientation="horizontal" />

        {/* RIGHT RAIL */}
        <Panel defaultSize={20} minSize={10}>
          <Group orientation="vertical">
            {/* Network Window */}
            <Panel minSize={15}>
              <WindowManager
                name="Insight"
                windows={[
                  { name: 'InsightList', component: InsightListWindow },
                  { name: 'Insight', component: InsightWindow },
                ]}
              />
            </Panel>
            <CustomSeparator orientation="vertical" />
            {/* Raw Data Window */}
            <Panel minSize={15}>
              <WindowManager
                name="Entity"
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
