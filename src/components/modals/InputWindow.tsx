import { Button, CloseButton, Group, Paper, Stack, Text } from '@mantine/core';
import type { PropsWithChildren } from 'react';

interface Props extends PropsWithChildren {
  title: string;
  cancel: string;
  submit: string;
  onClose: () => void;
  onSubmit: () => void;
  width?: number | string;
}

export const InputWindow: React.FC<Props> = ({
  title,
  cancel,
  submit,
  onClose,
  onSubmit,
  width = 400,
  children,
}) => {
  return (
    <Paper
      w={width}
      p="md"
      my="md"
      shadow="sm"
      pos="relative"
      withBorder
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Header */}
      <Group justify="space-between" mb="md" pos="relative">
        <Text fw={700}>{title}</Text>
        <CloseButton onClick={onClose} pos="absolute" right={0} />
      </Group>

      {/* Body (The Form) */}
      <Stack gap="md" mb="md">
        {children}
      </Stack>

      {/* Footer (The Action) */}
      <Group justify="flex-end">
        <Button variant="subtle" color="gray" onClick={onClose} size="xs">
          {cancel}
        </Button>
        <Button onClick={onSubmit}>{submit}</Button>
      </Group>
    </Paper>
  );
};
