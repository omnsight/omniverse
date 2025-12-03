import {
  AppShell,
  Group,
  Text,
  NavLink,
  Menu,
  Avatar,
  rem,
  Stack,
} from '@mantine/core';
import {
  GlobeAltIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
  ChevronRightIcon,
  TableCellsIcon,
} from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utilties/AuthProvider';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, login, logout, hasRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppShell.Navbar p="md">
      {/* --- Header / Logo --- */}
      <Group mb="xl">
        <GlobeAltIcon style={{ width: rem(28) }} className="text-blue-600" />
        <Stack gap={0}>
          <Text fw={700} size="lg" lh={1}>Omniverse</Text>
          <Text size="xs" c="dimmed">Intelligence Platform</Text>
        </Stack>
      </Group>

      {/* --- Main Navigation --- */}
      <Stack gap="xs" style={{ flex: 1 }}>
        <NavLink
          label="Geovision"
          leftSection={<GlobeAltIcon style={{ width: rem(20) }} />}
          active={isActive('/geovision')}
          variant="light"
          color="blue"
          onClick={() => navigate('/geovision')}
        />
        {hasRole('admin') && (
          <NavLink
            label="Data Plane"
            leftSection={<TableCellsIcon style={{ width: rem(20) }} />}
            active={isActive('/dataplane')}
            variant="light"
            color="blue"
            onClick={() => navigate('/dataplane')}
          />
        )}
      </Stack>

      {/* --- Bottom User Menu --- */}
      {isAuthenticated ? (
        // OPTION A: User is Logged In -> Show Menu
        <Menu shadow="md" width={260} position="right-end">
          <Menu.Target>
            <NavLink
              component="button"
              label={user?.username}
              description={user?.email}
              leftSection={
                <Avatar src={null} radius="xl" size="sm" color="blue">
                  {(user?.username || '?').charAt(0).toUpperCase()}
                </Avatar>
              }
              rightSection={<ChevronRightIcon style={{ width: rem(14) }} />}
              style={{ borderRadius: rem(8) }}
            />
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Label>Application</Menu.Label>
            <Menu.Item leftSection={<UserCircleIcon style={{ width: rem(14) }} />}>
              Profile
            </Menu.Item>
            <Menu.Item leftSection={<Cog6ToothIcon style={{ width: rem(14) }} />}>
              Settings
            </Menu.Item>
            <Menu.Divider />
            <Menu.Item
              color="red"
              onClick={logout}
              leftSection={<ArrowLeftCircleIcon style={{ width: rem(14) }} />}
            >
              Sign out
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      ) : (
        // OPTION B: User is Guest -> Show Login Button
        <NavLink
          component="button"
          label="Log in"
          description="Access your account"
          onClick={login}
          leftSection={
            <Avatar radius="xl" size="sm" color="gray">?</Avatar>
          }
          rightSection={<ArrowRightCircleIcon style={{ width: rem(14) }} />}
          style={{ borderRadius: rem(8) }}
        />
      )}
    </AppShell.Navbar>
  );
}