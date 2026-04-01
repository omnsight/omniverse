import {
  Grid,
  NavLink,
  ScrollArea,
  Title,
  Group,
  Avatar,
  Box,
  Text,
  Stack,
  useMantineColorScheme,
  Checkbox,
  Select,
  rem,
  Container,
  Divider,
  SimpleGrid,
  ColorSwatch,
  UnstyledButton,
} from '@mantine/core';
import { UserCircleIcon } from '@heroicons/react/24/solid';
import { ClockIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { useRef, useState } from 'react';
import { useAuth } from '@/provider/AuthContext';
import { TimezoneSelectComponent } from '@omnsight/osint-entity-components/inputs';
import { ThemeCard } from './layouts/ThemeCard';
import { useNavColorStore } from '@/stores/themeStore';

const PRESET_COLORS = [
  { label: 'color.warm-white', value: '#ffffffff' },
  { label: 'color.minty', value: '#e7fdf8ff' },
  { label: 'color.sky', value: '#cfeaffff' },
  { label: 'color.water', value: '#145795ff' },
  { label: 'color.navy', value: '#0e3d69ff' },
];

export const UserProfile = () => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const { navColor, setNavColor } = useNavColorStore();
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [activeSection, setActiveSection] = useState('my-account');
  const viewport = useRef<HTMLDivElement>(null);
  const isSystemDefault = colorScheme === 'auto';

  const handleNavClick = (id: string) => {
    setActiveSection(id);
    const element = document.getElementById(id);
    if (element && viewport.current) {
      viewport.current.scrollTo({ top: element.offsetTop, behavior: 'smooth' });
    }
  };

  const handleSystemDefaultChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.currentTarget.checked) {
      setColorScheme('auto');
    } else {
      // Default to light if they turn off auto
      setColorScheme('light');
    }
  };

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <Grid style={{ height: '100%', width: '100%' }}>
      <Grid.Col span={2} style={{ borderRight: '1px solid #ccc' }}>
        <Title order={2} p="md">
          {t('pages.UserProfile.settings')}
        </Title>
        <Stack gap="md" px="xs">
          <NavLink
            active={activeSection === 'my-account'}
            label={<Title order={4}>{t('pages.UserProfile.myAccount')}</Title>}
            leftSection={<UserCircleIcon style={{ width: rem(28) }} />}
            onClick={() => handleNavClick('my-account')}
            variant="filled"
            py="md"
            styles={{
              root: { borderRadius: rem(8) },
              label: { transition: 'transform 200ms ease' },
            }}
          />
          <NavLink
            active={activeSection === 'general-settings'}
            label={<Title order={4}>{t('pages.UserProfile.generalSettings')}</Title>}
            leftSection={<Cog6ToothIcon style={{ width: rem(28) }} />}
            onClick={() => handleNavClick('general-settings')}
            variant="filled"
            py="md"
            styles={{
              root: { borderRadius: rem(8) },
              label: { transition: 'transform 200ms ease' },
            }}
          />
          <NavLink
            active={activeSection === 'date-time'}
            label={<Title order={4}>{t('pages.UserProfile.dateTime')}</Title>}
            leftSection={<ClockIcon style={{ width: rem(28) }} />}
            onClick={() => handleNavClick('date-time')}
            variant="filled"
            py="md"
            styles={{
              root: { borderRadius: rem(8) },
              label: { transition: 'transform 200ms ease' },
            }}
          />
        </Stack>
      </Grid.Col>
      <Grid.Col span={10}>
        <ScrollArea viewportRef={viewport} style={{ height: '100vh' }}>
          <Container size="md" py="xl">
            <Stack gap={50}>
              {/* SECTION: MY ACCOUNT */}
              <Box id="my-account" component="section">
                <Title order={2} mb="lg">
                  {t('pages.UserProfile.myAccount')}
                </Title>
                <Group gap="xl">
                  <Avatar size={80} radius="xl" color="blue">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </Avatar>
                  <Stack gap={4}>
                    <Text size="xl" fw={600}>
                      {user?.firstName} {user?.lastName}
                    </Text>
                    <Text size="lg" c="dimmed">
                      {user?.email}
                    </Text>
                    <Text size="sm" c="dimmed">
                      {t('pages.UserProfile.userId')}: {user?.id}
                    </Text>
                  </Stack>
                </Group>
                <Text size="lg" fw={500} mt="xl">
                  {t('pages.UserProfile.roles')}: {user?.roles.join(', ')}
                </Text>
              </Box>

              <Divider />
              {/* SECTION: GENERAL SETTINGS */}
              <Box id="general-settings" component="section">
                <Title order={2} mb="xl">
                  {t('pages.UserProfile.generalSettings')}
                </Title>

                <Stack gap="xl">
                  <Box>
                    <Title order={4} mb="sm">
                      {t('pages.UserProfile.theme')}
                    </Title>
                    <Checkbox
                      mb="xl"
                      size="md"
                      label={<Text size="lg">{t('pages.UserProfile.systemDefault')}</Text>}
                      checked={isSystemDefault}
                      onChange={handleSystemDefaultChange}
                    />
                    {/* Container for the two cards */}
                    <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="xl">
                      {/* Light Mode Card */}
                      <ThemeCard
                        mode="light"
                        title={t('pages.UserProfile.lightMode')}
                        selected={colorScheme === 'light'}
                        disabled={isSystemDefault}
                        onClick={() => setColorScheme('light')}
                      />

                      {/* Dark Mode Card */}
                      <ThemeCard
                        mode="dark"
                        title={t('pages.UserProfile.darkMode')}
                        selected={colorScheme === 'dark'}
                        disabled={isSystemDefault}
                        onClick={() => setColorScheme('dark')}
                      />
                    </SimpleGrid>
                  </Box>

                  <Box>
                    <Title order={4} mb="sm">
                      {t('pages.UserProfile.navColor')}
                    </Title>
                    <Group gap="lg">
                      {PRESET_COLORS.map((color) => (
                        <Stack align="center" gap="lg" key={color.value}>
                          <UnstyledButton
                            onClick={() => setNavColor(color.value)}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: rem(90),
                              height: rem(90),
                              borderRadius: '50%',
                              border: `2px solid ${navColor === color.value ? 'var(--mantine-color-blue-filled)' : 'transparent'}`,
                              transition: 'border-color 200ms ease, transform 100ms ease',
                            }}
                          >
                            <ColorSwatch
                              color={color.value}
                              size={80}
                              withShadow={false}
                              style={{
                                cursor: 'pointer',
                              }}
                            />
                          </UnstyledButton>
                          <Text size="lg" fw={400} c="dimmed">
                            {t(color.label)}
                          </Text>
                        </Stack>
                      ))}
                    </Group>
                  </Box>

                  <Box>
                    <Title order={4} mb="sm">
                      {t('pages.UserProfile.language')}
                    </Title>
                    <Select
                      size="lg"
                      max={400}
                      data={[
                        { value: 'en', label: t('pages.UserProfile.english') },
                        { value: 'zh', label: t('pages.UserProfile.chinese') },
                      ]}
                      value={i18n.language}
                      onChange={(value) => value && handleLanguageChange(value)}
                      placeholder={t('pages.UserProfile.selectLanguage')}
                    />
                  </Box>
                </Stack>
              </Box>

              <Divider />
              {/* SECTION: DATE & TIME */}
              <Box id="date-time" component="section" pb={100}>
                {/* Extra padding at bottom for scroll-to */}
                <Title order={2} mb="xl">
                  {t('pages.UserProfile.dateTime')}
                </Title>
                <Group gap="sm">
                  <Title order={4} mb="sm">
                    {t('pages.UserProfile.timezone')}:
                  </Title>
                  <TimezoneSelectComponent timezone={timezone} setTimezone={setTimezone} />
                </Group>
              </Box>
            </Stack>
          </Container>
        </ScrollArea>
      </Grid.Col>
    </Grid>
  );
};
