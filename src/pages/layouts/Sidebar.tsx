import { AppShell, Group, Text, NavLink, rem, Stack, ScrollArea, Divider } from '@mantine/core';
import { GlobeAltIcon, SparklesIcon, BookOpenIcon } from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

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
          label={t('layout.Sidebar.geovision')}
          leftSection={<GlobeAltIcon style={{ width: rem(20) }} />}
          active={isActive('/geovision')}
          variant="light"
          color="blue"
          onClick={() => navigate('/geovision')}
        />
        <NavLink
          label={t('layout.Sidebar.sparkgraph')}
          leftSection={<SparklesIcon style={{ width: rem(20) }} />}
          active={isActive('/sparkgraph')}
          variant="light"
          color="blue"
          onClick={() => navigate('/sparkgraph')}
        />
        <NavLink
          label={t('layout.Sidebar.narrative')}
          leftSection={<BookOpenIcon style={{ width: rem(20) }} />}
          active={isActive('/narrative')}
          variant="light"
          color="blue"
          onClick={() => navigate('/narrative')}
        />
      </AppShell.Section>
    </AppShell.Navbar>
  );
};
