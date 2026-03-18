import React from 'react';
import { Paper, Stack, Text, Title } from '@mantine/core';
import { type OsintView } from 'omni-osint-crud-client';

interface InsightFormProps {
  insight: OsintView;
}

export const InsightForm: React.FC<InsightFormProps> = ({ insight }) => {
  return (
    <Paper p="md" shadow="sm" withBorder>
      <Stack>
        <Title order={4}>{insight.name}</Title>
        <Text>{insight.description}</Text>
      </Stack>
    </Paper>
  );
};
