import { AppShell, Group, Burger } from '@mantine/core';
import { GlobalSearch } from './GlobalSearch';
import { SettingsDropdown } from './SettingsDropdown';

interface AppNavbarProps {
  opened: boolean;
  toggle: () => void;
}

export function AppNavbar({ opened, toggle }: AppNavbarProps) {

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group style={{ flex: 1 }}>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <GlobalSearch />
        </Group>

        <Group>
          <SettingsDropdown />
        </Group>
      </Group>
    </AppShell.Header>
  );
}