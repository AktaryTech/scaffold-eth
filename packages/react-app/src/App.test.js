import React from "react";
import { render } from "@testing-library/react";
import App from "./App";

// eslint-disable-next-line
test("renders learn react link", () => {
  // eslint-disable-next-line
  const { getByText } = render(<App />);
  // eslint-disable-next-line
  const linkElement = getByText(/learn react/i);
  // eslint-disable-next-line
  expect(linkElement).toBeInTheDocument();
});
