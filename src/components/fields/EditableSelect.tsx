import React, { useState, useMemo } from 'react';
import { Select, Text, type SelectProps, type ComboboxItem } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

export interface EditableSelectProps extends Omit<SelectProps, 'onChange'> {
  value?: string;
  onChange: (value: string) => void;
  canEdit?: boolean;
  useInput?: boolean;
}

export const EditableSelect: React.FC<EditableSelectProps> = ({
  value,
  onChange,
  canEdit = false,
  useInput = false,
  data,
  placeholder,
  ...selectProps
}) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value || '');
  const ref = useClickOutside(() => setIsEditing(false));

  const handleDoubleClick = (e: React.MouseEvent) => {
    if (canEdit) {
      e.stopPropagation();
      setTempValue(value || '');
      setIsEditing(true);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsEditing(false);
    }
  };

  const handleChange = (val: string | null) => {
    if (val) {
      setTempValue(val);
      onChange(val);
      setIsEditing(false);
    }
  };

  const selectedLabel = useMemo(() => {
    if (!value) return null;
    if (Array.isArray(data)) {
      for (const item of data) {
        if (typeof item === 'string') {
          if (item === value) return item;
        } else if (typeof item === 'object' && item !== null && 'value' in item) {
          const option = item as ComboboxItem;
          if (option.value === value) return option.label;
        }
      }
    }
    return value;
  }, [value, data]);

  if (isEditing || useInput) {
    return (
      <div ref={ref} onClick={(e) => e.stopPropagation()}>
        <Select
          autoFocus
          defaultDropdownOpened
          value={tempValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          data={data}
          placeholder={`${t('placeholder.select')}${placeholder}...`}
          {...selectProps}
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
      {selectedLabel || t('placeholder.unknown')}
    </Text>
  );
};
