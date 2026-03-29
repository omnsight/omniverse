import { Box, Title, Text, Button, Center } from '@mantine/core';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export const ErrorPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Center h="100%">
      <Box ta="center">
        <Title order={1}>{t('pages.ErrorPage.title')}</Title>
        <Text mt="sm">{t('pages.ErrorPage.description')}</Text>
        <Button component={Link} to="/" mt="lg">
          {t('pages.ErrorPage.return')}
        </Button>
      </Box>
    </Center>
  );
};
