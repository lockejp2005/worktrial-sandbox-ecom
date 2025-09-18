# Unit Tests

This directory contains unit tests for the e-commerce template project.

## Test Coverage

### API Endpoints
- **Products API** (`api-products.test.ts`)
  - GET /api/products - List products with filtering and pagination
  - GET /api/products/[id] - Get single product by ID
  
- **Customers API** (`api-customers.test.ts`)
  - GET /api/customers - List customers with filtering and pagination
  - Validates complex customer data structure including analytics

### Utilities
- **API Utils** (`api-utils.test.ts`)
  - Error handling utilities
  - Pagination helpers
  - API response formatting

## Running Tests

```bash
# Install test dependencies
npm install --save-dev @jest/globals jest @types/jest ts-jest

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

## Test Structure

Each test file follows this pattern:
- Import required dependencies
- Describe the module/feature being tested
- Group related tests with `describe` blocks
- Write individual test cases with `it` blocks
- Use descriptive test names that explain the expected behavior

## Adding New Tests

When adding new features:
1. Create a test file in this directory
2. Name it after the feature: `feature-name.test.ts`
3. Test both happy paths and edge cases
4. Include tests for error handling
5. Validate data structures and types

## Conventions

- Use `describe` for grouping related tests
- Start test descriptions with "should" for clarity
- Test one thing per test case
- Mock external dependencies when needed
- Keep tests focused and readable