import { render, screen, fireEvent, act } from "@testing-library/react";
import { afterEach, expect, test, vi } from "vitest";
import App from "../App";
afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllGlobals();
});
test("renders thesis-first application and rejects empty input", () => {
  render(<App />);
  expect(
    screen.getByRole("heading", { name: /Conviction begins/ }),
  ).toBeInTheDocument();
  fireEvent.change(screen.getByLabelText(/YOUR RESEARCH THESIS/), {
    target: { value: "  " },
  });
  expect(screen.getByRole("button", { name: /Run Fidelis/ })).toBeDisabled();
});
test("runs deterministically through results without external APIs", () => {
  vi.useFakeTimers();
  const fetch = vi.fn(() => {
    throw Error("Network forbidden");
  });
  vi.stubGlobal("fetch", fetch);
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Run Fidelis/ }));
  expect(
    screen.getByRole("button", { name: /Complete demo/ }),
  ).toBeInTheDocument();
  act(() => vi.advanceTimersByTime(4200));
  expect(
    screen.getByRole("heading", { name: /The research shortlist/ }),
  ).toBeInTheDocument();
  expect(fetch).not.toHaveBeenCalled();
});
test("completion, candidate inspection, sorting and close work", () => {
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Run Fidelis/ }));
  fireEvent.click(screen.getByRole("button", { name: /Complete demo/ }));
  fireEvent.click(screen.getByRole("button", { name: "Inspect AMAT" }));
  expect(screen.getByRole("dialog", { name: "AMAT" })).toBeInTheDocument();
  expect(
    screen.getByRole("heading", { name: "Why considered relevant" }),
  ).toBeInTheDocument();
  fireEvent.click(
    screen.getByRole("button", { name: "Close candidate detail" }),
  );
  expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Company" }));
  expect(screen.getAllByRole("row")[1]).toHaveTextContent("AMAT");
  fireEvent.click(screen.getByRole("button", { name: "Company" }));
  expect(screen.getAllByRole("row")[1]).toHaveTextContent("TXN");
});
test("reduced motion goes straight to results", () => {
  vi.mocked(window.matchMedia).mockReturnValueOnce({
    matches: true,
  } as MediaQueryList);
  render(<App />);
  fireEvent.click(screen.getByRole("button", { name: /Run Fidelis/ }));
  expect(
    screen.getByRole("heading", { name: /The research shortlist/ }),
  ).toBeInTheDocument();
});
