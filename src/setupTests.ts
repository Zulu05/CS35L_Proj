import '@testing-library/jest-dom';
import { vi } from 'vitest';

let store: Record<string, string> = {};

const mockLocalStorage = {
  getItem: (key: string) => store[key] || null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    store = {};
  },
};

Object.defineProperty(global, "localStorage", {
  value: mockLocalStorage,
  writable: false,
});
