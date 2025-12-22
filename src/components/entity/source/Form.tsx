import React from 'react';
import { Stack, TextInput, NumberInput, TagsInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { V1Source } from '@omnsight/clients/dist/omndapi/omndapi.js';
import '../EntityStyles.css';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  data?: V1Source;
  onChange?: (data: Partial<V1Source>) => void;
}

export const SourceForm: React.FC<Props> = ({ data, onChange }) => {
  const { t, i18n } = useTranslation();

  return (
    <Stack>
      <TextInput
        label={t('entity.source.Form.name')}
        placeholder={t('entity.source.Form.enterName')}
        defaultValue={getLocalizedAttribute(data, 'Name', i18n.language) || data?.name}
        onChange={(e) => onChange?.({ name: e.target.value })}
      />
      <TextInput
        label="URL"
        placeholder={t('entity.source.Form.enterUrl')}
        defaultValue={data?.url}
        onChange={(e) => onChange?.({ url: e.target.value })}
      />
      <NumberInput
        label={t('entity.source.Form.reliability')}
        placeholder={t('entity.source.Form.enterReliability')}
        defaultValue={data?.reliability}
        max={100}
        min={0}
        onChange={(val) => onChange?.({ reliability: Number(val) })}
      />
      <TagsInput
        label={t('entity.source.Form.tags')}
        placeholder={t('entity.source.Form.enterTags')}
        defaultValue={getLocalizedAttribute(data, 'Tags', i18n.language) || data?.tags}
        onChange={(tags) => onChange?.({ tags })}
      />
    </Stack>
  );
};
