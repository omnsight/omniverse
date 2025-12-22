import React from 'react';
import { Stack, TextInput, NumberInput, Textarea } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import type { V1Relation } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { getLocalizedAttribute } from '../common/localeSupport';

interface Props {
  data: V1Relation;
  onChange?: (data: Partial<V1Relation>) => void;
}

export const RelationForm: React.FC<Props> = ({ data, onChange }) => {
  const { t, i18n } = useTranslation();

  return (
    <Stack>
      <TextInput
        label={t('entity.relation.Form.relationType')}
        defaultValue={getLocalizedAttribute(data, 'Name', i18n.language) || data?.name}
        placeholder={t('entity.relation.Form.enterRelationType')}
        onChange={(e) => onChange?.({ name: e.target.value })}
      />
      <NumberInput
        label={t('entity.relation.Form.confidence')}
        defaultValue={data?.confidence}
        placeholder={t('entity.relation.Form.enterConfidence')}
        onChange={(val) => onChange?.({ confidence: Number(val) })}
      />
      <Textarea
        label={t('entity.relation.Form.notes')}
        autosize
        minRows={2}
        placeholder={t('entity.relation.Form.enterNotes')}
      />
    </Stack>
  );
};
