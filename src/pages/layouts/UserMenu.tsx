import {
  Menu,
  Avatar,
  rem,
  Switch,
  Select,
  useMantineColorScheme,
  Group,
  Text,
  ActionIcon,
} from '@mantine/core';
import {
  UserCircleIcon,
  ArrowUpCircleIcon,
  ArrowLeftCircleIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon,
} from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../provider/AuthContext';

export const UserMenu: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { isAuthenticated, user, login, logout } = useAuth();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  if (!isAuthenticated) {
    return (
      <Menu width={200}>
        <Menu.Target>
          <Avatar radius="xl" color="gray">
            <UserCircleIcon />
          </Avatar>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<ArrowUpCircleIcon style={{ width: rem(14) }} />} onClick={login}>
            {t('pages.layouts.UserMenu.login')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <Menu width={200}>
      <Menu.Target>
        <Avatar
            radius="xl"
            src={null}
            alt="User profile"
            color="blue"
            style={{ cursor: 'pointer' }}
          >
            {(user?.username || '?').charAt(0).toUpperCase()}
          </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('pages.layouts.UserMenu.account')}</Menu.Label>
        <Menu.Item leftSection={<UserCircleIcon style={{ width: rem(14) }} />}>
          {t('pages.layouts.UserMenu.profile')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>{t('pages.layouts.UserMenu.theme')}</Menu.Label>
        <Menu.Item
          leftSection={<SunIcon style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => setColorScheme('light')}
          rightSection={<Switch size="xs" checked={colorScheme === 'light'} readOnly />}
        >
          {t('pages.layouts.UserMenu.lightMode')}
        </Menu.Item>
        <Menu.Item
          leftSection={<MoonIcon style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => setColorScheme('dark')}
          rightSection={<Switch size="xs" checked={colorScheme === 'dark'} readOnly />}
        >
          {t('pages.layouts.UserMenu.darkMode')}
        </Menu.Item>
        <Menu.Item
          leftSection={<ComputerDesktopIcon style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => setColorScheme('auto')}
          rightSection={<Switch size="xs" checked={colorScheme === 'auto'} readOnly />}
        >
          {t('pages.layouts.UserMenu.systemMode')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>{t('pages.layouts.UserMenu.language')}</Menu.Label>
        <Select
          data={[
            { value: 'en', label: t('pages.layouts.UserMenu.english') },
            { value: 'zh', label: t('pages.layouts.UserMenu.chinese') },
          ]}
          value={i18n.language}
          onChange={(value) => value && handleLanguageChange(value)}
          placeholder={t('pages.layouts.UserMenu.selectLanguage')}
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
          {t('pages.layouts.UserMenu.signOut')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
