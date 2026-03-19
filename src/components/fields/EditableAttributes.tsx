import React, { useState } from 'react';
import { Table, Button, Select, TextInput, NumberInput, Group } from '@mantine/core';
import { DateInput } from '@mantine/dates';
import { useTranslation } from 'react-i18next';

interface Props {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  canEdit?: boolean;
}

export const EditableAttributes: React.FC<Props> = ({ value, onChange, canEdit }) => {
  const { t } = useTranslation();
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState<any>('');
  const [newType, setNewType] = useState('text');

  const handleAdd = () => {
    if (newKey && newKey.trim() !== '') {
      const updatedAttributes = { ...value, [newKey]: newValue };
      onChange(updatedAttributes);
      setNewKey('');
      setNewValue('');
    }
  };

  const handleUpdate = (key: string, val: any) => {
    const updatedAttributes = { ...value, [key]: val };
    onChange(updatedAttributes);
  };

  const handleDelete = (key: string) => {
    const { [key]: _, ...remaining } = value;
    onChange(remaining);
  };

  const renderValueInput = (key: string, val: any) => {
    const type = typeof val === 'number' ? 'number' : val instanceof Date ? 'date' : 'text';

    switch (type) {
      case 'number':
        return (
          <NumberInput value={val} onChange={(num) => handleUpdate(key, num)} readOnly={!canEdit} />
        );
      case 'date':
        return (
          <DateInput value={val} onChange={(date) => handleUpdate(key, date)} readOnly={!canEdit} />
        );
      default:
        return (
          <TextInput
            value={val}
            onChange={(e) => handleUpdate(key, e.currentTarget.value)}
            readOnly={!canEdit}
          />
        );
    }
  };

  return (
    <div>
      <Table>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>{t('components.attributes.key')}</Table.Th>
            <Table.Th>{t('components.attributes.value')}</Table.Th>
            {canEdit && <Table.Th />}
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {Object.entries(value).map(([key, val]) => (
            <Table.Tr key={key}>
              <Table.Td>{key}</Table.Td>
              <Table.Td>{renderValueInput(key, val)}</Table.Td>
              {canEdit && (
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
      {canEdit && (
        <Group mt="md">
          <TextInput
            placeholder={t('components.attributes.newKey')}
            value={newKey}
            onChange={(e) => setNewKey(e.currentTarget.value)}
          />
          <Select
            value={newType}
            onChange={(type) => setNewType(type || 'text')}
            data={['text', 'number', 'date']}
          />
          {newType === 'text' && (
            <TextInput
              placeholder={t('components.attributes.newValue')}
              value={newValue}
              onChange={(e) => setNewValue(e.currentTarget.value)}
            />
          )}
          {newType === 'number' && (
            <NumberInput
              placeholder={t('components.attributes.newValue')}
              value={newValue}
              onChange={setNewValue}
            />
          )}
          {newType === 'date' && (
            <DateInput
              placeholder={t('components.attributes.newValue')}
              value={newValue}
              onChange={setNewValue}
            />
          )}
          <Button onClick={handleAdd}>{t('common.add')}</Button>
        </Group>
      )}
    </div>
  );
};
