import React, { useState } from 'react';
import { Box } from '@mantine/core';
import { Split } from '@gfazioli/mantine-split-pane';
import { Editor } from '../components/editor/Editor';
import type { EntityViewType } from '../store/viewMetadata';
import { SparkGraph } from './SparkGraph';
import { Geovision } from './Geovision';

export const NarrativeBoard: React.FC = () => {
  const [viewType, setViewType] = useState<EntityViewType>('sparkgraph');

  return (
    <Box h="100%" style={{ overflow: 'hidden' }}>
      <Split h="100%" w="100%">
        <Split.Pane w="100%">
          <Editor viewType={viewType} setViewType={setViewType} />
        </Split.Pane>

        <Split.Resizer />

        <Split.Pane w="100%">
          {viewType === 'sparkgraph' ? <SparkGraph /> : <Geovision />}
        </Split.Pane>
      </Split>
    </Box>
  );
};
