import React, { useState } from 'react';
import {
  Stack,
  Group,
  Text,
  Divider,
  UnstyledButton,
  Collapse,
  Title,
  TextInput,
  NumberInput,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { type Relation } from 'omni-osint-crud-client';
import { EditableAttributes } from './EditableAttributes';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { Controller } from 'react-hook-form';
import { BaseForm } from './BaseForm';

interface Props {
  relation: Relation;
  onSubmit?: (data: Relation) => void;
  onUpdate?: (data: Partial<Relation>) => void;
  onClose: () => void;
  onClick?: () => void;
  useInput?: boolean;
  children?: React.ReactNode;
}

export const RelationForm: React.FC<Props> = ({
  relation,
  onSubmit,
  onUpdate,
  onClose,
  onClick,
  useInput,
  children,
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
    <BaseForm<Relation>
      title={relation.label || t('components.forms.RelationForm.label', '?')}
      isEditing={isEditing || false}
      onClose={handlClose}
      defaultValues={relation}
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
          {isEditing && (
            <Text size="sm" fw={500}>
              {t('components.forms.RelationForm.label', '?')}
            </Text>
          )}
          {isEditing && (
            <Controller
              name="label"
              control={control}
              render={({ field }) => (
                <TextInput
                  {...field}
                  value={field.value || ''}
                  placeholder={t('components.forms.RelationForm.label', '?')}
                />
              )}
            />
          )}

          <Group gap={4}>
            <Text size="sm">{t('placeholder.name')}:</Text>
            {isEditing ? (
              <Controller
                name="name"
                control={control}
                render={({ field }) => (
                  <TextInput
                    {...field}
                    value={field.value || ''}
                    placeholder={t('placeholder.name')}
                  />
                )}
              />
            ) : (
              <Text size="sm">{relation.name}</Text>
            )}
          </Group>

          <Group gap={4}>
            <Text size="sm">{t('placeholder.confidence')}:</Text>
            {isEditing ? (
              <Controller
                name="confidence"
                control={control}
                render={({ field }) => (
                  <NumberInput
                    {...field}
                    value={field.value ?? 0}
                    placeholder={t('placeholder.confidence')}
                  />
                )}
              />
            ) : (
              <Text size="sm">{relation.confidence}</Text>
            )}
          </Group>

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
