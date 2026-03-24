import {
  Group,
  Text,
  Stack,
  Divider,
  UnstyledButton,
  Collapse,
  Title,
  TextInput,
  TagsInput,
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { type Organization } from 'omni-osint-crud-client';
import { EditableAttributes } from './EditableAttributes';
import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Controller } from 'react-hook-form';
import { BaseForm } from './BaseForm';

interface Props {
  organization: Organization;
  onSubmit?: (data: Organization) => void;
  onUpdate?: (data: Partial<Organization>) => void;
  onClose: () => void;
  onClick?: () => void;
  useInput?: boolean;
}

export const OrganizationForm: React.FC<Props> = ({
  organization,
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
    <BaseForm<Organization>
      title={organization.name || t('components.forms.OrganizationForm.name', '?')}
      isEditing={isEditing || false}
      onClose={handlClose}
      defaultValues={organization}
      onSubmit={onSubmit}
      onUpdate={onUpdate}
    >
      {({ control }) => (
        <Stack
          gap="xs"
          key={organization._id}
          style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
          onClick={onClick}
          onDoubleClick={handleDoubleClick}
        >
          {isEditing && (
            <Text size="sm" fw={500}>
              {t('components.forms.OrganizationForm.name', '?')}
            </Text>
          )}
          {isEditing && (
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  value={field.value || ''}
                  placeholder={t('components.forms.OrganizationForm.name', '?')}
                />
              )}
            />
          )}

          <Group gap={4}>
            <Text size="sm" c="dimmed">
              {t('placeholder.type')}:
            </Text>
            {isEditing ? (
              <Controller
                name="type"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('placeholder.type')}
                  />
                )}
              />
            ) : (
              <Text size="sm">{organization.type}</Text>
            )}
          </Group>

          <Group gap={4}>
            <Text size="sm" c="dimmed">
              {t('placeholder.foundedDate')}:
            </Text>
            {isEditing ? (
              <Controller
                name="founded_at"
                control={control}
                render={({ field }) => (
                  <DatePickerInput
                    value={field.value ? new Date(field.value * 1000) : null}
                    onChange={(date) => field.onChange(date ? new Date(date).getTime() / 1000 : 0)}
                    placeholder={t('placeholder.foundedDate')}
                  />
                )}
              />
            ) : (
              <Text size="sm">
                {organization.founded_at
                  ? new Date(organization.founded_at * 1000).toLocaleDateString()
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
                  <DatePickerInput
                    value={field.value ? new Date(field.value * 1000) : null}
                    onChange={(date) => field.onChange(date ? new Date(date).getTime() / 1000 : 0)}
                    placeholder={t('placeholder.discoveredDate')}
                  />
                )}
              />
            ) : (
              <Text size="sm">
                {organization.discovered_at
                  ? new Date(organization.discovered_at * 1000).toLocaleDateString()
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
            <Text size="sm">{(organization.tags || []).join(', ')}</Text>
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
