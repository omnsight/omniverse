import React from 'react';
import { Stack, TextInput, Textarea, TagsInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { DateTimePicker } from '@mantine/dates';
import type { V1Website } from '@omnsight/clients/dist/omndapi/omndapi.js';
import '../EntityStyles.css';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  data?: V1Website;
  onChange?: (data: Partial<V1Website>) => void;
}

export const WebsiteForm: React.FC<Props> = ({ data, onChange }) => {
  const { t, i18n } = useTranslation();

  return (
    <Stack>
      <TextInput
        label="URL"
        placeholder={t('entity.website.Form.enterUrl')}
        defaultValue={data?.url}
        onChange={(e) => onChange?.({ url: e.target.value })}
      />
      <TextInput
        label={t('entity.website.Form.title')}
        placeholder={t('entity.website.Form.enterTitle')}
        defaultValue={getLocalizedAttribute(data, 'Title', i18n.language) || data?.title}
        onChange={(e) => onChange?.({ title: e.target.value })}
      />
      <Textarea
        label={t('entity.website.Form.description')}
        placeholder={t('entity.website.Form.enterDescription')}
        defaultValue={
          getLocalizedAttribute(data, 'Description', i18n.language) || data?.description
        }
        onChange={(e) => onChange?.({ description: e.target.value })}
      />
      <DateTimePicker
        label={t('entity.website.Form.foundedDate')}
        placeholder={t('entity.website.Form.selectFoundedDate')}
        value={data?.foundedAt ? new Date(parseInt(data.foundedAt) * 1000) : null}
        onChange={(date) =>
          onChange?.({
            foundedAt: date ? (new Date(date).getTime() / 1000).toString() : undefined,
          })
        }
        valueFormat="YYYY-MM-DD HH:mm"
      />
      <TagsInput
        label={t('entity.website.Form.tags')}
        placeholder={t('entity.website.Form.enterTags')}
        defaultValue={getLocalizedAttribute(data, 'Tags', i18n.language) || data?.tags}
        onChange={(tags) => onChange?.({ tags })}
      />
    </Stack>
  );
};
