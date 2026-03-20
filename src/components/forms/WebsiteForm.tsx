import React, { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  ActionIcon,
  Divider,
  UnstyledButton,
  Collapse,
  Title,
} from '@mantine/core';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { type Website, type WebsiteMainData } from 'omni-osint-crud-client';
import {
  EditableDate,
  EditableTags,
  EditableTitle,
  EditableText,
  EditableTextarea,
  EditableAttributes,
} from '../fields';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Props {
  website: Website;
  onUpdate?: (data: WebsiteMainData) => void;
  onClick?: () => void;
  useLabel?: boolean;
  useInput?: boolean;
}

export const WebsiteForm: React.FC<Props> = ({ website, onUpdate, onClick, useLabel, useInput }) => {
  const { t } = useTranslation();
  const [attributesOpen, setAttributesOpen] = useState(false);

  return (
    <Stack
      gap="xs"
      style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <Group gap="xs">
        {useLabel && <Text size="sm" fw={500}>{t('components.forms.WebsiteForm.title')}</Text>}
        <EditableTitle
          value={website.title || ''}
          onChange={(val) => onUpdate?.({ title: val })}
          canEdit={!!onUpdate}
          useInput={useInput}
          placeholder={t('components.forms.WebsiteForm.title')}
          order={4}
          style={{ flex: 'initial' }}
        />
        {website.url && (
          <ActionIcon component="a" href={website.url} target="_blank" variant="subtle" size="sm">
            <ArrowTopRightOnSquareIcon style={{ width: '70%', height: '70%' }} />
          </ActionIcon>
        )}
      </Group>

      <Group gap={4}>
        <Text>{t('placeholder.url')}:</Text>
        <EditableText
          value={website.url ?? ''}
          onChange={(val) => onUpdate?.({ url: val })}
          canEdit={!!onUpdate}
          useInput={useInput}
          placeholder={t('placeholder.url')}
        />
      </Group>

      {useLabel && <Text size="sm" fw={500}>{t('placeholder.description')}</Text>}
      <EditableTextarea
        value={website.description || ''}
        onChange={(val) => onUpdate?.({ description: val })}
        canEdit={!!onUpdate}
        useInput={useInput}
        placeholder={t('placeholder.description')}
      />

      <Group gap={4}>
        <Text size="sm" c="dimmed">
          {t('placeholder.foundedDate')}:
        </Text>
        <EditableDate
          value={(website.founded_at || 0) * 1000}
          onChange={(date) =>
            onUpdate?.({
              founded_at: date.getTime() / 1000,
            })
          }
          canEdit={!!onUpdate}
          useInput={useInput}
          placeholder={t('placeholder.foundedDate')}
        />
      </Group>

      <Group gap={4}>
        <Text size="sm" c="dimmed">
          {t('placeholder.discoveredDate')}:
        </Text>
        <EditableDate
          value={(website.discovered_at || 0) * 1000}
          onChange={(date) =>
            onUpdate?.({
              discovered_at: date.getTime() / 1000,
            })
          }
          canEdit={!!onUpdate}
          useInput={useInput}
          placeholder={t('placeholder.discoveredDate')}
        />
      </Group>

      {useLabel && <Text size="sm" fw={500}>{t('placeholder.tags')}</Text>}
      <EditableTags
        value={website.tags || []}
        onChange={(tags) => onUpdate?.({ tags })}
        canEdit={!!onUpdate}
        useInput={useInput}
        placeholder={t('placeholder.tags')}
      />

      <Divider my="sm" />

      <UnstyledButton onClick={() => setAttributesOpen((o) => !o)}>
        <Group justify="space-between">
          <Title order={5}>{t('placeholder.attributes')}</Title>
          <ChevronDownIcon
            style={{
              width: 16,
              transform: attributesOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 200ms ease',
            }}
          />
        </Group>
      </UnstyledButton>

      <Collapse in={attributesOpen}>
        <EditableAttributes
          value={website.attributes || {}}
          onChange={(val: Record<string, any>) => onUpdate?.({ attributes: val })}
          canEdit={!!onUpdate}
        />
      </Collapse>
    </Stack>
  );
};
