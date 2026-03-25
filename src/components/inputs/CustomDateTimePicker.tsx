import React, { useState, useEffect } from 'react';
import { DateTimePicker } from '@mantine/dates';
import { Group } from '@mantine/core';
import { TimezoneSelectComponent } from './TimezoneSelect';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

interface Props {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  error?: string;
}

export const CustomDateTimePicker: React.FC<Props> = ({ value, onChange, placeholder, error }) => {
  const [timezone, setTimezone] = useState(Intl.DateTimeFormat().resolvedOptions().timeZone);
  const [zonedDate, setZonedDate] = useState<Date | null>(null);

  useEffect(() => {
    if (value) {
      setZonedDate(toZonedTime(value, timezone));
    } else {
      setZonedDate(null);
    }
  }, [value, timezone]);

  const handleDateChange = (date: string | null) => {
    if (date) {
      const dateObj = new Date(date);
      if (!isNaN(dateObj.getTime())) {
        const utcDate = fromZonedTime(dateObj, timezone);
        onChange(utcDate);
      } else {
        onChange(null);
      }
    } else {
      onChange(null);
    }
  };

  return (
    <Group grow>
      <DateTimePicker
        value={zonedDate}
        onChange={handleDateChange}
        placeholder={placeholder}
        error={error}
      />
      <TimezoneSelectComponent timezone={timezone} setTimezone={setTimezone} />
    </Group>
  );
};
