import { test, expect } from '@playwright/test';
import type { OsintView } from 'omni-osint-crud-client';

const insights: Partial<OsintView>[] = [
  {
    name: 'Analysis of Q3 Social Media Trends in North America',
    description:
      'This report details the shifting social media landscape in North America during the third quarter, focusing on emerging platforms and user engagement metrics.',
  },
  {
    name: '关于东南亚电商市场的初步调研报告',
    description:
      '本报告旨在探讨东南亚地区电子商务市场的增长潜力。我们分析了该地区主要国家的消费者行为、物流基础设施和支付方式。',
  },
  {
    name: '欧洲可再生能源投资风险评估',
    description:
      '此项分析评估了在欧洲投资太阳能和风能项目的相关风险。报告涵盖了监管政策变化、供应链中断和市场价格波动等多个方面。',
  },
];

test.describe('Insight Creation', () => {
  test.beforeEach(async ({ page }) => {
    // 1. Navigate to the app
    await page.goto('/');

    // Press escape to close any welcome modals.
    await page.keyboard.press('Escape');

    await page.waitForLoadState('networkidle');
  });

  for (const insight of insights) {
    test(`should create an insight titled "${insight.name}"`, async ({ page }) => {
      const addInsightButton = page.getByTestId('add-insight-button');
      await addInsightButton.click({ timeout: 10000 });

      const modal = page.locator('div[role="dialog"]');
      await modal.waitFor({ state: 'visible', timeout: 10000 });

      const titleInput = modal.locator('input[type="text"]');
      const descriptionInput = modal.locator('textarea');
      const createButton = modal.locator('button', { hasText: 'Create' });

      await titleInput.fill(insight.name || '');
      await descriptionInput.fill(insight.description || '');

      await createButton.click();

      await expect(page.locator('div', { hasText: insight.name || '' })).toBeVisible();
      await expect(page.locator('div', { hasText: insight.description || '' })).toBeVisible();
    });
  }

  test.afterEach(async ({ page }, testInfo) => {
    if (testInfo.status !== testInfo.expectedStatus) {
      const screenshotPath = testInfo.outputPath(`failure.png`);
      testInfo.attachments.push({
        name: 'screenshot',
        path: screenshotPath,
        contentType: 'image/png',
      });
      await page.screenshot({ path: screenshotPath, timeout: 5000 });
    }
  });
});
