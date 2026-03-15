import React, { useState } from 'react';
import { TagsInput, Text, Badge, Group } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

export interface EditableTagsProps {
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  canEdit?: boolean;
}

export const EditableTags: React.FC<EditableTagsProps> = ({
  value,
  onChange,
  placeholder,
  canEdit = false,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const ref = useClickOutside(() => setIsEditing(false));

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (canEdit) {
      e.stopPropagation();
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div ref={ref} onClick={(e) => e.stopPropagation()}>
        <TagsInput
          autoFocus
          value={value}
          onChange={onChange}
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
