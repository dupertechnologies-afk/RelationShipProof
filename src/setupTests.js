import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import 'jsdom-global/register'; // Polyfill for navigator.clipboard

// runs cleanup after each test case (e.g., clearing jsdom)
afterEach(() => {
  cleanup();
});

// Mock react-toastify
vi.mock('react-toastify', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
  ToastContainer: vi.fn(() => null),
}));

// Mock navigator.clipboard for copy functionality
Object.defineProperty(navigator, 'clipboard', {
  value: {
    writeText: vi.fn(),
  },
  writable: true,
});




