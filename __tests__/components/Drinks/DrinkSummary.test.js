import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";

import DrinksSummary from "../../../components/Drinks/DrinksSummary";

const displayMsg = "Đặt đồ uống mang đi!";

test("Component displays heading message.", () => {
  render(<DrinksSummary />);
  // Assertion
  expect(
    screen.getByRole("heading", {
      name: new RegExp(displayMsg),
    })
  );
});
