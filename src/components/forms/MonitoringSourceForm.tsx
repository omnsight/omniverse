import React, { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  Divider,
  Title,
  Collapse,
  UnstyledButton,
  TextInput,
  Textarea,
  Select,
  Slider,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { type MonitoringSource } from 'omni-monitoring-client';
import { useTranslation } from 'react-i18next';
import { EditableAttributes } from './EditableAttributes';
import { ChevronDownIcon } from '@heroicons/react/24/solid';
import { Controller } from 'react-hook-form';
import { BaseForm } from './BaseForm';

interface Props {
  source: MonitoringSource;
  useInput?: boolean;
  onSubmit?: (data: MonitoringSource) => void;
  onUpdate?: (data: Partial<MonitoringSource>) => void;
  onClose: () => void;
}

export const MonitoringSourceForm: React.FC<Props> = ({
  source,
  useInput,
  onSubmit,
  onUpdate,
  onClose,
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
    <BaseForm<MonitoringSource>
      title={source.name || t('components.forms.MonitoringSourceForm.name')}
      isEditing={isEditing}
      onClose={handlClose}
      defaultValues={source}
      onSubmit={onSubmit}
      onUpdate={onUpdate}
    >
      {({ control, formState: { errors } }) => (
        <Stack onDoubleClick={handleDoubleClick}>
          {isEditing && (
            <Text size="sm" fw={500}>
              {t('components.forms.MonitoringSourceForm.name')}
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
                  value={field.value || ''}
                  placeholder={t('components.forms.MonitoringSourceForm.name')}
                  error={errors.name?.message}
                />
              )}
            />
          )}

          {isEditing ? (
            <>
              <Text size="sm" fw={500}>
                {t('placeholder.description')}
              </Text>
              <Controller
                name="description"
                control={control}
                rules={{ required: t('common.required') }}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder={t('placeholder.description')}
                    error={errors.description?.message}
                  />
                )}
              />
            </>
          ) : (
            <Text>{source.description || t('placeholder.description')}</Text>
          )}

          <Group>
            <Text>{t('placeholder.source.type')}:</Text>
            {isEditing ? (
              <Controller
                name="type"
                control={control}
                rules={{ required: t('common.required') }}
                render={({ field }) => (
                  <Select
                    {...field}
                    value={field.value || ''}
                    data={['website', 'twitter', 'telegram'].map((type) => ({
                      value: type,
                      label: type,
                    }))}
                    placeholder={t('placeholder.source.type')}
                    error={errors.type?.message}
                  />
                )}
              />
            ) : (
              <Text>{source.type}</Text>
            )}
          </Group>
          <Group>
            <Text>{t('placeholder.url')}:</Text>
            {isEditing ? (
              <Controller
                name="url"
                control={control}
                rules={{ required: t('common.required') }}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('placeholder.url')}
                    error={errors.url?.message}
                  />
                )}
              />
            ) : (
              <Text>{source.url}</Text>
            )}
          </Group>

          <Group>
            <Text>{t('placeholder.reliability')}:</Text>
            {isEditing ? (
              <Controller
                name="reliability"
                control={control}
                rules={{ required: t('common.required') }}
                render={({ field }) => (
                  <Slider
                    {...field}
                    value={field.value || 0}
                    min={0}
                    max={100}
                    style={{ flex: 1 }}
                    label={(value) => `${value}%`}
                  />
                )}
              />
            ) : (
              <Text>{source.reliability}</Text>
            )}
          </Group>
          <Group>
            <Text>{t('placeholder.lastReviewed')}:</Text>
            {isEditing ? (
              <Controller
                name="last_reviewed"
                control={control}
                rules={{ required: t('common.required') }}
                render={({ field }) => (
                  <DatePickerInput
                    value={field.value ? new Date(field.value * 1000) : null}
                    onChange={(date) => field.onChange(date ? new Date(date).getTime() / 1000 : 0)}
                    placeholder={t('placeholder.lastReviewed')}
                    error={errors.last_reviewed?.message}
                  />
                )}
              />
            ) : (
              <Text>
                {source.last_reviewed
                  ? new Date(source.last_reviewed * 1000).toLocaleDateString()
                  : ''}
              </Text>
            )}
          </Group>

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
