import React, { useState } from 'react';
import { Text } from '@mantine/core';
import { DateTimePicker } from '@mantine/dates';
import { useClickOutside } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

export interface EditableDateProps {
  value: Date | number | string | null;
  onChange: (value: Date) => void;
  placeholder: string;
  canEdit?: boolean;
}

export const EditableDate: React.FC<EditableDateProps> = ({
  value,
  onChange,
  placeholder,
  canEdit = false,
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState<Date | null>(value ? new Date(value) : null);
  const ref = useClickOutside(() => setIsEditing(false));

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (canEdit) {
      e.stopPropagation();
      setTempValue(value ? new Date(value) : null);
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === 'Escape') {
      if (tempValue) {
        onChange(tempValue);
      }
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div ref={ref} onClick={(e) => e.stopPropagation()}>
        <DateTimePicker
          autoFocus
          value={tempValue}
          onChange={(date) => date && setTempValue(new Date(date))}
          onKeyDown={handleKeyDown}
          placeholder={`${t('placeholder.enter')}${placeholder}...`}
          valueFormat="YYYY-MM-DD HH:mm"
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
      {value
        ? new Date(value).toLocaleString(undefined, {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
          })
        : t('placeholder.unknown')}
    </Text>
  );
};
