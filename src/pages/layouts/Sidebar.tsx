import { AppShell, Group, Text, NavLink, rem, Stack, Divider } from '@mantine/core';
import {
  GlobeAltIcon,
  LightBulbIcon,
  ChartPieIcon,
  UserCircleIcon,
} from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../provider/AuthContext';

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { hasRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppShell.Navbar
      p="sm"
      style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}
    >
      {/* --- Header / Logo --- */}
      <AppShell.Section>
        <Group gap="sm" mb="md" px="xs" wrap="nowrap">
          <GlobeAltIcon style={{ width: rem(34), flexShrink: 0 }} className="text-blue-600" />
          <Stack gap={0}>
            <Text fw={700} size="md" lh={1}>
              {t('layout.Sidebar.omniverse')}
            </Text>
            <Text size={rem(10)} c="dimmed" lh={1.2}>
              {t('layout.Sidebar.intelligencePlatform')}
            </Text>
          </Stack>
        </Group>
        <Divider mb="sm" />
      </AppShell.Section>

      {/* --- Main Navigation --- */}
      <AppShell.Section grow>
        <NavLink
          label={t('layout.Sidebar.intelligence')}
          leftSection={<LightBulbIcon style={{ width: rem(20) }} />}
          active={isActive('/intelligence')}
          variant="light"
          color="blue"
          onClick={() => navigate('/intelligence')}
        />
        <NavLink
          label={t('layout.Sidebar.monitor')}
          leftSection={<ChartPieIcon style={{ width: rem(20) }} />}
          active={isActive('/monitor')}
          variant="light"
          color="blue"
          onClick={() => navigate('/monitor')}
        />
        {hasRole('admin') && (
          <NavLink
            label={t('layout.Sidebar.admin')}
            leftSection={<UserCircleIcon style={{ width: rem(20) }} />}
            active={isActive('/admin')}
            variant="light"
            color="blue"
            onClick={() => navigate('/admin')}
          />
        )}
      </AppShell.Section>
    </AppShell.Navbar>
  );
};
