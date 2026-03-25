import React, { useState } from 'react';
import { Stack, Text, Textarea, TextInput } from '@mantine/core';
import type { OsintView } from 'omni-osint-crud-client';
import { useTranslation } from 'react-i18next';
import { Controller } from 'react-hook-form';
import { BaseForm } from './BaseForm';

interface InsightFormProps {
  insight: OsintView;
  useInput?: boolean;
  onSubmit?: (data: OsintView) => void;
  onUpdate?: (data: Partial<OsintView>) => void;
  onClose?: () => void;
  exitButton?: React.ReactNode;
}

export const InsightForm: React.FC<InsightFormProps> = ({
  insight,
  useInput = false,
  onSubmit,
  onUpdate,
  onClose,
  exitButton,
}) => {
  const { t } = useTranslation();
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
    <BaseForm<OsintView>
      title={
        isEditing
          ? t('components.forms.InsightForm.edittingTitle')
          : insight.name || t('placeholder.title')
      }
      isEditing={isEditing}
      onClose={handlClose}
      defaultValues={insight}
      onSubmit={onSubmit}
      onUpdate={onUpdate}
      exitButton={exitButton}
    >
      {({ control, formState: { errors } }) => (
        <Stack
          pos="relative"
          gap="xs"
          style={{ cursor: canEdit ? (isEditing ? 'default' : 'pointer') : 'default' }}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing && (
            <Text size="sm" fw={500}>
              {t('placeholder.title')}
            </Text>
          )}
          {isEditing && (
            <Controller
              name="name"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <TextInput
                  {...field}
                  autoFocus
                  value={field.value || ''}
                  placeholder={`${t('placeholder.enter')}${t('placeholder.title')}...`}
                  error={errors.name?.message}
                />
              )}
            />
          )}

          {isEditing && <Text size="sm">{t('placeholder.description')}</Text>}
          {isEditing ? (
            <Controller
              name="description"
              control={control}
              rules={{ required: t('common.required') }}
              render={({ field }) => (
                <Textarea
                  {...field}
                  autosize
                  autoFocus
                  value={field.value || ''}
                  placeholder={`${t('placeholder.enter')}${t('placeholder.description')}...`}
                  error={errors.description?.message}
                />
              )}
            />
          ) : (
            <Text
              size="sm"
              style={{
                color: insight.description
                  ? 'var(--mantine-color-text)'
                  : 'var(--mantine-color-dimmed)',
                fontStyle: insight.description ? 'normal' : 'italic',
              }}
            >
              {insight.description || t('placeholder.description')}
            </Text>
          )}
        </Stack>
      )}
    </BaseForm>
  );
};
