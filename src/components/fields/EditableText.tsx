import React, { useState } from 'react';
import { TextInput, Text, Tooltip } from '@mantine/core';
import { useClickOutside } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

interface Props {
  value?: string;
  onChange: (value: string) => void;
  placeholder: string;
  canEdit?: boolean;
  useInput?: boolean;
}

export const EditableText: React.FC<Props> = ({
  value,
  onChange,
  placeholder,
  canEdit = false,
  useInput = false,
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
    if (e.key === 'Enter' || e.key === 'Escape') {
      onChange(tempValue);
      setIsEditing(false);
    }
  };

  const handleChange = (val: string) => {
    if (useInput) {
      onChange(val);
    } else {
      setTempValue(val);
    }
  };

  if (isEditing || useInput) {
    return (
      <div ref={ref} onClick={(e) => e.stopPropagation()}>
        <TextInput
          autoFocus
          value={(useInput ? value : tempValue) || ''}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={useInput ? undefined : handleKeyDown}
          placeholder={`${t('placeholder.enter')}${placeholder}...`}
        />
      </div>
    );
  }

  return (
    <Tooltip label={value} disabled={!value} multiline w={300} withArrow>
      <Text
        truncate="end"
        onDoubleClick={handleDoubleClick}
        style={{
          cursor: canEdit ? 'text' : 'default',
          color: value ? 'var(--mantine-color-text)' : 'var(--mantine-color-dimmed)',
          fontStyle: value ? 'normal' : 'italic',
          flex: 1,
        }}
      >
        {value || t('placeholder.unknown')}
      </Text>
    </Tooltip>
  );
};
