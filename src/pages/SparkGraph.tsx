import { EntityGraph } from '../components/graph/EntityGraph';
import { Box } from '@mantine/core';
import { useEntitiesRelations } from '../store/localData';
import { useState } from 'react';
import type { GraphMode } from '../components/graph/types';

export const SparkGraph: React.FC = () => {
  const { events, persons, organizations, websites, sources, relations } = useEntitiesRelations();
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [mode, setMode] = useState<GraphMode>('graph');

  return (
    <Box style={{ height: '100%', width: '100%' }}>
      <EntityGraph
        events={events}
        persons={persons}
        organizations={organizations}
        websites={websites}
        sources={sources}
        relations={relations}
        selectedNodeIds={selectedNodeIds}
        setSelectedNodeIds={setSelectedNodeIds}
        mode={mode}
        setMode={setMode}
      />
    </Box>
  );
};
