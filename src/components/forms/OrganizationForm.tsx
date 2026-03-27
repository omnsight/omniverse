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
import { CustomDatePicker } from '../inputs/CustomDatePicker';
import { useTranslation } from 'react-i18next';
import { type Organization } from 'omni-osint-crud-client';
import { EditableAttributes } from './EditableAttributes';
import { type CSSProperties, useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { BaseForm } from './BaseForm';
import {
  OrganizationIcon,
  OrganizationIconSelector,
  OrganizationColorSelector,
} from '@omnsight/osint-entity-components/icons';

const OrganizationIconFormSection = ({ data }: { data: Organization }) => {
  const { control } = useFormContext<Organization>();
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
            <OrganizationIconSelector {...field} data={modifiedData} value={field.value} />
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
            <OrganizationColorSelector {...field} value={String(field.value)} />
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
  organization: Organization;
  onSubmit?: (data: Organization) => void;
  onUpdate?: (data: Partial<Organization>) => void;
  onClose?: () => void;
  useInput?: boolean;
  children?: React.ReactNode;
  style?: CSSProperties;
}

export const OrganizationForm: React.FC<Props> = ({
  organization,
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
    <BaseForm<Organization>
      style={style}
      icon={<OrganizationIcon organization={organization} />}
      title={organization.name || t('components.forms.OrganizationForm.title')}
      isEditing={isEditing || false}
      onClose={handlClose}
      defaultValues={organization}
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
            <Group gap={4}>
              {isEditing && (
                <Text size="sm" fw={500}>
                  {t('placeholder.name')}
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
                      placeholder={t('components.forms.OrganizationForm.name')}
                      error={errors.name?.message}
                    />
                  )}
                />
              )}
            </Group>

            <Group gap={4}>
              <Text size="sm" c="dimmed">
                {t('placeholder.type')}:
              </Text>
              {isEditing ? (
                <OrganizationIconFormSection data={organization} />
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
                    <CustomDatePicker
                      value={field.value ? new Date(field.value * 1000) : null}
                      onChange={(date) => field.onChange(date ? date.getTime() / 1000 : 0)}
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
                    <CustomDatePicker
                      value={field.value ? new Date(field.value * 1000) : null}
                      onChange={(date) => field.onChange(date ? date.getTime() / 1000 : 0)}
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
