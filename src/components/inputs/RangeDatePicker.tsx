import React from 'react';
import { Group, Button, Stack, Text } from '@mantine/core';
import { DatePicker } from '@mantine/dates';
import { notifications } from '@mantine/notifications';
import { useTranslation } from 'react-i18next';

interface Props {
  dateRange: [Date | undefined, Date | undefined];
  setDateRange: (val: [Date | undefined, Date | undefined]) => void;
}

export const RangeDatePicker: React.FC<Props> = ({ dateRange, setDateRange }) => {
  const { i18n, t } = useTranslation();

  const handleDateChange = (val: [string | null, string | null]) => {
    if (val[0] && val[1]) {
      const [sYear, sMonth, sDay] = val[0].split('-').map(Number);
      const [eYear, eMonth, eDay] = val[1].split('-').map(Number);
      const start = new Date(sYear, sMonth - 1, sDay);
      const end = new Date(eYear, eMonth - 1, eDay);
      end.setHours(23, 59, 59, 999);

      const maxEndDate = new Date(start);
      maxEndDate.setMonth(maxEndDate.getMonth() + 1);

      if (end > maxEndDate) {
        notifications.show({
          title: t('components.inputs.RangeDatePicker.dateLimitExceeded'),
          message: t('components.inputs.RangeDatePicker.dateLimitMessage'),
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
  };

  return (
    <Group align="flex-start">
      <Stack gap="xs">
        <Text size="sm" fw={500} mb={5}>
          {t('components.inputs.RangeDatePicker.dateRange')}
        </Text>
        <Button variant="light" size="xs" onClick={() => applyPreset('today')}>
          {t('components.inputs.RangeDatePicker.today')}
        </Button>
        <Button variant="light" size="xs" onClick={() => applyPreset('yesterday')}>
          {t('components.inputs.RangeDatePicker.yesterday')}
        </Button>
        <Button variant="light" size="xs" onClick={() => applyPreset('lastWeek')}>
          {t('components.inputs.RangeDatePicker.lastWeek')}
        </Button>
        <Button variant="light" size="xs" onClick={() => applyPreset('lastMonth')}>
          {t('components.inputs.RangeDatePicker.lastMonth')}
        </Button>
      </Stack>
      <Stack gap="xs">
        <Text size="sm" fw={500} mb={5}>
          {t('components.inputs.RangeDatePicker.selectDateRange')}
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
  );
};
