import { Button, Group, Stack, Text, TextInput } from '@mantine/core';
import { randomId } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';

interface Props {
  value: Record<string, any>;
  onChange: (value: Record<string, any>) => void;
  isEditing?: boolean;
}

export const EditableAttributes: React.FC<Props> = ({ value, onChange, isEditing }) => {
  const { t } = useTranslation();
  const handleAdd = () => {
    const newKey = randomId();
    onChange({ ...value, [newKey]: '' });
  };

  const handleKeyChange = (oldKey: string, newKey: string) => {
    const { [oldKey]: _, ...rest } = value;
    onChange({ ...rest, [newKey]: value[oldKey] });
  };

  const handleValueChange = (key: string, newValue: string) => {
    onChange({ ...value, [key]: newValue });
  };

  const handleRemove = (key: string) => {
    const { [key]: _, ...rest } = value;
    onChange(rest);
  };

  if (!isEditing) {
    return (
      <Stack gap="xs">
        {Object.entries(value).map(([key, val]) => (
          <Group key={key} gap="xs">
            <Text size="sm" fw={500}>
              {key}:
            </Text>
            <Text size="sm">{val}</Text>
          </Group>
        ))}
      </Stack>
    );
  }

  return (
    <Stack gap="xs" pb="sm">
      {Object.entries(value).map(([key, val]) => (
        <Group key={key} gap="xs">
          <TextInput
            value={key}
            onChange={(e) => handleKeyChange(key, e.currentTarget.value)}
            placeholder={t('placeholder.key', '?')}
          />
          <TextInput
            value={val}
            onChange={(e) => handleValueChange(key, e.currentTarget.value)}
            placeholder={t('placeholder.value', '?')}
          />
          <Button color="red" variant="subtle" size="xs" onClick={() => handleRemove(key)}>
            {t('common.remove', '?')}
          </Button>
        </Group>
      ))}
      <Button onClick={handleAdd} size="xs" mt="sm">
        {t('common.add')}
      </Button>
    </Stack>
  );
};
