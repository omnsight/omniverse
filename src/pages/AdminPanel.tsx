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
import { useAuth } from '@/provider/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

export const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  useEffect(() => {
    if (!hasRole('admin')) {
      navigate('/error', {
        replace: true,
        state: {
          errorName: 'requireAdmin',
        },
      });
    }
  }, [hasRole, navigate]);

  if (!hasRole('admin')) {
    return null;
  }

  return (
    <Box h="100%" w="100%" bg="light-dark(gray.0, dark.8)">
      {/* 1. MAIN HORIZONTAL GROUP */}
      <Group orientation="horizontal">
        {/* Monitor Window */}
        <Panel defaultSize={20} minSize={10}>
          <WindowManager name="EntityList" windows={[{ name: 'EntityList', component: EntityListWindow }]} />
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
                name="Network"
                windows={[
                  { name: 'Spark', component: SparkGraph },
                  { name: 'Timeline', component: TimelineGraph },
                  { name: 'Comparison', component: ComparisonView },
                ]}
              />
            </Panel>
            <CustomSeparator orientation="vertical" />
            {/* Raw Data Window */}
            <Panel minSize={15}>
              <WindowManager name="Entity" windows={[{ name: 'Entity', component: EntityWindow }]} />
            </Panel>
          </Group>
        </Panel>
      </Group>
    </Box>
  );
};
