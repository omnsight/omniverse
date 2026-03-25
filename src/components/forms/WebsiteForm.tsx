import React, { useState, type CSSProperties } from 'react';
import {
  Stack,
  Group,
  Text,
  ActionIcon,
  Divider,
  UnstyledButton,
  Collapse,
  Title,
  TextInput,
  Textarea,
  TagsInput,
} from '@mantine/core';
import { CustomDatePicker } from '../inputs/CustomDatePicker';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { type Website } from 'omni-osint-crud-client';
import { EditableAttributes } from './EditableAttributes';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Controller } from 'react-hook-form';
import { BaseForm } from './BaseForm';

interface Props {
  website: Website;
  onSubmit?: (data: Website) => void;
  onUpdate?: (data: Partial<Website>) => void;
  onClose?: () => void;
  useInput?: boolean;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export const WebsiteForm: React.FC<Props> = ({
  website,
  onSubmit,
  onUpdate,
  onClose,
  useInput,
  children,
  style,
}) => {
  const { t } = useTranslation();
  const [attributesOpen, setAttributesOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(useInput || false);
  const canEdit = onSubmit !== undefined || onUpdate !== undefined;

  const handlClose = () => {
    if (!useInput) {
      setIsEditing(false);
    }
    onClose?.();
  };

  const handleDoubleClick = () => {
    if (!useInput && canEdit) {
      setIsEditing(true);
    }
  };

  return (
    <BaseForm<Website>
      style={style}
      title={website.title || t('components.forms.WebsiteForm.title', '?')}
      isEditing={isEditing || false}
      onClose={handlClose}
      defaultValues={website}
      onSubmit={onSubmit}
      onUpdate={onUpdate}
    >
      {({ control, formState: { errors } }) => (
        <Stack
          pos="relative"
          gap="xs"
          style={{ cursor: canEdit ? (isEditing ? 'default' : 'pointer') : 'default' }}
          onDoubleClick={handleDoubleClick}
        >
          <Group gap="xs">
            {isEditing && (
              <Text size="sm" fw={500}>
                {t('components.forms.WebsiteForm.title', '?')}
              </Text>
            )}
            {isEditing && (
              <Controller
                name="title"
                control={control}
                rules={{ required: t('common.required') }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('components.forms.WebsiteForm.title', '?')}
                    style={{ flex: 'initial' }}
                    error={errors.title?.message}
                  />
                )}
              />
            )}
            {website.url && (
              <ActionIcon
                component="a"
                href={website.url}
                target="_blank"
                variant="subtle"
                size="sm"
              >
                <ArrowTopRightOnSquareIcon style={{ width: '70%', height: '70%' }} />
              </ActionIcon>
            )}
          </Group>

          <Group gap={4}>
            <Text>{t('placeholder.url')}:</Text>
            {isEditing ? (
              <Controller
                name="url"
                control={control}
                rules={{ required: t('common.required') }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value ?? ''}
                    placeholder={t('placeholder.url')}
                    error={errors.url?.message}
                  />
                )}
              />
            ) : (
              <Text>{website.url}</Text>
            )}
          </Group>

          {isEditing ? (
            <>
              <Text size="sm" fw={500}>
                {t('placeholder.description')}
              </Text>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder={t('placeholder.description')}
                  />
                )}
              />
            </>
          ) : (
            <Text>{website.description || t('placeholder.description')}</Text>
          )}

          <Group gap={4}>
            <Text size="sm" c="dimmed">
              {t('placeholder.foundedDate')}:
            </Text>
            {isEditing ? (
              <Controller
                name="founded_at"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    value={field.value ? new Date(field.value * 1000) : null}
                    onChange={(date) => field.onChange(date ? date.getTime() / 1000 : 0)}
                    placeholder={t('placeholder.foundedDate')}
                  />
                )}
              />
            ) : (
              <Text size="sm">
                {website.founded_at
                  ? new Date(website.founded_at * 1000).toLocaleDateString()
                  : t('placeholder.foundedDate')}
              </Text>
            )}
          </Group>

          <Group gap={4}>
            <Text size="sm" c="dimmed">
              {t('placeholder.discoveredDate')}:
            </Text>
            {isEditing ? (
              <Controller
                name="discovered_at"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    value={field.value ? new Date(field.value * 1000) : null}
                    onChange={(date) => field.onChange(date ? date.getTime() / 1000 : 0)}
                    placeholder={t('placeholder.discoveredDate')}
                  />
                )}
              />
            ) : (
              <Text size="sm">
                {website.discovered_at
                  ? new Date(website.discovered_at * 1000).toLocaleDateString()
                  : t('placeholder.discoveredDate')}
              </Text>
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
            <Text size="sm">{(website.tags || []).join(', ')}</Text>
          )}

          {children}

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
