import { Group, Text, Stack, Divider, UnstyledButton, Collapse, Title } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { type Organization, type OrganizationMainData } from 'omni-osint-crud-client';
import {
  EditableText,
  EditableDate,
  EditableTags,
  EditableTitle,
  EditableAttributes,
} from '../fields';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface Props {
  organization: Organization;
  onUpdate?: (data: OrganizationMainData) => void;
  onClick?: () => void;
  useLabel?: boolean;
  useInput?: boolean;
}

export const OrganizationForm: React.FC<Props> = ({ organization, onUpdate, onClick, useLabel, useInput }) => {
  const { t } = useTranslation();
  const [attributesOpen, setAttributesOpen] = useState(false);

  return (
    <Stack
      gap="xs"
      key={organization._id}
      style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      {useLabel && <Text size="sm" fw={500}>{t('components.forms.OrganizationForm.name')}</Text>}
      <EditableTitle
        value={organization.name || ''}
        onChange={(val) => onUpdate?.({ name: val })}
        canEdit={!!onUpdate}
        useInput={useInput}
        placeholder={t('components.forms.OrganizationForm.name')}
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
          useInput={useInput}
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
          useInput={useInput}
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
          useInput={useInput}
          placeholder={t('placeholder.discoveredDate')}
        />
      </Group>

      {useLabel && <Text size="sm" fw={500}>{t('placeholder.tags')}</Text>}
      <EditableTags
        value={organization.tags || []}
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
          value={organization.attributes || {}}
          onChange={(val: Record<string, any>) => onUpdate?.({ attributes: val })}
          canEdit={!!onUpdate}
        />
      </Collapse>
    </Stack>
  );
};
