// Replace console methods with Jest mocks.
// This also makes the test output cleaner by preventing these methods
// from printing to the screen.
global.console = {
  // We won't mock console.log and console.debug as they can be used for
  // basic debugging.
  ...console,
  info: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};
