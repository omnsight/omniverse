import { AppShell, Group, Burger, ActionIcon, useMantineColorScheme, rem } from '@mantine/core';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';
import { GlobalSearch } from './GlobalSearch';

interface AppNavbarProps {
  opened: boolean;
  toggle: () => void;
}

export function AppNavbar({ opened, toggle }: AppNavbarProps) {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group style={{ flex: 1 }}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <GlobalSearch />
        </Group>

        <Group>
          <ActionIcon
            variant="default"
            size="lg"
            onClick={() => toggleColorScheme()}
            title="Toggle color scheme"
            radius="md"
          >
            {colorScheme === 'dark' ? (
              <SunIcon style={{ width: rem(18), height: rem(18) }} />
            ) : (
              <MoonIcon style={{ width: rem(18), height: rem(18) }} />
            )}
          </ActionIcon>
        </Group>
      </Group>
    </AppShell.Header>
  );
}