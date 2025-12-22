import React, { useState, useMemo, useEffect } from 'react';
import { AppShell, Group, Select, Popover, Button, Stack, rem, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { CalendarDaysIcon } from '@heroicons/react/24/solid';
import { useTranslation } from 'react-i18next';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import zhLocale from 'i18n-iso-countries/langs/zh.json';
import { useQuery } from '@tanstack/react-query';
import { useDataApi } from '../../api/dataApi';
import { useLocalDataActions } from '../../store/localData';

// Register locales
countries.registerLocale(enLocale);
countries.registerLocale(zhLocale);

export const AppTopbar: React.FC = () => {
  const { i18n, t } = useTranslation();
  const dataApi = useDataApi();
  const { addEntities, addRelations } = useLocalDataActions();
  const [country, setCountry] = useState<string | undefined>(undefined);
  const [dateRange, setDateRange] = useState<[Date | undefined, Date | undefined]>(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return [start, end];
  });
  const [popoverOpened, setPopoverOpened] = useState(false);

  // Generate country list based on current language
  const countryOptions = useMemo(() => {
    // Map i18next language code to i18n-iso-countries language code
    // 'zh' in i18next -> 'zh' in i18n-iso-countries
    const lang = i18n.language.startsWith('zh') ? 'zh' : 'en';
    const countryObj = countries.getNames(lang, { select: 'official' });

    return Object.entries(countryObj)
      .map(([code, name]) => ({
        value: code,
        label: name,
      }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [i18n.language]);

  const { data: searchData, error: searchError } = useQuery({
    queryKey: ['global-search-entities', dateRange, country || ''],
    queryFn: async () => {
      const res = await dataApi.v1.entityServiceListEntitiesFromEvent({
        startTime: Math.floor(dateRange[0]!.getTime() / 1000).toString(),
        endTime: Math.floor(dateRange[1]!.getTime() / 1000).toString(),
        countryCode: country,
      });
      console.debug('searchData', res.data);
      return res.data;
    },
    enabled: !!dateRange[0] && !!dateRange[1],
    staleTime: 5 * 60 * 1000,
    retry: 1,
  });

  useEffect(() => {
    if (searchData) {
      const entities = searchData.entities || [];
      const relations = searchData.relations || [];
      addEntities(entities);
      addRelations(relations);
    }
  }, [searchData, addEntities, addRelations]);

  useEffect(() => {
    if (searchError) {
      notifications.show({
        title: t('common.Topbar.error'),
        message: t('common.Topbar.loadError'),
        color: 'red',
      });
      console.error('Failed to fetch entities', searchError);
    }
  }, [searchError, t]);

  const handleDateChange = (val: [string | null, string | null]) => {
    if (val[0] && val[1]) {
      const start = new Date(val[0]);
      const end = new Date(val[1]);
      end.setHours(23, 59, 59, 999);

      const maxEndDate = new Date(start);
      maxEndDate.setMonth(maxEndDate.getMonth() + 1);

      if (end > maxEndDate) {
        notifications.show({
          title: t('common.Topbar.dateLimitExceeded'),
          message: t('common.Topbar.dateLimitMessage'),
          color: 'orange',
        });
        setDateRange([start, maxEndDate]);
      } else {
        setDateRange([start, end]);
      }
    } else {
      setDateRange([undefined, undefined]);
    }
  };

  const applyPreset = (type: 'today' | 'yesterday' | 'lastWeek' | 'lastMonth') => {
    const end = new Date();
    const start = new Date();

    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);

    switch (type) {
      case 'today':
        // start and end are already today
        break;
      case 'yesterday':
        start.setDate(start.getDate() - 1);
        end.setDate(end.getDate() - 1);
        break;
      case 'lastWeek':
        start.setDate(start.getDate() - 7);
        break;
      case 'lastMonth':
        start.setMonth(start.getMonth() - 1);
        break;
    }
    setDateRange([start, end]);
    // Optionally close popover or keep it open
  };

  const formatDateRange = (range: [Date | undefined, Date | undefined]) => {
    if (!range[0]) return t('common.Topbar.selectDateRange');
    const startStr = range[0].toLocaleDateString();
    const endStr = range[1] ? range[1].toLocaleDateString() : '...';
    return `${startStr} - ${endStr}`;
  };

  return (
    <AppShell.Header>
      <Group h="100%" px="md" justify="space-between">
        <Group>
          <Select
            placeholder={t('common.Topbar.selectCountry')}
            data={countryOptions}
            value={country}
            onChange={(val) => val && setCountry(val)}
            searchable
            clearable
            style={{ width: 200 }}
          />

          <Popover
            opened={popoverOpened}
            onChange={setPopoverOpened}
            position="bottom-start"
            withArrow
            shadow="md"
          >
            <Popover.Target>
              <Button
                variant="default"
                leftSection={<CalendarDaysIcon style={{ width: rem(16) }} />}
                onClick={() => setPopoverOpened((o) => !o)}
              >
                {formatDateRange(dateRange)}
              </Button>
            </Popover.Target>
            <Popover.Dropdown>
              <Group align="flex-start">
                <Stack gap="xs">
                  <Text size="sm" fw={500} mb={5}>
                    {t('common.Topbar.presets')}
                  </Text>
                  <Button variant="light" size="xs" onClick={() => applyPreset('today')}>
                    {t('common.Topbar.today')}
                  </Button>
                  <Button variant="light" size="xs" onClick={() => applyPreset('yesterday')}>
                    {t('common.Topbar.yesterday')}
                  </Button>
                  <Button variant="light" size="xs" onClick={() => applyPreset('lastWeek')}>
                    {t('common.Topbar.lastWeek')}
                  </Button>
                  <Button variant="light" size="xs" onClick={() => applyPreset('lastMonth')}>
                    {t('common.Topbar.lastMonth')}
                  </Button>
                </Stack>
                <Stack gap="xs">
                  <Text size="sm" fw={500} mb={5}>
                    {t('common.Topbar.selectDateRange')}
                  </Text>
                  <DatePicker
                    type="range"
                    locale={i18n.language}
                    value={dateRange[0] && dateRange[1] && [dateRange[0], dateRange[1]]}
                    onChange={handleDateChange}
                    numberOfColumns={2}
                  />
                </Stack>
              </Group>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Group>
    </AppShell.Header>
  );
};
