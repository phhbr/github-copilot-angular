import { test, expect } from '@playwright/test';

/**
 * Tests for FormDataComponent in edit mode (Step 1)
 * Verifies that form fields are editable and values can be entered
 */
test.describe('FormDataComponent - Edit Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    // Wait for the form to load
    await page.waitForLoadState('networkidle');
  });

  test('should display editable form fields with required attributes', async ({ page }) => {
    // Verify step 1 title is displayed
    await expect(page.locator('h2')).toContainText('Step 1: Invoice & Shipping Information');

    // Verify personal information fields are visible
    const firstNameField = page.locator('kol-input-text').filter({ has: page.locator('text=First Name') }).first();
    const lastNameField = page.locator('kol-input-text').filter({ has: page.locator('text=Last Name') }).first();

    // Check that fields exist
    await expect(firstNameField).toBeVisible();
    await expect(lastNameField).toBeVisible();

    // Verify fields are not read-only
    const inputs = page.locator('input[type="text"]');
    for (const input of await inputs.all()) {
      const readOnly = await input.getAttribute('readonly');
      expect(readOnly).toBeNull();
    }
  });

  test('should allow entering and updating form data across all fields', async ({ page }) => {
    // Fill in personal information
    const inputs = page.locator('input[type="text"]');
    const inputArray = await inputs.all();

    if (inputArray.length >= 8) {
      // First Name
      await inputArray[0].fill('John');
      await expect(inputArray[0]).toHaveValue('John');

      // Last Name
      await inputArray[1].fill('Doe');
      await expect(inputArray[1]).toHaveValue('Doe');

      // Invoice Street
      await inputArray[2].fill('123 Main St');
      await expect(inputArray[2]).toHaveValue('123 Main St');

      // Invoice City
      await inputArray[3].fill('New York');
      await expect(inputArray[3]).toHaveValue('New York');

      // Invoice Zip
      await inputArray[4].fill('10001');
      await expect(inputArray[4]).toHaveValue('10001');

      // Shipping Street
      await inputArray[5].fill('456 Oak Ave');
      await expect(inputArray[5]).toHaveValue('456 Oak Ave');

      // Shipping City
      await inputArray[6].fill('Boston');
      await expect(inputArray[6]).toHaveValue('Boston');

      // Shipping Zip
      await inputArray[7].fill('02101');
      await expect(inputArray[7]).toHaveValue('02101');
    }
  });
});

/**
 * Tests for FormDataComponent in read-only mode (Step 2)
 * Verifies that form fields are read-only and display previously entered data
 */
test.describe('FormDataComponent - Read-Only Mode', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Fill in the form on step 1
    const inputs = page.locator('input[type="text"]');
    const inputArray = await inputs.all();

    if (inputArray.length >= 8) {
      await inputArray[0].fill('Jane');
      await inputArray[1].fill('Smith');
      await inputArray[2].fill('789 Elm St');
      await inputArray[3].fill('Los Angeles');
      await inputArray[4].fill('90001');
      await inputArray[5].fill('321 Pine Rd');
      await inputArray[6].fill('San Francisco');
      await inputArray[7].fill('94101');
    }

    // Click next button to go to step 2
    const nextButton = page.locator('kol-button').filter({ has: page.locator('text=Next Step') }).first();
    await nextButton.click();
    await page.waitForLoadState('networkidle');
  });

  test('should display step 2 with read-only fields and terms checkbox', async ({ page }) => {
    // Verify step 2 title is displayed
    await expect(page.locator('h2')).toContainText('Step 2: Review & Confirmation');

    // Verify fields are disabled/read-only
    const inputs = page.locator('input[type="text"]');
    for (const input of await inputs.all()) {
      const disabled = await input.getAttribute('disabled');
      expect(disabled).not.toBeNull(); // Should be disabled
    }

    // Verify Terms checkbox is visible and unchecked
    const checkbox = page.locator('input[type="checkbox"]');
    await expect(checkbox).toBeVisible();
    await expect(checkbox).not.toBeChecked();
  });

  test('should require terms acceptance before submission', async ({ page }) => {
    // Verify submit button is initially disabled
    const submitButton = page.locator('kol-button').filter({ has: page.locator('text=Submit') }).first();

    // Get the button's aria-disabled or _disabled attribute state
    // Note: KoliBri buttons may render this differently, so we check if button is clickable
    const isDisabled = await submitButton.evaluate((button) =>
      button.hasAttribute('_disabled') || button.getAttribute('_disabled') === 'true'
    );
    expect(isDisabled).toBeTruthy();

    // Check the terms checkbox
    const checkbox = page.locator('input[type="checkbox"]');
    await checkbox.check();

    // Verify submit button is now enabled
    const isEnabledAfter = await submitButton.evaluate((button) =>
      !button.hasAttribute('_disabled') || button.getAttribute('_disabled') === 'false'
    );
    expect(isEnabledAfter).toBeTruthy();
  });
});
