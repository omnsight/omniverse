import React, { useState } from 'react';
import { NumberInput, Text } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

export interface EditableNumberProps {
  value: number | string;
  onChange: (value: number | string) => void;
  placeholder: string;
  canEdit?: boolean;
  useInput?: boolean;
}

export const EditableNumber: React.FC<EditableNumberProps> = ({
  value,
  onChange,
  placeholder,
  canEdit = false,
  useInput = false,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState<number | string>(value);
  const ref = useClickOutside(() => setIsEditing(false));

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (canEdit) {
      e.stopPropagation();
      setTempValue(value);
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      onChange(tempValue);
      setIsEditing(false);
    }
  };

  const handleChange = (val: number | string) => {
    if (useInput) {
      onChange(val);
    } else {
      setTempValue(val);
    }
  };

  if (isEditing || useInput) {
    return (
      <div ref={ref} onClick={(e) => e.stopPropagation()}>
        <NumberInput
          autoFocus
          value={useInput ? value : tempValue}
          onChange={handleChange}
          onKeyDown={useInput ? undefined : handleKeyDown}
          placeholder={`${t('placeholder.enter')}${placeholder}...`}
        />
      </div>
    );
  }

  return (
    <Text
      onDoubleClick={handleDoubleClick}
      style={{
        cursor: canEdit ? 'text' : 'default',
        color: value ? 'var(--mantine-color-text)' : 'var(--mantine-color-dimmed)',
        fontStyle: value ? 'normal' : 'italic',
      }}
    >
      {value || t('placeholder.unknown')}
    </Text>
  );
};
