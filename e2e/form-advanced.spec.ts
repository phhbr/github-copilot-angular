import { test, expect, Page } from '@playwright/test';
import { FormTestUtils } from './test-utils';

/**
 * Fixture setup for form testing
 * Provides a pre-configured FormTestUtils instance following best practices
 */
const formTest = test.extend<{ formUtils: FormTestUtils }>({
  formUtils: async ({ page }, use) => {
    // Initialize the utility after page loads
    page.goto('/');
    await page.waitForLoadState('networkidle');

    const formUtils = new FormTestUtils(page);
    await use(formUtils);
  },
});

/**
 * Advanced FormDataComponent tests using best practices
 * Demonstrates proper use of fixtures, utilities, and semantic locators
 */
formTest.describe('FormDataComponent - Edit Mode (Advanced)', () => {
  formTest('should maintain form state when entering and modifying data', async ({ formUtils, page }) => {
    await formUtils.verifyHeading('Step 1: Invoice & Shipping Information');

    // Fill form with complete data
    const testData = [
      'Emma', // First Name
      'Brown', // Last Name
      '111 Test Blvd', // Invoice Street
      'Denver', // Invoice City
      '80202', // Invoice Zip
      '222 Test Lane', // Shipping Street
      'Austin', // Shipping City
      '73301', // Shipping Zip
    ];

    await formUtils.fillFormInputs(testData);

    // Verify all values were entered correctly
    const submittedValues = await formUtils.getFormValues();
    expect(submittedValues).toEqual(testData);

    // Modify a single field
    const inputs = page.locator('input[type="text"]');
    const inputArray = await inputs.all();
    await inputArray[0].fill('Emily');

    // Verify modification
    const updatedValues = await formUtils.getFormValues();
    expect(updatedValues[0]).toBe('Emily');
    expect(updatedValues[1]).toBe('Brown'); // Other fields unchanged
  });

  formTest('should handle navigation after form modification', async ({ formUtils, page }) => {
    const testData = [
      'Michael', 'Davis', '333 Main Pl', 'Dallas', '75201',
      '444 Oak Rd', 'Houston', '77002',
    ];

    await formUtils.fillFormInputs(testData);

    // Navigate to next step
    await formUtils.clickButton('Next Step');
    await page.waitForLoadState('networkidle');

    // Verify we're on step 2
    await formUtils.verifyHeading('Step 2: Review & Confirmation');

    // Go back
    await formUtils.clickButton('Back');
    await page.waitForLoadState('networkidle');

    // Verify data is preserved
    const retrievedValues = await formUtils.getFormValues();
    expect(retrievedValues).toEqual(testData);
  });
});

/**
 * Advanced FormDataComponent tests in read-only mode
 * Demonstrates comprehensive validation of form state transitions
 */
formTest.describe('FormDataComponent - Read-Only Mode (Advanced)', () => {
  formTest('should enforce read-only state and prevent all modifications', async ({ formUtils, page }) => {
    const testData = [
      'Sarah', 'Miller', '555 Elm Way', 'Phoenix', '85001',
      '666 Ash St', 'Memphis', '38103',
    ];

    await formUtils.fillFormInputs(testData);
    await formUtils.navigateToStep(2);

    // Verify read-only mode is active
    await formUtils.verifyReadOnlyMode();

    // Try to interact with a field (should not allow text input)
    const inputs = page.locator('input[type="text"]');
    const firstInput = inputs.first();
    const initialValue = await firstInput.inputValue();

    // Attempt to change value - should be prevented by readonly/disabled
    await firstInput.fill('HACKED');

    // Verify value didn't change
    const finalValue = await firstInput.inputValue();
    expect(finalValue).toBe(initialValue);
  });

  formTest('should require terms acceptance and prevent premature submission', async ({ formUtils, page }) => {
    const testData = [
      'Jessica', 'Taylor', '777 Pine Ave', 'San Antonio', '78201',
      '888 Spruce Pl', 'San Diego', '92101',
    ];

    await formUtils.fillFormInputs(testData);
    await formUtils.navigateToStep(2);

    // Verify submit button is disabled without terms
    const submitButton = page.locator('kol-button').filter({
      has: page.locator('text=Submit'),
    }).first();

    const isDisabledInitially = await submitButton.evaluate((button) =>
      button.hasAttribute('_disabled') && button.getAttribute('_disabled') !== 'false'
    );
    expect(isDisabledInitially).toBeTruthy();

    // Accept terms
    await formUtils.acceptTerms();

    // Verify submit button is now enabled
    const isEnabledAfter = await submitButton.evaluate((button) =>
      !button.hasAttribute('_disabled') || button.getAttribute('_disabled') === 'false'
    );
    expect(isEnabledAfter).toBeTruthy();
  });
});

/**
 * Integration tests using best practices
 * Demonstrates end-to-end workflow validation
 */
formTest.describe('Form Workflow - Complete Integration', () => {
  formTest('should complete full form submission workflow without errors', async ({ formUtils, page }) => {
    // Step 1: Fill form
    const testData = [
      'Christopher', 'Anderson', '999 Cedar Dr', 'Philadelphia', '19101',
      '111 Walnut St', 'San Francisco', '94105',
    ];

    await formUtils.fillFormInputs(testData);
    await expect(page.locator('h2')).toContainText('Step 1');

    // Navigate to step 2
    await formUtils.clickButton('Next Step');
    await page.waitForLoadState('networkidle');

    // Verify we're on step 2
    await formUtils.verifyHeading('Step 2: Review & Confirmation');

    // Step 2: Review and accept terms
    await formUtils.acceptTerms();

    // Step 3: Submit
    await formUtils.clickButton('Submit');
    await page.waitForLoadState('networkidle');

    // Verify success
    await formUtils.verifySubmissionSuccess();

    // Verify submitted data is displayed
    const submittedData = page.locator('.submitted-data');
    await expect(submittedData).toContainText('Christopher');
    await expect(submittedData).toContainText('Anderson');
  });

  formTest('should restart form correctly from success screen', async ({ formUtils, page }) => {
    // Complete first submission
    const initialData = [
      'Rachel', 'White', '222 Birch Place', 'Austin', '78701',
      '333 Maple Lane', 'Portland', '97201',
    ];

    await formUtils.fillFormInputs(initialData);
    await formUtils.navigateToStep(2);
    await formUtils.acceptTerms();
    await formUtils.clickButton('Submit');
    await page.waitForLoadState('networkidle');

    // Verify success screen
    await formUtils.verifySubmissionSuccess();

    // Start new form
    await formUtils.clickButton('Start New Form');
    await page.waitForLoadState('networkidle');

    // Verify we're back on step 1 with empty form
    await formUtils.verifyHeading('Step 1: Invoice & Shipping Information');
    const emptyFormValues = await formUtils.getFormValues();
    const allEmpty = emptyFormValues.every((val) => val === '');
    expect(allEmpty).toBeTruthy();

    // Fill with new data to ensure form is functional
    const newData = [
      'Thomas', 'Lee', '444 Dogwood Way', 'Boston', '02101',
      '555 Magnolia Ave', 'Seattle', '98101',
    ];

    await formUtils.fillFormInputs(newData);
    const freshFormValues = await formUtils.getFormValues();
    expect(freshFormValues).toEqual(newData);
  });
});
