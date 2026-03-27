import { Button, Group, NumberInput, Select, Stack, Switch, Text, TextInput } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { randomId } from '@mantine/hooks';

interface Props {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  isEditing?: boolean;
}

export const EditableAttributes: React.FC<Props> = ({ value, onChange, isEditing }) => {
  const { t } = useTranslation();

  const handleAdd = () => {
    onChange({ ...value, [randomId()]: { key: '', value: '', type: 'text' } });
  };

  const handleKeyChange = (id: string, newKey: string) => {
    onChange({ ...value, [id]: { ...value[id], key: newKey } });
  };

  const handleValueChange = (id: string, newValue: any) => {
    onChange({ ...value, [id]: { ...value[id], value: newValue } });
  };

  const handleTypeChange = (id: string, newType: 'text' | 'number' | 'toggle') => {
    let defaultValue: any = '';
    if (newType === 'number') {
      defaultValue = 0;
    } else if (newType === 'toggle') {
      defaultValue = false;
    }
    onChange({ ...value, [id]: { ...(value[id] || {}), type: newType, value: defaultValue } });
  };

  const handleRemove = (id: string) => {
    const { [id]: _, ...rest } = value;
    onChange(rest);
  };

  if (!isEditing) {
    return (
      <Stack gap="xs">
        {Object.entries(value)
          .filter(
            ([key, val]) =>
              key !== 'icon_color' && val !== null && typeof val === 'object' && 'key' in val,
          )
          .map(([id, val]: [string, any]) => (
            <Group key={id} gap="xs">
              <Text size="sm" fw={500}>
                {val.key}:
              </Text>
              <Text size="sm">{String(val.value)}</Text>
            </Group>
          ))}
      </Stack>
    );
  }

  return (
    <Stack gap="xs" pb="sm">
      {Object.entries(value)
        .filter(
          ([key, val]) =>
            key !== 'icon_color' && val !== null && typeof val === 'object' && 'key' in val,
        )
        .map(([id, val]: [string, any]) => {
          return (
            <Group key={id} gap="xs">
              <TextInput
                w={75}
                value={val.key}
                onChange={(e) => handleKeyChange(id, e.currentTarget.value)}
                placeholder={t('placeholder.key')}
              />
              <Select
                w={100}
                value={val.type}
                onChange={(newType) => {
                  if (newType) {
                    handleTypeChange(id, newType as 'text' | 'number' | 'toggle');
                  }
                }}
                placeholder={t('placeholder.type')}
                data={[
                  { value: 'text', label: t('common.types.text') },
                  { value: 'number', label: t('common.types.number') },
                  { value: 'toggle', label: t('common.types.toggle') },
                ]}
              />
              {val.type === 'text' && (
                <TextInput
                  w={150}
                  value={val.value}
                  onChange={(e) => handleValueChange(id, e.currentTarget.value)}
                  placeholder={t('placeholder.value')}
                />
              )}
              {val.type === 'number' && (
                <NumberInput
                  w={150}
                  value={val.value}
                  onChange={(v) => handleValueChange(id, v)}
                  placeholder={t('placeholder.value')}
                />
              )}
              {val.type === 'toggle' && (
                <Switch
                  w={150}
                  checked={val.value}
                  onChange={(e) => handleValueChange(id, e.currentTarget.checked)}
                />
              )}
              <Button color="red" variant="subtle" size="xs" onClick={() => handleRemove(id)}>
                {t('common.remove')}
              </Button>
            </Group>
          );
        })}
      <Button
        onClick={handleAdd}
        size="xs"
        mt="sm"
        disabled={Object.values(value).some((v: any) => v && v.key === '')}
      >
        {t('common.add')}
      </Button>
    </Stack>
  );
};
