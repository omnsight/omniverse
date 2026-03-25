import {
  Stack,
  Text,
  Group,
  Divider,
  UnstyledButton,
  Collapse,
  Title,
  TextInput,
  TagsInput,
} from '@mantine/core';
import { CustomDatePicker } from '../inputs/CustomDatePicker';
import { useTranslation } from 'react-i18next';
import { type Person } from 'omni-osint-crud-client';
import { EditableAttributes } from './EditableAttributes';
import { type CSSProperties, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Controller } from 'react-hook-form';
import { BaseForm } from './BaseForm';

interface Props {
  person: Person;
  onSubmit?: (data: Person) => void;
  onUpdate?: (data: Partial<Person>) => void;
  onClose?: () => void;
  useInput?: boolean;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export const PersonForm: React.FC<Props> = ({
  person,
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
    <BaseForm<Person>
      style={style}
      title={person.name || t('components.forms.PersonForm.title')}
      isEditing={isEditing || false}
      onClose={handlClose}
      defaultValues={person}
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
          {isEditing && (
            <Text size="sm" fw={500}>
              {t('components.forms.PersonForm.name')}
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
                  placeholder={t('components.forms.PersonForm.name')}
                  error={errors.name?.message}
                />
              )}
            />
          )}

          <Group gap={4}>
            <Text>{t('placeholder.role')}:</Text>
            {isEditing ? (
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('placeholder.role')}
                  />
                )}
              />
            ) : (
              <Text>{person.role}</Text>
            )}
          </Group>

          <Group gap={4}>
            <Text>{t('placeholder.nationality')}:</Text>
            {isEditing ? (
              <Controller
                name="nationality"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('placeholder.nationality')}
                  />
                )}
              />
            ) : (
              <Text>{person.nationality}</Text>
            )}
          </Group>

          <Group gap={4}>
            <Text size="sm" c="dimmed">
              {t('placeholder.birthDate')}:
            </Text>
            {isEditing ? (
              <Controller
                name="birth_date"
                control={control}
                render={({ field }) => (
                  <CustomDatePicker
                    value={field.value ? new Date(field.value * 1000) : null}
                    onChange={(date) => field.onChange(date ? date.getTime() / 1000 : 0)}
                    placeholder={t('placeholder.birthDate')}
                  />
                )}
              />
            ) : (
              <Text size="sm">
                {person.birth_date
                  ? new Date(person.birth_date * 1000).toLocaleDateString()
                  : t('placeholder.birthDate')}
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
            <Text size="sm">{(person.tags || []).join(', ')}</Text>
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
