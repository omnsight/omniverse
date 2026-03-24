import {
  Group,
  Text,
  Stack,
  ActionIcon,
  Divider,
  UnstyledButton,
  Collapse,
  Title,
  TextInput,
  NumberInput,
  TagsInput,
} from '@mantine/core';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { type Source } from 'omni-osint-crud-client';
import { EditableAttributes } from './EditableAttributes';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Controller } from 'react-hook-form';
import { BaseForm } from './BaseForm';

interface Props {
  source: Source;
  onSubmit?: (data: Source) => void;
  onUpdate?: (data: Partial<Source>) => void;
  onClose: () => void;
  onClick?: () => void;
  useInput?: boolean;
}

export const SourceForm: React.FC<Props> = ({
  source,
  onSubmit,
  onUpdate,
  onClose,
  onClick,
  useInput,
}) => {
  const { t } = useTranslation();
  const [attributesOpen, setAttributesOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(useInput || false);

  const handlClose = () => {
    if (!useInput) {
      setIsEditing(false);
    }
    onClose();
  };

  const handleDoubleClick = () => {
    if (!useInput) {
      setIsEditing(true);
    }
  };

  return (
    <BaseForm<Source>
      title={source.name || source.url || t('components.forms.SourceForm.title', '?')}
      isEditing={isEditing || false}
      onClose={handlClose}
      defaultValues={source}
      onSubmit={onSubmit}
      onUpdate={onUpdate}
    >
      {({ control }) => (
        <Stack
          gap="xs"
          style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
          onClick={onClick}
          onDoubleClick={handleDoubleClick}
        >
          <Group gap="xs">
            {isEditing && (
              <Text size="sm" fw={500}>
                {t('components.forms.SourceForm.title', '?')}
              </Text>
            )}
            {isEditing && (
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value || source.url || ''}
                    placeholder={t('components.forms.SourceForm.title', '?')}
                    style={{ flex: 'initial' }}
                  />
                )}
              />
            )}
            {source.url && (
              <ActionIcon
                component="a"
                href={source.url}
                target="_blank"
                variant="subtle"
                size="sm"
              >
                <ArrowTopRightOnSquareIcon style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
            )}
          </Group>

          <Group gap={4} wrap="nowrap">
            <Text>{t('placeholder.url')}:</Text>
            {isEditing ? (
              <Controller
                name="url"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('placeholder.url')}
                  />
                )}
              />
            ) : (
              <Text>{source.url}</Text>
            )}
          </Group>

          <Group gap={4}>
            <Text>{t('placeholder.reliability')}:</Text>
            {isEditing ? (
              <Controller
                name="reliability"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    value={field.value || 0}
                    placeholder={t('placeholder.reliability')}
                  />
                )}
              />
            ) : (
              <Text>{source.reliability}</Text>
            )}
          </Group>

          {isEditing ? (
            <>
              <Text size="sm" fw={500}>
                {t('placeholder.tags')}
              </Text>
              <Controller
                name="tags"
                control={control}
                render={({ field }) => (
                  <TagsInput
                    {...field}
                    value={field.value || []}
                    placeholder={t('placeholder.tags')}
                  />
                )}
              />
            </>
          ) : (
            <Text>{(source.tags || []).join(', ')}</Text>
          )}

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
            <Controller
              name="attributes"
              control={control}
              render={({ field }) => (
                <EditableAttributes {...field} value={field.value || {}} isEditing={isEditing} />
              )}
            />
          </Collapse>
        </Stack>
      )}
    </BaseForm>
  );
};
