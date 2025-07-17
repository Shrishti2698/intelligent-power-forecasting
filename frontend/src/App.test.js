import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders dashboard title", () => {
  render(<App />);
  const heading = screen.getByText(/24-Hour Load Forecast Dashboard/i);
  expect(heading).toBeInTheDocument();
});
