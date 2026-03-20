import { Menu, Avatar, rem, Switch, Select, useMantineColorScheme } from '@mantine/core';
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
          <Avatar component="button" radius="xl" color="gray">
            ?
          </Avatar>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item leftSection={<ArrowUpCircleIcon style={{ width: rem(14) }} />} onClick={login}>
            {t('layout.UserMenu.login')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    );
  }

  return (
    <Menu width={200}>
      <Menu.Target>
        <Avatar component="button" src={null} radius="xl" color="blue">
          {(user?.username || '?').charAt(0).toUpperCase()}
        </Avatar>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('layout.UserMenu.application')}</Menu.Label>
        <Menu.Item leftSection={<UserCircleIcon style={{ width: rem(14) }} />}>
          {t('layout.UserMenu.profile')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>{t('layout.UserMenu.theme')}</Menu.Label>
        <Menu.Item
          leftSection={<SunIcon style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => setColorScheme('light')}
          rightSection={<Switch size="xs" checked={colorScheme === 'light'} readOnly />}
        >
          {t('layout.UserMenu.lightMode')}
        </Menu.Item>
        <Menu.Item
          leftSection={<MoonIcon style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => setColorScheme('dark')}
          rightSection={<Switch size="xs" checked={colorScheme === 'dark'} readOnly />}
        >
          {t('layout.UserMenu.darkMode')}
        </Menu.Item>
        <Menu.Item
          leftSection={<ComputerDesktopIcon style={{ width: rem(14), height: rem(14) }} />}
          onClick={() => setColorScheme('auto')}
          rightSection={<Switch size="xs" checked={colorScheme === 'auto'} readOnly />}
        >
          {t('layout.UserMenu.system')}
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>{t('layout.UserMenu.language')}</Menu.Label>
        <Select
          data={[
            { value: 'en', label: t('layout.UserMenu.english') },
            { value: 'zh', label: t('layout.UserMenu.chinese') },
          ]}
          value={i18n.language}
          onChange={(value) => value && handleLanguageChange(value)}
          placeholder={t('layout.UserMenu.selectLanguage')}
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
          {t('layout.UserMenu.auth.signOut')}
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
};
