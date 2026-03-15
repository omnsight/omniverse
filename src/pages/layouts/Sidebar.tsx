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
  Switch,
  Select,
  useMantineColorScheme,
} from '@mantine/core';
import {
  GlobeAltIcon,
  UserCircleIcon,
  ArrowUpCircleIcon,
  ArrowLeftCircleIcon,
  ChevronUpIcon,
  SparklesIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
  BookOpenIcon,
} from '@heroicons/react/24/solid';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../provider/AuthContext';

export const AppSidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, login, logout } = useAuth();
  const { t, i18n } = useTranslation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

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
              {t('components.Sidebar.omniverse')}
            </Text>
            <Text size={rem(10)} c="dimmed" lh={1.2}>
              {t('components.Sidebar.intelligencePlatform')}
            </Text>
          </Stack>
        </Group>
        <Divider mb="sm" />
      </AppShell.Section>

      {/* --- Main Navigation --- */}
      <AppShell.Section grow component={ScrollArea}>
        <NavLink
          label={t('components.Sidebar.geovision')}
          leftSection={<GlobeAltIcon style={{ width: rem(20) }} />}
          active={isActive('/geovision')}
          variant="light"
          color="blue"
          onClick={() => navigate('/geovision')}
        />
        <NavLink
          label={t('components.Sidebar.sparkgraph')}
          leftSection={<SparklesIcon style={{ width: rem(20) }} />}
          active={isActive('/sparkgraph')}
          variant="light"
          color="blue"
          onClick={() => navigate('/sparkgraph')}
        />
        <NavLink
          label={t('components.Sidebar.narrative')}
          leftSection={<BookOpenIcon style={{ width: rem(20) }} />}
          active={isActive('/narrative')}
          variant="light"
          color="blue"
          onClick={() => navigate('/narrative')}
        />
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
              <Menu.Label>{t('components.Sidebar.auth.application')}</Menu.Label>
              <Menu.Item leftSection={<UserCircleIcon style={{ width: rem(14) }} />}>
                {t('components.Sidebar.auth.profile')}
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>{t('components.Sidebar.theme')}</Menu.Label>
              <Menu.Item
                leftSection={<SunIcon style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => setColorScheme('light')}
                rightSection={<Switch size="xs" checked={colorScheme === 'light'} readOnly />}
              >
                {t('components.Sidebar.lightMode')}
              </Menu.Item>
              <Menu.Item
                leftSection={<MoonIcon style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => setColorScheme('dark')}
                rightSection={<Switch size="xs" checked={colorScheme === 'dark'} readOnly />}
              >
                {t('components.Sidebar.darkMode')}
              </Menu.Item>
              <Menu.Item
                leftSection={<ComputerDesktopIcon style={{ width: rem(14), height: rem(14) }} />}
                onClick={() => setColorScheme('auto')}
                rightSection={<Switch size="xs" checked={colorScheme === 'auto'} readOnly />}
              >
                {t('components.Sidebar.system')}
              </Menu.Item>

              <Menu.Divider />

              <Menu.Label>{t('components.Sidebar.language')}</Menu.Label>
              <Select
                data={[
                  { value: 'en', label: t('components.Sidebar.english') },
                  { value: 'zh', label: t('components.Sidebar.chinese') },
                ]}
                value={i18n.language}
                onChange={(value) => value && handleLanguageChange(value)}
                placeholder={t('components.Sidebar.selectLanguage')}
                size="xs"
                mx="xs"
                mb="xs"
              />

              <Menu.Divider />
              <Menu.Item
                color="red"
                onClick={logout}
                leftSection={<ArrowLeftCircleIcon style={{ width: rem(14) }} />}
              >
                {t('components.Sidebar.auth.signOut')}
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        ) : (
          <NavLink
            component="button"
            label={t('components.Sidebar.auth.login')}
            description={t('components.Sidebar.auth.accessAccount')}
            onClick={login}
            leftSection={
              <Avatar radius="xl" size="sm" color="gray">
                ?
              </Avatar>
            }
            rightSection={<ArrowUpCircleIcon style={{ width: rem(14) }} />}
            style={{ borderRadius: rem(8) }}
          />
        )}
      </AppShell.Section>
    </AppShell.Navbar>
  );
};
