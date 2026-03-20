import React, { useState } from 'react';
import { Table, Button, Select, TextInput, NumberInput, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';
import { CheckIcon, XMarkIcon } from '@heroicons/react/24/solid';

interface Props {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  canEdit?: boolean;
}

export const EditableAttributes: React.FC<Props> = ({ value, onChange, canEdit }) => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState<any>('');
  const [newType, setNewType] = useState('text');

  const handleAdd = () => {
    if (newKey && newKey.trim() !== '') {
      const updatedAttributes = { ...tempValue, [newKey]: newValue };
      setTempValue(updatedAttributes);
      setNewKey('');
      setNewValue('');
    }
  };

  const handleUpdate = (key: string, val: any) => {
    const updatedAttributes = { ...tempValue, [key]: val };
    setTempValue(updatedAttributes);
  };

  const handleDelete = (key: string) => {
    const { [key]: _, ...remaining } = tempValue;
    setTempValue(remaining);
  };

  const handleSave = () => {
    onChange(tempValue);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  const renderValueInput = (key: string, val: any) => {
    const type = typeof val === 'number' ? 'number' : val instanceof Date ? 'date' : 'text';

    switch (type) {
      case 'number':
        return (
          <NumberInput
            value={val}
            onChange={(num) => handleUpdate(key, num)}
            readOnly={!isEditing}
          />
        );
      case 'date':
        return (
          <DateInput
            value={val}
            onChange={(date) => handleUpdate(key, date)}
            readOnly={!isEditing}
          />
        );
      default:
        return (
          <TextInput
            value={val}
            onChange={(e) => handleUpdate(key, e.currentTarget.value)}
            readOnly={!isEditing}
          />
        );
    }
  };

  if (!canEdit) {
    return (
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('components.fields.EditableAttributes.key')}</Table.Th>
            <Table.Th>{t('components.fields.EditableAttributes.value')}</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Object.entries(value).map(([key, val]) => (
            <Table.Tr key={key}>
              <Table.Td>{key}</Table.Td>
              <Table.Td>{renderValueInput(key, val)}</Table.Td>
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
    );
  }

  return (
    <div>
      <Group justify="flex-end">
        {isEditing ? (
          <>
            <Button
              size="xs"
              color="green"
              onClick={handleSave}
              leftSection={<CheckIcon className="h-4 w-4" />}
            >
              {t('common.save')}
            </Button>
            <Button
              size="xs"
              color="red"
              onClick={handleCancel}
              leftSection={<XMarkIcon className="h-4 w-4" />}
            >
              {t('common.cancel')}
            </Button>
          </>
        ) : (
          <Button size="xs" onClick={() => setIsEditing(true)}>
            {t('common.edit')}
          </Button>
        )}
      </Group>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('components.fields.EditableAttributes.key')}</Table.Th>
            <Table.Th>{t('components.fields.EditableAttributes.value')}</Table.Th>
            {isEditing && <Table.Th />}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Object.entries(tempValue).map(([key, val]) => (
            <Table.Tr key={key}>
              <Table.Td>{key}</Table.Td>
              <Table.Td>{renderValueInput(key, val)}</Table.Td>
              {isEditing && (
                <Table.Td>
                  <Button size="xs" color="red" onClick={() => handleDelete(key)}>
                    {t('common.delete')}
                  </Button>
                </Table.Td>
              )}
            </Table.Tr>
          ))}
        </Table.Tbody>
      </Table>
      {isEditing && (
        <Group mt="md">
          <TextInput
            placeholder={t('components.fields.EditableAttributes.newKey')}
            value={newKey}
            onChange={(e) => setNewKey(e.currentTarget.value)}
          />
          <Select
            value={newType}
            onChange={(type) => setNewType(type || 'text')}
            data={[
              { label: t('common.text'), value: 'text' },
              { label: t('common.number'), value: 'number' },
              { label: t('common.date'), value: 'date' },
            ]}
          />
          {newType === 'text' && (
            <TextInput
              placeholder={t('components.fields.EditableAttributes.newValue')}
              value={newValue}
              onChange={(e) => setNewValue(e.currentTarget.value)}
            />
          )}
          {newType === 'number' && (
            <NumberInput
              placeholder={t('components.fields.EditableAttributes.newValue')}
              value={newValue}
              onChange={setNewValue}
            />
          )}
          {newType === 'date' && (
            <DateInput
              placeholder={t('components.fields.EditableAttributes.newValue')}
              value={newValue}
              onChange={setNewValue}
            />
          )}
          <Button onClick={handleAdd}>{t('common.insert')}</Button>
        </Group>
      )}
    </div>
  );
};
