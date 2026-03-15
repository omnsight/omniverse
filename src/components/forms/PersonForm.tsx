import { Stack, Text, Group } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { type Person, type PersonMainData } from 'omni-osint-crud-client';
import { EditableDate, EditableTags, EditableTitle, EditableText } from '../fields';

interface Props {
  person: Person;
  onUpdate?: (data: PersonMainData) => void;
  onClick?: () => void;
}

export const PersonForm: React.FC<Props> = ({ person, onUpdate, onClick }) => {
  const { t } = useTranslation();

  return (
    <Stack
      gap="xs"
      style={{ position: 'relative', cursor: onClick ? 'pointer' : 'default' }}
      onClick={onClick}
    >
      <EditableTitle
        value={person.name || ''}
        onChange={(val) => onUpdate?.({ name: val })}
        canEdit={!!onUpdate}
        placeholder={t('entity.person.name')}
        order={4}
      />

      <Group gap={4}>
        <Text>{t('placeholder.role')}:</Text>
        <EditableText
          value={person.role || ''}
          onChange={(val) => onUpdate?.({ role: val })}
          canEdit={!!onUpdate}
          placeholder={t('placeholder.role')}
        />
      </Group>

      <Group gap={4}>
        <Text>{t('placeholder.nationality')}:</Text>
        <EditableText
          value={person.nationality || ''}
          onChange={(val) => onUpdate?.({ nationality: val })}
          canEdit={!!onUpdate}
          placeholder={t('placeholder.nationality')}
        />
      </Group>

      <Group gap={4}>
        <Text size="sm" c="dimmed">
          {t('placeholder.birthDate')}:
        </Text>
        <EditableDate
          value={(person.birth_date || 0) * 1000}
          onChange={(date) =>
            onUpdate?.({
              birth_date: date.getTime() / 1000,
            })
          }
          canEdit={!!onUpdate}
          placeholder={t('placeholder.birthDate')}
        />
      </Group>

      <EditableTags
        value={person.tags || []}
        onChange={(tags) => onUpdate?.({ tags })}
        canEdit={!!onUpdate}
        placeholder={t('placeholder.tags')}
      />
    </Stack>
  );
};
