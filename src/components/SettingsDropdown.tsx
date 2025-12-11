import {
  Menu,
  ActionIcon,
  rem,
  Switch,
  Divider,
  useMantineColorScheme,
  Select
} from '@mantine/core';
import {
  Cog6ToothIcon,
  SunIcon,
  MoonIcon,
  ComputerDesktopIcon
} from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';

interface SettingsDropdownProps {
  onLanguageChange?: (language: string) => void;
}

export function SettingsDropdown({ onLanguageChange }: SettingsDropdownProps) {
  const { t, i18n } = useTranslation();
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
    onLanguageChange?.(lang);
  };

  return (
    <Menu shadow="md" width={200} position="bottom-end">
      <Menu.Target>
        <ActionIcon
          variant="default"
          size="lg"
          title={t('navbar.settings')}
          radius="md"
        >
          <Cog6ToothIcon style={{ width: rem(18), height: rem(18) }} />
        </ActionIcon>
      </Menu.Target>

      <Menu.Dropdown>
        <Menu.Label>{t('common.theme')}</Menu.Label>
        <Menu.Item
          leftSection={<SunIcon style={{ width: rem(16), height: rem(16) }} />}
          onClick={() => setColorScheme('light')}
          rightSection={
            <Switch size="xs" checked={colorScheme === 'light'} readOnly />
          }
        >
          {t('common.lightMode')}
        </Menu.Item>
        <Menu.Item
          leftSection={<MoonIcon style={{ width: rem(16), height: rem(16) }} />}
          onClick={() => setColorScheme('dark')}
          rightSection={
            <Switch size="xs" checked={colorScheme === 'dark'} readOnly />
          }
        >
          {t('common.darkMode')}
        </Menu.Item>
        <Menu.Item
          leftSection={
            <ComputerDesktopIcon style={{ width: rem(16), height: rem(16) }} />
          }
          onClick={() => setColorScheme('auto')}
          rightSection={
            <Switch size="xs" checked={colorScheme === 'auto'} readOnly />
          }
        >
          {t('common.system')}
        </Menu.Item>

        <Divider my="xs" />

        <Menu.Label>{t('common.language')}</Menu.Label>
        <Select
          data={[
            { value: 'en', label: t('common.english') },
            { value: 'zh', label: t('common.chinese') }
          ]}
          value={i18n.language}
          onChange={(value) => value && handleLanguageChange(value)}
          placeholder={t('common.selectLanguage')}
          size="xs"
          mx="xs"
          mb="xs"
        />
      </Menu.Dropdown>
    </Menu>
  );
}