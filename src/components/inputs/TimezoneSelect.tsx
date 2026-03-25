import React from 'react';
import { useTranslation } from 'react-i18next';
import TimezoneSelect from 'react-timezone-select';

interface Props {
  timezone: string;
  setTimezone: (timezone: string) => void;
}

export const TimezoneSelectComponent: React.FC<Props> = ({ timezone, setTimezone }) => {
  const { t } = useTranslation();

  return (
    <TimezoneSelect
      value={timezone}
      onChange={(tz) => setTimezone(tz.value)}
      placeholder={t('pages.layouts.TimezoneSelect.select')}
    />
  );
};
