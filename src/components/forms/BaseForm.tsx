import { modals } from '@mantine/modals';
import { Paper, Group, Title, ActionIcon, LoadingOverlay, Text, Tooltip } from '@mantine/core';
import { CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/solid';
import {
  useForm,
  type DefaultValues,
  type FieldValues,
  type UseFormReturn,
  type SubmitHandler,
} from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { get } from 'lodash';

interface Props<T extends FieldValues> {
  title: string;
  isEditing: boolean;
  onSubmit?: SubmitHandler<T>;
  onUpdate?: (data: Partial<T>) => void;
  onClose: () => void;
  defaultValues: DefaultValues<T>;
  exitButton?: React.ReactNode;
  children: (methods: UseFormReturn<T>) => React.ReactNode;
}

export function BaseForm<T extends FieldValues>({
  title,
  isEditing,
  onSubmit,
  onUpdate,
  onClose,
  defaultValues,
  exitButton,
  children,
}: Props<T>) {
  const { t } = useTranslation();
  const methods = useForm<T>({ defaultValues });
  const {
    handleSubmit,
    reset,
    formState: { isSubmitting, isDirty, dirtyFields },
  } = methods;

  const truncateString = (str: string, num: number) => {
    if (str.length <= num) return str;
    return str.slice(0, num) + '...';
  };

  const handleInternalSubmit = handleSubmit(async (data) => {
    if (onUpdate) {
      const dirtyValues: Partial<T> = {};
      for (const key in dirtyFields) {
        if (dirtyFields[key]) {
          dirtyValues[key as keyof T] = get(data, key);
        }
      }
      onUpdate(dirtyValues);
    } else if (onSubmit) {
      onSubmit(data);
    }
    onClose();
  });

  const handleCancel = () => {
    if (!isDirty) {
      onClose();
    } else {
      modals.openConfirmModal({
        title: t('components.forms.BaseForm.discardChanges'),
        centered: true,
        children: <Text size="sm">{t('components.forms.BaseForm.unsavedChangesWarning')}</Text>,
        labels: { confirm: t('common.confirm'), cancel: t('common.cancel') },
        confirmProps: { color: 'red' },
        onConfirm: () => {
          reset();
          onClose();
        },
      });
    }
  };

  return (
    <Paper
      p="md"
      shadow="sm"
      pos="relative"
      withBorder
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <LoadingOverlay visible={isSubmitting} overlayProps={{ radius: 'sm', blur: 1 }} />
      <Group justify="space-between" mb="md">
        <Group>
          <Tooltip label={title}>
            <Title order={4}>{truncateString(title, 25)}</Title>
          </Tooltip>
          {isEditing && (
            <ActionIcon
              radius="xl"
              variant={isDirty ? 'filled' : 'subtle'}
              color={isDirty ? 'green' : 'gray'}
              onClick={handleInternalSubmit}
              style={{
                cursor: isDirty ? 'pointer' : 'not-allowed',
                opacity: isDirty ? 1 : 0.5,
              }}
              disabled={!isDirty && !isSubmitting}
            >
              <CheckCircleIcon style={{ width: 16, height: 16 }} />
            </ActionIcon>
          )}
        </Group>
        {isEditing && (
          <ActionIcon color="red" onClick={handleCancel}>
            <XMarkIcon style={{ width: 16, height: 16 }} />
          </ActionIcon>
        )}
        {!isEditing && exitButton}
      </Group>
      <form onSubmit={handleInternalSubmit}>{children(methods)}</form>
    </Paper>
  );
}
