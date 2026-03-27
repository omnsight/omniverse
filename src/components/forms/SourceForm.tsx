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
  Textarea,
} from '@mantine/core';
import { ArrowTopRightOnSquareIcon } from '@heroicons/react/24/outline';
import { useTranslation } from 'react-i18next';
import { type Source } from 'omni-osint-crud-client';
import { EditableAttributes } from './EditableAttributes';
import { type CSSProperties, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { BaseForm } from './BaseForm';
import {
  SourceIcon,
  SourceIconSelector,
  SourceColorSelector,
} from '@omnsight/osint-entity-components/icons';

const SourceIconFormSection = ({ data }: { data: Source }) => {
  const { control } = useFormContext<Source>();
  const { t } = useTranslation();
  const type = useWatch({ control, name: 'type' });
  const iconColor = useWatch({ control, name: 'attributes.icon_color' });

  const modifiedData = {
    ...data,
    type: type,
    attributes: { ...data.attributes, icon_color: iconColor },
  };

  return (
    <Group grow>
      <Controller
        name="type"
        control={control}
        rules={{ required: t('common.required') }}
        render={({ field, fieldState: { error } }) => (
          <Stack gap={0}>
            <SourceIconSelector {...field} data={modifiedData} value={field.value} />
            {error?.message && (
              <Text c="red" size="xs">
                {error.message}
              </Text>
            )}
          </Stack>
        )}
      />
      <Controller
        name="attributes.icon_color"
        control={control}
        rules={{ required: t('common.required') }}
        render={({ field, fieldState: { error } }) => (
          <Stack gap={0}>
            <SourceColorSelector {...field} value={String(field.value)} />
            {error?.message && (
              <Text c="red" size="xs">
                {error.message}
              </Text>
            )}
          </Stack>
        )}
      />
    </Group>
  );
};

interface Props {
  source: Source;
  onSubmit?: (data: Source) => void;
  onUpdate?: (data: Partial<Source>) => void;
  onClose?: () => void;
  useInput?: boolean;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export const SourceForm: React.FC<Props> = ({
  source,
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
    <BaseForm<Source>
      style={style}
      icon={<SourceIcon source={source} />}
      title={source.name || source.url || t('components.forms.SourceForm.title')}
      isEditing={isEditing || false}
      onClose={handlClose}
      defaultValues={source}
      onSubmit={onSubmit}
      onUpdate={onUpdate}
    >
      {({ control, formState: { errors } }) => {
        return (
          <Stack
            pos="relative"
            gap="xs"
            style={{ cursor: canEdit ? (isEditing ? 'default' : 'pointer') : 'default' }}
            onDoubleClick={handleDoubleClick}
          >
            <Group gap="xs">
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
                      value={field.value || source.url || ''}
                      placeholder={t('placeholder.title')}
                      style={{ flex: 'initial' }}
                      error={errors.name?.message}
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

            {isEditing && (
              <Text size="sm" fw={500}>
                {t('placeholder.description')}
              </Text>
            )}
            {isEditing ? (
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <Textarea
                    {...field}
                    value={field.value || ''}
                    placeholder={t('components.forms.SourceForm.sourceDescription')}
                  />
                )}
              />
            ) : (
              <Text size="sm">
                {source.description || t('components.forms.SourceForm.sourceDescription')}
              </Text>
            )}

            <Group gap={4}>
              <Text size="sm" c="dimmed">
                {t('placeholder.type')}:
              </Text>
              {isEditing ? (
                <SourceIconFormSection data={source} />
              ) : (
                <Text size="sm">{source.type}</Text>
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
        );
      }}
    </BaseForm>
  );
};
