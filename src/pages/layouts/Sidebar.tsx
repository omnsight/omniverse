import { AppShell, Group, Text, NavLink, rem, Stack, Divider } from '@mantine/core';
import { LightBulbIcon, EyeIcon, UserCircleIcon } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../provider/AuthContext';

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { user, hasRole } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppShell.Navbar
      p="sm"
      style={{ borderRight: '1px solid var(--mantine-color-default-border)' }}
    >
      {/* --- Header / Logo --- */}
      <AppShell.Section>
        <Group gap="sm" mb="md" px="xs" wrap="nowrap">
          <img
            src="/nexus-icon-transparent.svg"
            style={{ width: rem(34), flexShrink: 0 }}
            alt="logo"
          />
          <Stack gap={0}>
            <Text fw={700} size="md" lh={1}>
              {t('pages.layouts.Sidebar.logo')}
            </Text>
            <Text size={rem(10)} c="dimmed" lh={1.2}>
              {t('pages.layouts.Sidebar.subtitle')}
            </Text>
          </Stack>
        </Group>
        <Divider mb="sm" />
      </AppShell.Section>

      {/* --- Main Navigation --- */}
      <AppShell.Section grow>
        <NavLink
          label={t('pages.layouts.Sidebar.intelligence')}
          leftSection={<LightBulbIcon style={{ width: rem(20) }} />}
          active={isActive('/intelligence')}
          variant="light"
          color="blue"
          onClick={() => navigate('/intelligence')}
        />
        {user && (
          <NavLink
            label={t('pages.layouts.Sidebar.monitor')}
            leftSection={<EyeIcon style={{ width: rem(20) }} />}
            active={isActive('/monitor')}
            variant="light"
            color="blue"
            onClick={() => navigate('/monitor')}
          />
        )}
        {hasRole('admin') && (
          <NavLink
            label={t('pages.layouts.Sidebar.admin')}
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
