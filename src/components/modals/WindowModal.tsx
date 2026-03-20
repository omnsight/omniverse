import { Box, Button, CloseButton, Group, Paper, Stack, Text } from '@mantine/core';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  title: string;
  submit: string;
  onClose: () => void;
  onSubmit: () => void;
  width?: number | string;
}

export const WindowModal: React.FC<Props> = ({
  title,
  submit,
  onClose,
  onSubmit,
  width = 400,
  children,
}) => {
  return (
    <Box
      pos="absolute"
      inset={0}
      style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      {/* 1. Dimmed Background Layer */}
      <Box
        pos="absolute"
        inset={0}
        onClick={onClose}
        style={{
          backgroundColor: 'rgba(0, 0, 0, 0.4)',
          backdropFilter: 'blur(2px)',
        }}
      />

      {/* 2. The Main Window */}
      <Paper w={width} p="md" shadow="xl" withBorder pos="relative">
        {/* Header */}
        <Group justify="center" mb="md" pos="relative">
          <Text fw={700}>{title}</Text>
          <CloseButton onClick={onClose} pos="absolute" right={0} />
        </Group>

        {/* Body (The Form) */}
        <Stack gap="md" mb="xl">
          {children}
        </Stack>

        {/* Footer (The Action) */}
        <Group justify="flex-end">
          <Button onClick={onSubmit}>{submit}</Button>
        </Group>
      </Paper>
    </Box>
  );
};
