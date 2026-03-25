import React, { useMemo } from 'react';
import { Select } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import countries from 'i18n-iso-countries';
import enLocale from 'i18n-iso-countries/langs/en.json';
import zhLocale from 'i18n-iso-countries/langs/zh.json';

// Register locales
countries.registerLocale(enLocale);
countries.registerLocale(zhLocale);

interface Props {
  country?: string;
  setCountry: (country: string) => void;
}

export const CountrySelect: React.FC<Props> = ({ country, setCountry }) => {
  const { i18n, t } = useTranslation();

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

  return (
    <Select
      placeholder={t('components.inputs.CountrySelect.select')}
      data={countryOptions}
      value={country}
      onChange={(val) => val && setCountry(val)}
      searchable
      clearable
      style={{ width: 200 }}
    />
  );
};
