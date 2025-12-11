import {
  AppShell,
  Group,
  Text,
  NavLink,
  Menu,
  Avatar,
  rem,
  Stack,
  ScrollArea,
  Divider,
} from '@mantine/core';
import {
  GlobeAltIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowUpCircleIcon,
  ArrowLeftCircleIcon,
  ChevronUpIcon,
  TableCellsIcon,
} from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../utilties/AuthProvider';
import { useTranslation } from 'react-i18next';

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, login, logout, hasRole } = useAuth();
  const { t } = useTranslation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppShell.Navbar p="sm" style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}>
      {/* --- Header / Logo --- */}
      <AppShell.Section>
        <Group gap="sm" mb="md" px="xs" wrap="nowrap">
          <GlobeAltIcon style={{ width: rem(34), flexShrink: 0 }} className="text-blue-600" />
          <Stack gap={0}>
            <Text fw={700} size="md" lh={1}>{t('sidebar.omniverse')}</Text>
            <Text size={rem(10)} c="dimmed" lh={1.2}>{t('sidebar.intelligencePlatform')}</Text>
          </Stack>
        </Group>
        <Divider mb="sm" />
      </AppShell.Section>

      {/* --- Main Navigation --- */}
      <AppShell.Section grow component={ScrollArea}>
        <NavLink
          label={t('sidebar.geovision')}
          leftSection={<GlobeAltIcon style={{ width: rem(20) }} />}
          active={isActive('/geovision')}
          variant="light"
          color="blue"
          onClick={() => navigate('/geovision')}
        />
        {hasRole('admin') && (
          <NavLink
            label={t('sidebar.dataPlane')}
            leftSection={<TableCellsIcon style={{ width: rem(20) }} />}
            active={isActive('/dataplane')}
            variant="light"
            color="blue"
            onClick={() => navigate('/dataplane')}
          />
        )}
      </AppShell.Section>

      {/* --- Bottom User Menu --- */}
      <AppShell.Section>
        <Divider mb="sm" />
        {isAuthenticated ? (
          <Menu width={200} position="top-start">
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
                rightSection={<ChevronUpIcon style={{ width: rem(8) }} />}
              />
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Label>{t('auth.application')}</Menu.Label>
              <Menu.Item leftSection={<UserCircleIcon style={{ width: rem(14) }} />}>
                {t('auth.profile')}
              </Menu.Item>
              <Menu.Item leftSection={<Cog6ToothIcon style={{ width: rem(14) }} />}>
                {t('auth.settings')}
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                color="red"
                onClick={logout}
                leftSection={<ArrowLeftCircleIcon style={{ width: rem(14) }} />}
              >
                {t('auth.signOut')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <NavLink
            component="button"
            label={t('auth.login')}
            description={t('auth.accessAccount')}
            onClick={login}
            leftSection={
              <Avatar radius="xl" size="sm" color="gray">?</Avatar>
            }
            rightSection={<ArrowUpCircleIcon style={{ width: rem(14) }} />}
            style={{ borderRadius: rem(8) }}
          />
        )}
      </AppShell.Section>
    </AppShell.Navbar>
  );
}