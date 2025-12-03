import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Title, Text, Button, Paper, Center, Stack, RingProgress, rem } from '@mantine/core';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ErrorPageState {
  title?: string;
  description?: string;
}

export const ErrorPage: React.FC = () => {
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

  const title = state?.title || 'Access Denied';
  const description = state?.description || 'You do not have permission to access this resource.';

  return (
    <Container size="md" style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper shadow="md" p="xl" radius="md" withBorder style={{ width: '100%', maxWidth: 500 }}>
        <Stack align="center" gap="lg">
            <ExclamationTriangleIcon style={{ width: rem(64), height: rem(64), color: 'var(--mantine-color-red-6)' }} />
            
            <div style={{ textAlign: 'center' }}>
                <Title order={2} mb="xs">{title}</Title>
                <Text c="dimmed">{description}</Text>
            </div>

            <RingProgress
                sections={[{ value: (countdown / 5) * 100, color: 'red' }]}
                label={
                    <Center>
                        <Text fw={700} size="xl">
                            {countdown}
                        </Text>
                    </Center>
                }
            />

            <Text size="sm">Redirecting to home page in {countdown} seconds...</Text>

            <Button variant="subtle" onClick={() => navigate('/', { replace: true })}>
                Go to Home immediately
            </Button>
        </Stack>
      </Paper>
    </Container>
  );
};
