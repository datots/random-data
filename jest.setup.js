// jest.setup.js

// Mock IntersectionObserver
global.IntersectionObserver = class {
  constructor(callback) {
    this.callback = callback;
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }

  // A method to trigger the observer callback with mock entries
  trigger(entries) {
    this.callback(entries);
  }
};
