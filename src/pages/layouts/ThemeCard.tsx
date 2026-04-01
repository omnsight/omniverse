import {
  UnstyledButton,
  Text,
  Paper,
  Group,
  Stack,
  Box,
  rem,
  type MantineColorScheme,
  useMantineTheme,
  Divider,
} from '@mantine/core';
import { CheckCircleIcon } from '@heroicons/react/24/solid';
import classes from './ThemeCard.module.css';

interface ThemeCardProps {
  mode: MantineColorScheme;
  title: string;
  selected: boolean;
  disabled?: boolean; // New prop
  onClick: () => void;
}

export function ThemeCard({ mode, title, selected, disabled, onClick }: ThemeCardProps) {
  const theme = useMantineTheme();
  const isDark = mode === 'dark';

  // Fixed colors for the preview area so they don't change with the app theme
  const previewBg = isDark ? theme.colors.dark[7] : theme.white;
  const previewBorder = isDark ? theme.colors.dark[4] : theme.colors.gray[3];
  const subElementColor = isDark ? theme.colors.dark[5] : theme.colors.gray[2];

  return (
    <UnstyledButton
      onClick={disabled ? undefined : onClick}
      className={classes.button}
      data-checked={selected && !disabled ? 'true' : undefined}
      style={{
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.5 : 1,
        transition: 'opacity 200ms ease',
      }}
    >
      <Paper
        withBorder
        radius="md"
        p="xl"
        style={{
          backgroundColor: previewBg,
          borderColor: selected && !disabled ? theme.colors[theme.primaryColor][6] : previewBorder,
        }}
      >
        {/* PREVIEW AREA */}
        <Group grow mb="xl">
          {/* 3 Stacked Circles */}
          <Stack gap="xs">
            <Box
              style={{
                width: rem(24),
                height: rem(24),
                borderRadius: '50%',
                backgroundColor: subElementColor,
              }}
            />
            <Box
              style={{
                width: rem(34),
                height: rem(34),
                borderRadius: '50%',
                backgroundColor: `var(--mantine-color-${theme.primaryColor}-filled)`,
              }}
            />
            <Box
              style={{
                width: rem(28),
                height: rem(28),
                borderRadius: '50%',
                backgroundColor: subElementColor,
              }}
            />
          </Stack>

          {/* 3 Stacked Rectangles */}
          <Stack gap="md">
            <Box
              style={{
                width: '70%',
                height: rem(14),
                borderRadius: rem(4),
                backgroundColor: subElementColor,
              }}
            />
            <Box
              style={{
                width: '100%',
                height: rem(22),
                borderRadius: rem(4),
                backgroundColor: `var(--mantine-color-${theme.primaryColor}-filled)`,
              }}
            />
            <Box
              style={{
                width: '85%',
                height: rem(16),
                borderRadius: rem(4),
                backgroundColor: subElementColor,
              }}
            />
          </Stack>
        </Group>

        <Divider mb="md" color={previewBorder} />

        {/* BOTTOM LABEL & CHECK */}
        <Group justify="space-between">
          <Text fw={600} size="xl" c={isDark ? 'gray.0' : 'dark.9'}>
            {title}
          </Text>

          <Box style={{ width: rem(28), height: rem(28) }}>
            {selected && !disabled ? (
              <CheckCircleIcon
                style={{ color: `var(--mantine-color-${theme.primaryColor}-filled)` }}
              />
            ) : (
              <Box
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: `2px solid ${previewBorder}`,
                }}
              />
            )}
          </Box>
        </Group>
      </Paper>
    </UnstyledButton>
  );
}
