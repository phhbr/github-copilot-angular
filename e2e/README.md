# E2E Tests - Playwright Test Suite

This directory contains end-to-end tests for the Angular Form Application using Playwright.

## Test Files

### `form-data.spec.ts`
Tests for the `FormDataComponent` in both states:
- **Edit Mode**: Verifies form fields are editable and values can be entered
- **Read-Only Mode**: Verifies form fields are read-only and display data correctly

**Tests included:**
- Display and editable status of form fields
- Input validation and value updates
- Read-only field enforcement
- Terms of Service acceptance requirement

### `form-container.spec.ts`
Tests for the `FormContainerComponent` multi-step workflow:
- **Step 1**: Initial form display and navigation
- **Step 2**: Review, confirmation, and submission
- **Success Screen**: Result display and form reset

**Tests included:**
- UI layout and navigation buttons
- Step transitions and navigation
- Back button functionality
- Form submission workflow
- Form reset functionality

### `form-advanced.spec.ts`
Advanced integration tests demonstrating best practices:
- Uses Playwright fixtures for setup
- Implements reusable test utilities
- Comprehensive state management validation
- End-to-end workflow testing

## Test Utilities

### `test-utils.ts`
Provides `FormTestUtils` class with helper methods:
- `fillFormInputs()` - Fill multiple form fields
- `verifyInputsDisabled()` - Verify fields are disabled
- `clickButton()` - Click buttons by label
- `navigateToStep()` - Navigate between steps
- `verifyHeading()` - Verify page headings
- `acceptTerms()` - Accept terms checkbox
- `getFormValues()` - Retrieve all form values

## Best Practices Implemented

### 1. **Semantic Locators**
```typescript
// ✅ Good - Uses visible text
await page.locator('kol-button').filter({
  has: page.locator('text=Submit')
}).click();

// ❌ Avoid - Uses CSS selectors
await page.click('.submit-button');
```

### 2. **Page Object Pattern**
Encapsulates form interactions in `FormTestUtils` class for reusability and maintainability.

### 3. **Fixtures**
Uses Playwright's fixture system for consistent test setup:
```typescript
const formTest = test.extend<{ formUtils: FormTestUtils }>({
  formUtils: async ({ page }, use) => {
    const formUtils = new FormTestUtils(page);
    await use(formUtils);
  },
});
```

### 4. **Explicit Waits**
- Uses `waitForLoadState('networkidle')` for network stability
- Uses `.waitFor()` for element visibility before interaction

### 5. **Non-Destructive Assertions**
- Retrieves form values without modifying state
- Uses `.toContainText()` for partial matches
- Verifies both positive and negative cases

### 6. **Web Component Compatibility**
- Tests work with KoliBri web components
- Uses standard DOM selectors that work across web component boundaries
- Handles KoliBri-specific properties like `_disabled`, `_label`

## Running Tests

### Run all tests
```bash
pnpm e2e
```

### Run tests in UI mode (interactive)
```bash
pnpm e2e:ui
```

### Run tests in debug mode
```bash
pnpm e2e:debug
```

### Run specific test file
```bash
npx playwright test e2e/form-data.spec.ts
```

### Run tests on specific browser
```bash
npx playwright test --project=chromium
npx playwright test --project=firefox
```

### View test results
```bash
npx playwright show-report
```

## Test Coverage

Current test coverage:
- ✅ Form data input (8 fields: first name, last name, 3x invoice address, 3x shipping address)
- ✅ Form state transitions (Step 1 → Step 2 → Success)
- ✅ Back navigation and data retention
- ✅ Terms of Service validation
- ✅ Form submission
- ✅ Form reset and restart
- ✅ Read-only mode enforcement
- ✅ UI layout and styling

## Configuration

Tests are configured in `playwright.config.ts`:
- **Base URL**: `http://localhost:4200`
- **Browsers**: Chromium, Firefox
- **Parallel**: Enabled (4 workers by default)
- **Retries**: 2 on CI, 0 locally
- **Reporter**: HTML report

## CI/CD Integration

Tests automatically:
1. Start the dev server (`npm run start`)
2. Wait for server to be ready
3. Run tests in headless mode
4. Generate HTML report in `playwright-report/`

## Best Practices for Writing New Tests

### 1. Use Descriptive Test Names
```typescript
// ✅ Good
test('should prevent form submission without accepting terms');

// ❌ Avoid
test('form test');
```

### 2. Keep Tests Independent
Each test should be self-contained and not rely on other tests.

### 3. Use Fixtures for Common Setup
```typescript
const formTest = test.extend<{ setup }>({
  setup: async ({ page }, use) => {
    // Setup code
    await use(setupObject);
  },
});
```

### 4. Verify User Impact, Not Implementation
```typescript
// ✅ Good - Verifies what user sees
await expect(page.locator('h2')).toContainText('Success');

// ❌ Avoid - Tests internal state
expect(component.submitted()).toBe(true);
```

### 5. Use Page Object Pattern
Extract form interactions into utility classes for reusability.

### 6. Add JSDoc Comments
Document test purpose and assertions clearly.

## Troubleshooting

### Tests are timing out
- Check if dev server is running: `npm run start`
- Increase timeout in test config
- Check network stability

### Element not found errors
- Verify element is visible: use `.waitFor({ state: 'visible' })`
- Check if element is inside a shadow DOM
- Use browser dev tools to inspect element

### KoliBri component issues
- Use `CUSTOM_ELEMENTS_SCHEMA` in components
- Access properties with underscore prefix: `_disabled`, `_label`
- Check KoliBri component documentation

## Resources

- [Playwright Documentation](https://playwright.dev)
- [Best Practices Guide](https://playwright.dev/docs/best-practices)
- [KoliBri Components](https://public-ui.github.io/)
- [Angular Testing Guide](https://angular.io/guide/testing)
