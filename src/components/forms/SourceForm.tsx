import { Group, Text, Stack, ActionIcon } from '@mantine/core';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { type Source, type SourceMainData } from 'omni-osint-crud-client';
import { EditableNumber, EditableTags, EditableTitle, EditableText } from '../fields';

interface Props {
  source: Source;
  onUpdate?: (data: SourceMainData) => void;
  onClick?: () => void;
}

export const SourceForm: React.FC<Props> = ({ source, onUpdate, onClick }) => {
  const { t } = useTranslation();

  return (
    <Stack
      gap="xs"
      style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Group gap="xs">
        <EditableTitle
          value={source.name || source.url || ''}
          onChange={(val) => onUpdate?.({ name: val })}
          canEdit={!!onUpdate}
          placeholder={t('entity.source.title')}
          order={4}
          style={{ flex: 'initial' }}
        />
        {source.url && (
          <ActionIcon component="a" href={source.url} target="_blank" variant="subtle" size="sm">
            <ArrowTopRightOnSquareIcon style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        )}
      </Group>

      <Group gap={4} wrap="nowrap">
        <Text>{t('placeholder.url')}:</Text>
        <EditableText
          value={source.url || ''}
          onChange={(val) => onUpdate?.({ url: val })}
          canEdit={!!onUpdate}
          placeholder={t('placeholder.url')}
        />
      </Group>

      <Group gap={4}>
        <Text>{t('placeholder.reliability')}:</Text>
        <EditableNumber
          value={source.reliability || 0}
          onChange={(val) => onUpdate?.({ reliability: Number(val) })}
          canEdit={!!onUpdate}
          placeholder={t('placeholder.reliability')}
        />
      </Group>

      <EditableTags
        value={source.tags || []}
        onChange={(val) => onUpdate?.({ tags: val })}
        canEdit={!!onUpdate}
        placeholder={t('placeholder.tags')}
      />
    </Stack>
  );
};
