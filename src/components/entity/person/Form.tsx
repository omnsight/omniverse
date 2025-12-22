import React from 'react';
import { Stack, TextInput, TagsInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DateTimePicker } from '@mantine/dates';
import type { V1Person } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  data?: V1Person;
  onChange?: (data: Partial<V1Person>) => void;
}

export const PersonForm: React.FC<Props> = ({ data, onChange }) => {
  const { t, i18n } = useTranslation();

  return (
    <Stack>
      <TextInput
        label={t('entity.person.Form.name')}
        defaultValue={getLocalizedAttribute(data, 'Name', i18n.language) || data?.name}
        placeholder={t('entity.person.Form.enterName')}
        onChange={(e) => onChange?.({ name: e.target.value })}
      />
      <TextInput
        label={t('entity.person.Form.role')}
        defaultValue={getLocalizedAttribute(data, 'Role', i18n.language) || data?.role}
        placeholder={t('entity.person.Form.enterRole')}
        onChange={(e) => onChange?.({ role: e.target.value })}
      />
      <TextInput
        label={t('entity.person.Form.nationality')}
        defaultValue={
          getLocalizedAttribute(data, 'Nationality', i18n.language) || data?.nationality
        }
        placeholder={t('entity.person.Form.enterNationality')}
        onChange={(e) => onChange?.({ nationality: e.target.value })}
      />
      <DateTimePicker
        label={t('entity.person.Form.birthDate')}
        placeholder={t('entity.person.Form.selectBirthDate')}
        value={data?.birthDate ? new Date(parseInt(data.birthDate) * 1000) : null}
        onChange={(date: string | null) =>
          onChange?.({
            birthDate: date ? (new Date(date).getTime() / 1000).toString() : undefined,
          })
        }
        valueFormat="YYYY-MM-DD HH:mm"
      />
      <TagsInput
        label={t('entity.person.Form.tags')}
        placeholder={t('entity.person.Form.enterTags')}
        defaultValue={getLocalizedAttribute(data, 'Tags', i18n.language) || data?.tags || []}
        onChange={(tags) => onChange?.({ tags })}
      />
      <TagsInput
        label={t('entity.person.Form.aliases')}
        placeholder={t('entity.person.Form.enterAliases')}
        defaultValue={getLocalizedAttribute(data, 'Aliases', i18n.language) || data?.aliases || []}
        onChange={(aliases) => onChange?.({ aliases })}
      />
    </Stack>
  );
};
