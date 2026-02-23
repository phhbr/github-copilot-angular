import { test, expect } from '@playwright/test';

/**
 * Tests for FormContainerComponent - Step 1
 * Verifies the initial step of the multi-step form workflow
 */
test.describe('FormContainerComponent - Step 1', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should display step 1 form with gradient background and navigation button', async ({ page }) => {
    // Verify gradient background is applied
    const container = page.locator('.form-container');
    const bgGradientStyle = await container.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.backgroundImage;
    });

    expect(bgGradientStyle).toContain('gradient');

    // Verify step 1 content
    await expect(page.locator('h2')).toContainText('Step 1: Invoice & Shipping Information');

    // Verify navigation sections
    await expect(page.locator('h3')).toContainText('Personal Information');
    await expect(page.locator('h3')).toContainText('Invoice Address');
    await expect(page.locator('h3')).toContainText('Shipping Address');

    // Verify next button exists
    const nextButton = page.locator('kol-button').filter({ has: page.locator('text=Next Step') }).first();
    await expect(nextButton).toBeVisible();

    // Verify back button is NOT visible on step 1
    const backButtonCount = await page.locator('kol-button').filter({ has: page.locator('text=Back') }).count();
    expect(backButtonCount).toBe(0);
  });

  test('should navigate to step 2 after filling form and clicking next', async ({ page }) => {
    // Fill in minimal required data
    const inputs = page.locator('input[type="text"]');
    const inputArray = await inputs.all();

    if (inputArray.length >= 8) {
      await inputArray[0].fill('Alice');
      await inputArray[1].fill('Johnson');
      await inputArray[2].fill('999 Test St');
      await inputArray[3].fill('Chicago');
      await inputArray[4].fill('60601');
      await inputArray[5].fill('888 Test Ave');
      await inputArray[6].fill('Miami');
      await inputArray[7].fill('33101');
    }

    // Click next button
    const nextButton = page.locator('kol-button').filter({ has: page.locator('text=Next Step') }).first();
    await nextButton.click();
    await page.waitForLoadState('networkidle');

    // Verify we're on step 2
    await expect(page.locator('h2')).toContainText('Step 2: Review & Confirmation');
  });
});

/**
 * Tests for FormContainerComponent - Step 2 and Submission
 * Verifies the review step and form submission workflow
 */
test.describe('FormContainerComponent - Step 2 & Submission', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Navigate to step 2
    const inputs = page.locator('input[type="text"]');
    const inputArray = await inputs.all();

    if (inputArray.length >= 8) {
      await inputArray[0].fill('Bob');
      await inputArray[1].fill('Williams');
      await inputArray[2].fill('555 Demo St');
      await inputArray[3].fill('Seattle');
      await inputArray[4].fill('98101');
      await inputArray[5].fill('777 Demo Ave');
      await inputArray[6].fill('Portland');
      await inputArray[7].fill('97201');
    }

    const nextButton = page.locator('kol-button').filter({ has: page.locator('text=Next Step') }).first();
    await nextButton.click();
    await page.waitForLoadState('networkidle');
  });

  test('should display back button and allow returning to step 1', async ({ page }) => {
    // Verify back button is visible
    const backButton = page.locator('kol-button').filter({ has: page.locator('text=Back') }).first();
    await expect(backButton).toBeVisible();

    // Click back button
    await backButton.click();
    await page.waitForLoadState('networkidle');

    // Verify we're back on step 1
    await expect(page.locator('h2')).toContainText('Step 1: Invoice & Shipping Information');

    // Verify previously entered data is retained
    const inputs = page.locator('input[type="text"]');
    const inputArray = await inputs.all();
    await expect(inputArray[0]).toHaveValue('Bob');
  });

  test('should submit form and show success message after accepting terms', async ({ page }) => {
    // Accept terms
    const checkbox = page.locator('input[type="checkbox"]');
    await checkbox.check();
    await expect(checkbox).toBeChecked();

    // Click submit button
    const submitButton = page.locator('kol-button').filter({ has: page.locator('text=Submit') }).first();
    await submitButton.click();
    await page.waitForLoadState('networkidle');

    // Verify success message is displayed
    await expect(page.locator('h2')).toContainText('Form Submitted Successfully');
    await expect(page.locator('.success-message p')).toContainText('We have received your information');

    // Verify submitted data is displayed
    await expect(page.locator('.submitted-data')).toContainText('Bob');
    await expect(page.locator('.submitted-data')).toContainText('Williams');
    await expect(page.locator('.submitted-data')).toContainText('555 Demo St');

    // Verify "Start New Form" button exists
    const newFormButton = page.locator('kol-button').filter({ has: page.locator('text=Start New Form') }).first();
    await expect(newFormButton).toBeVisible();
  });

  test('should reset form when starting a new form from success screen', async ({ page }) => {
    // Accept terms and submit
    const checkbox = page.locator('input[type="checkbox"]');
    await checkbox.check();

    const submitButton = page.locator('kol-button').filter({ has: page.locator('text=Submit') }).first();
    await submitButton.click();
    await page.waitForLoadState('networkidle');

    // Verify success message
    await expect(page.locator('.success-message')).toBeVisible();

    // Click "Start New Form"
    const newFormButton = page.locator('kol-button').filter({ has: page.locator('text=Start New Form') }).first();
    await newFormButton.click();
    await page.waitForLoadState('networkidle');

    // Verify we're back on step 1
    await expect(page.locator('h2')).toContainText('Step 1: Invoice & Shipping Information');

    // Verify form is empty
    const inputs = page.locator('input[type="text"]');
    const inputArray = await inputs.all();
    for (const input of inputArray) {
      await expect(input).toHaveValue('');
    }
  });
});
