import { Page, Locator, expect } from '@playwright/test';

/**
 * Test utilities for form testing following Playwright best practices
 * Provides reusable helpers for form interaction and assertion
 */
export class FormTestUtils {
  constructor(private page: Page) {}

  /**
   * Fill all text input fields in sequence with provided values
   * Best Practice: Uses locator strategies that work with web components
   */
  async fillFormInputs(values: string[]): Promise<void> {
    const inputs = this.page.locator('input[type="text"]');
    const inputArray = await inputs.all();

    for (let i = 0; i < Math.min(values.length, inputArray.length); i++) {
      await inputArray[i].fill(values[i]);
    }
  }

  /**
   * Verify that all text input fields are disabled
   * Best Practice: Checks actual DOM attribute rather than visual state
   */
  async verifyInputsDisabled(): Promise<void> {
    const inputs = this.page.locator('input[type="text"]');
    const disabledInputs = inputs.filter({ has: this.page.locator('[disabled]') });

    // Get count of disabled vs total
    const totalCount = await inputs.count();
    const disabledCount = await disabledInputs.count();

    // All inputs should be disabled in read-only mode
    expect(totalCount).toBe(disabledCount);
  }

  /**
   * Click a button by its visible label text
   * Best Practice: Uses semantic locators based on visible text
   */
  async clickButton(label: string): Promise<void> {
    const button = this.page.locator('kol-button').filter({
      has: this.page.locator(`text=${label}`),
    }).first();

    await button.click();
  }

  /**
   * Navigate to a specific step by clicking navigation buttons
   * Best Practice: Simulates realistic user interaction pattern
   */
  async navigateToStep(stepNumber: number): Promise<void> {
    if (stepNumber === 1) {
      return; // Already on step 1
    }

    // From step 1 to step 2
    if (stepNumber === 2) {
      await this.clickButton('Next Step');
    }
  }

  /**
   * Check if a specific heading is visible
   * Best Practice: Uses semantic heading selectors
   */
  async verifyHeading(text: string): Promise<void> {
    await expect(this.page.locator('h2')).toContainText(text);
  }

  /**
   * Verify form is in read-only mode
   * Best Practice: Checks actual element properties
   */
  async verifyReadOnlyMode(): Promise<void> {
    const inputs = this.page.locator('input[type="text"]');
    const count = await inputs.count();

    for (let i = 0; i < count; i++) {
      const input = inputs.nth(i);
      const disabled = await input.getAttribute('disabled');
      expect(disabled).not.toBeNull();
    }
  }

  /**
   * Accept terms and verify checkbox state
   * Best Practice: Explicit action with verification
   */
  async acceptTerms(): Promise<void> {
    const checkbox = this.page.locator('input[type="checkbox"]');
    await checkbox.check();
    await expect(checkbox).toBeChecked();
  }

  /**
   * Verify success message is displayed
   * Best Practice: Checks for multiple success indicators
   */
  async verifySubmissionSuccess(): Promise<void> {
    await expect(this.page.locator('h2')).toContainText('Form Submitted Successfully');
    await expect(this.page.locator('.success-message')).toBeVisible();
    await expect(this.page.locator('.submitted-data')).toBeVisible();
  }

  /**
   * Get all form input values as an array
   * Best Practice: Non-destructive data access for assertions
   */
  async getFormValues(): Promise<string[]> {
    const inputs = this.page.locator('input[type="text"]');
    const values: string[] = [];

    const inputArray = await inputs.all();
    for (const input of inputArray) {
      const value = await input.inputValue();
      values.push(value);
    }

    return values;
  }

  /**
   * Wait for form to be fully loaded and interactive
   * Best Practice: Explicit wait strategy for web components
   */
  async waitForFormReady(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
    await this.page.locator('kol-input-text').first().waitFor({ state: 'visible' });
  }
}
