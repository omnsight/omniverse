import React, { useState } from 'react';
import { TagsInput, Text, Badge, Group } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

export interface EditableTagsProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  canEdit?: boolean;
  useInput?: boolean;
}

export const EditableTags: React.FC<EditableTagsProps> = ({
  value,
  onChange,
  placeholder,
  canEdit = false,
  useInput = false,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || []);
  const ref = useClickOutside(() => setIsEditing(false));

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (canEdit) {
      e.stopPropagation();
      setTempValue(value || []);
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      onChange(tempValue);
      setIsEditing(false);
    }
  };

  if (isEditing || useInput) {
    return (
      <div ref={ref} onClick={(e) => e.stopPropagation()}>
        <TagsInput
          autoFocus
          value={tempValue}
          onChange={setTempValue}
          onKeyDown={handleKeyDown}
          placeholder={`${t('placeholder.enter')}${placeholder}...`}
        />
      </div>
    );
  }

  return (
    <Group
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: canEdit ? 'text' : 'default',
      }}
      gap="xs"
    >
      {(value || []).map((tag) => (
        <Badge key={tag} variant="dot">
          {tag}
        </Badge>
      ))}
      {(!value || value.length === 0) && (
        <Text style={{ color: 'var(--mantine-color-dimmed)', fontStyle: 'italic' }}>
          {t('placeholder.unknown')}
        </Text>
      )}
    </Group>
  );
};
