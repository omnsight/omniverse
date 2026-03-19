import React, { useState } from 'react';
import { TextInput, Title } from '@mantine/core';
import type { TitleOrder } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

export interface EditableTitleProps {
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  useInput?: boolean;
  canEdit?: boolean;
  order?: TitleOrder;
  style?: React.CSSProperties;
}

export const EditableTitle: React.FC<EditableTitleProps> = ({
  value,
  onChange,
  placeholder,
  useInput = false,
  canEdit = false,
  order = 4,
  style,
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
        <TextInput
          autoFocus
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={useInput ? undefined : handleKeyDown}
          placeholder={`${t('placeholder.enter')}${placeholder}...`}
        />
      </div>
    );
  }

  return (
    <Title
      onDoubleClick={useInput ? undefined : handleDoubleClick}
      order={order}
      style={{
        cursor: canEdit ? 'text' : 'default',
        color: value ? 'var(--mantine-color-text)' : 'var(--mantine-color-dimmed)',
        fontStyle: value ? 'normal' : 'italic',
        flex: 1,
        ...style,
      }}
    >
      {value || t('placeholder.unknown')}
    </Title>
  );
};
