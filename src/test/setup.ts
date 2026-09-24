import "@testing-library/jest-dom/vitest";
import { vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
afterEach(cleanup);
Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi
        .fn()
        .mockImplementation(() => ({
        matches: false,
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
    })),
});
globalThis.ResizeObserver = class {
    observe() { }
    unobserve() { }
    disconnect() { }
};
HTMLDialogElement.prototype.showModal = function () {
    this.setAttribute("open", "");
};
HTMLDialogElement.prototype.close = function () {
    this.removeAttribute("open");
};
window.scrollTo = vi.fn();
HTMLElement.prototype.scrollTo = vi.fn();
