import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Title, Text, Button, Paper, Stack, rem, Loader } from '@mantine/core';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorPageState {
  title?: string;
  description?: string;
}

export const ErrorPage: React.FC = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ErrorPageState;
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate('/', { replace: true });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const title = state?.title || t('ErrorPage.defaultTitle');
  const description = state?.description || t('ErrorPage.defaultDescription');

  return (
    <Container
      size="md"
      style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: '100%', maxWidth: 500 }}>
        <Stack align="center" gap="lg">
          <ExclamationTriangleIcon
            style={{ width: rem(64), height: rem(64), color: 'var(--mantine-color-red-6)' }}
          />

          <div style={{ textAlign: 'center' }}>
            <Title order={2} mb="xs">
              {title}
            </Title>
            <Text c="dimmed">{description}</Text>
          </div>

          <div
            style={{
              position: 'relative',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Loader size={80} color="red" />
            <Text fw={700} size="xl" style={{ position: 'absolute' }}>
              {countdown}
            </Text>
          </div>

          <Text size="sm">{t('ErrorPage.redirecting', { count: countdown })}</Text>

          <Button variant="subtle" onClick={() => navigate('/', { replace: true })}>
            {t('ErrorPage.goHome')}
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};
