import React, { useState } from 'react';
import {
  Box,
  Text,
  SimpleGrid,
  Stack,
  Title,
  Paper,
  ScrollArea,
  Switch,
  Group,
} from '@mantine/core';
import { useSelectedEntities } from '../data/entitySelection';
import { useTranslation } from 'react-i18next';
import { EntityFormRenderer } from '../../../components/entity/FormRenderer';
import { type Entity, getEntityTitle } from '../../../components/entity/entity';

const renderAttributes = (
  attributes: Record<string, any>,
  baseAttributes?: Record<string, any>,
) => {
  return (
    <Stack>
      {Object.entries(attributes).map(([key, value]) => {
        const baseValue = baseAttributes?.[key];
        const isNumeric = typeof value === 'number' && typeof baseValue === 'number';
        const difference = isNumeric ? value - baseValue : 0;

        return (
          <Box key={key}>
            <Text fw={500}>{key}</Text>
            <Group>
              <Text>{String(value)}</Text>
              {isNumeric && baseValue !== undefined && difference !== 0 && (
                <Text c={difference > 0 ? 'green' : 'red'}>
                  {difference > 0 ? '▲' : '▼'} {value}
                </Text>
              )}
            </Group>
          </Box>
        );
      })}
    </Stack>
  );
};

export const ComparisonView: React.FC = () => {
  const { t } = useTranslation();
  const selections = useSelectedEntities();
  const [showAttributes, setShowAttributes] = useState(true);

  if (selections.length < 2) {
    return (
      <Box
        pos="relative"
        h="100%"
        w="100%"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Text>{t('pages.windows.network.ComparsionView.selectAtLeastTwo', '?')}</Text>
      </Box>
    );
  }

  const firstEntityType = selections[0].type;
  const allSameType = selections.every((s) => s.type === firstEntityType);

  if (!allSameType) {
    return (
      <Box
        pos="relative"
        h="100%"
        w="100%"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Text>{t('pages.windows.network.ComparsionView.selectSameType', '?')}</Text>
      </Box>
    );
  }

  const baseEntity = selections[0];

  return (
    <Box pos="relative" h="100%" w="100%">
      <ScrollArea h="100%" w="100%" type="scroll" offsetScrollbars>
        <SimpleGrid cols={selections.length} spacing="lg">
          {selections.map((entity: Entity) => (
            <Paper withBorder p="md" key={entity.data._id}>
              <Stack>
                <Title order={4}>{getEntityTitle(entity)}</Title>
                {showAttributes ? (
                  entity.data.attributes &&
                  renderAttributes(entity.data.attributes, baseEntity.data.attributes ?? undefined)
                ) : (
                  <EntityFormRenderer entity={entity} />
                )}
              </Stack>
            </Paper>
          ))}
        </SimpleGrid>
      </ScrollArea>
      <Box style={{ position: 'absolute', bottom: 0, right: 0, padding: '1rem' }}>
        <Switch
          checked={showAttributes}
          onChange={(event) => setShowAttributes(event.currentTarget.checked)}
          label={
            showAttributes
              ? t('pages.windows.network.ComparsionView.showAttributes', '?')
              : t('pages.windows.network.ComparsionView.showMainData', '?')
          }
        />
      </Box>
    </Box>
  );
};
