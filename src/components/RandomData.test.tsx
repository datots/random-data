import { render, screen, fireEvent } from "@testing-library/react";
import RandomData from "./RandomData"; // Adjust the path according to your project structure

describe("RandomData Component Tests", () => {
  beforeEach(() => {
    render(<RandomData />);
  });

  test("generates user data for different regions", async () => {
    // Select the region dropdown
    const regionSelect = screen.getByLabelText(/select region/i);

    // Change the region to Poland
    fireEvent.change(regionSelect, { target: { value: "Poland" } });

    // Click the button to generate random seed
    const generateButton = screen.getByRole("button", {
      name: /generate random seed/i,
    });
    fireEvent.click(generateButton);

    // Wait for the generated user data to be rendered
    const generatedUsers = await screen.findAllByText(/Poland/i);

    // Assert that users are generated for the selected region
    expect(generatedUsers.length).toBeGreaterThan(0); // Ensure there are generated users

    // Check that each user element contains the string "Poland"
    generatedUsers.forEach((user) => {
      expect(user.textContent).toMatch(/Poland/i);
    });
  });

  // Other tests...
});
