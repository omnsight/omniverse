import { Group, Text, Stack } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { type Organization, type OrganizationMainData } from 'omni-osint-crud-client';
import { EditableText, EditableDate, EditableTags, EditableTitle } from '../fields';

interface Props {
  organization: Organization;
  onUpdate?: (data: OrganizationMainData) => void;
  onClick?: () => void;
}

export const OrganizationForm: React.FC<Props> = ({ organization, onUpdate, onClick }) => {
  const { t } = useTranslation();

  return (
    <Stack
      gap="xs"
      key={organization._id}
      style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <EditableTitle
        value={organization.name || ''}
        onChange={(val) => onUpdate?.({ name: val })}
        canEdit={!!onUpdate}
        placeholder={t('entity.organization.name')}
        order={4}
      />

      <Group gap={4}>
        <Text size="sm" c="dimmed">
          {t('placeholder.type')}:
        </Text>
        <EditableText
          value={organization.type || ''}
          onChange={(val) => onUpdate?.({ type: val })}
          canEdit={!!onUpdate}
          placeholder={t('placeholder.type')}
        />
      </Group>

      <Group gap={4}>
        <Text size="sm" c="dimmed">
          {t('placeholder.foundedDate')}:
        </Text>
        <EditableDate
          value={(organization.founded_at || 0) * 1000}
          onChange={(date) =>
            onUpdate?.({
              founded_at: date.getTime() / 1000,
            })
          }
          canEdit={!!onUpdate}
          placeholder={t('placeholder.foundedDate')}
        />
      </Group>

      <Group gap={4}>
        <Text size="sm" c="dimmed">
          {t('placeholder.discoveredDate')}:
        </Text>
        <EditableDate
          value={(organization.discovered_at || 0) * 1000}
          onChange={(date) =>
            onUpdate?.({
              discovered_at: date.getTime() / 1000,
            })
          }
          canEdit={!!onUpdate}
          placeholder={t('placeholder.discoveredDate')}
        />
      </Group>

      <EditableTags
        value={organization.tags || []}
        onChange={(tags) => onUpdate?.({ tags })}
        canEdit={!!onUpdate}
        placeholder={t('placeholder.tags')}
      />
    </Stack>
  );
};
