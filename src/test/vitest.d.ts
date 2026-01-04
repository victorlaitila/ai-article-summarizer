import type { TestingLibraryMatchers } from '@testing-library/jest-dom/matchers';

declare module 'vitest' {
  interface Assertion<T = any> extends jest.Matchers<void, T>, TestingLibraryMatchers<T, void> {}
  // eslint-disable-next-line
  interface AsymmetricMatchersContaining extends TestingLibraryMatchers {}
}
