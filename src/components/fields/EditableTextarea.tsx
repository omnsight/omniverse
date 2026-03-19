import React, { useState } from 'react';
import { Textarea, Text } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

export interface EditableTextareaProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  useInput?: boolean;
  canEdit?: boolean;
}

export const EditableTextarea: React.FC<EditableTextareaProps> = ({
  value,
  onChange,
  placeholder,
  useInput = false,
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

  if (useInput || isEditing) {
    return (
      <div ref={ref} onClick={(e) => e.stopPropagation()}>
        <Textarea
          autoFocus
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={useInput ? undefined : handleKeyDown}
          placeholder={`${t('placeholder.enter')}${placeholder}...`}
          autosize
          minRows={2}
        />
      </div>
    );
  }

  return (
    <Text
      onDoubleClick={useInput ? undefined : handleDoubleClick}
      size="sm"
      mt="sm"
      style={{
        cursor: canEdit ? 'text' : 'default',
        color: value ? 'var(--mantine-color-text)' : 'var(--mantine-color-dimmed)',
        fontStyle: value ? 'normal' : 'italic',
        wordBreak: 'break-word',
        whiteSpace: 'pre-wrap',
      }}
    >
      {value || t('placeholder.unknown')}
    </Text>
  );
};
