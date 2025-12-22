import { Stack, TextInput, TagsInput } from '@mantine/core';
import type { V1Organization } from '@omnsight/clients/dist/omndapi/omndapi.js';
import { DateTimePicker } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { getLocalizedAttribute } from '../common/localeSupport';
import i18n from '../../../locales';

interface Props {
  data?: V1Organization;
  onChange?: (data: Partial<V1Organization>) => void;
}

export const OrganizationForm: React.FC<Props> = ({ data, onChange }) => {
  const { t } = useTranslation();

  return (
    <Stack>
      <TextInput
        label={t('entity.organization.Form.name')}
        placeholder={t('entity.organization.Form.enterName')}
        defaultValue={getLocalizedAttribute(data, 'Name', i18n.language) || data?.name}
        onChange={(e) => onChange?.({ name: e.target.value })}
      />
      <TextInput
        label={t('entity.organization.Form.type')}
        placeholder={t('entity.organization.Form.enterType')}
        defaultValue={getLocalizedAttribute(data, 'Type', i18n.language) || data?.type}
        onChange={(e) => onChange?.({ type: e.target.value })}
      />
      <DateTimePicker
        label={t('entity.organization.Form.foundedDate')}
        placeholder={t('entity.organization.Form.selectFoundedDate')}
        value={data?.foundedAt ? new Date(parseInt(data.foundedAt) * 1000) : null}
        onChange={(date) =>
          onChange?.({
            foundedAt: date ? (new Date(date).getTime() / 1000).toString() : undefined,
          })
        }
        valueFormat="YYYY-MM-DD HH:mm"
      />
      <DateTimePicker
        label={t('entity.organization.Form.discoveredDate')}
        placeholder={t('entity.organization.Form.selectDiscoveredDate')}
        value={data?.discoveredAt ? new Date(parseInt(data.discoveredAt) * 1000) : null}
        onChange={(date) =>
          onChange?.({
            discoveredAt: date ? (new Date(date).getTime() / 1000).toString() : undefined,
          })
        }
        valueFormat="YYYY-MM-DD HH:mm"
      />
      <TagsInput
        label={t('entity.organization.Form.tags')}
        placeholder={t('entity.organization.Form.enterTags')}
        defaultValue={getLocalizedAttribute(data, 'Tags', i18n.language) || data?.tags}
        onChange={(tags) => onChange?.({ tags })}
      />
    </Stack>
  );
};
