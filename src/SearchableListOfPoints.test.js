import { render, screen, fireEvent } from "@testing-library/react";
import SearchableListOfPoints from "./SearchableListOfPoints";

describe("SearchableListOfPoints", () => {
  const points = [
    {
      id: "uid-1",
      position: ["lat-1", "lng-1"],
    },
    {
      id: "uid-2",
      position: ["lat-2", "lng-2"],
    },
  ];

  window.matchMedia = function () {
    return {
      matches: false,
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
    };
  };

  test("should display empty list message", () => {
    render(<SearchableListOfPoints />);

    expect(screen.getByTestId("empty-list-msg")).toBeInTheDocument();
  });

  test("should display a list of points", () => {
    render(<SearchableListOfPoints points={points} />);

    expect(screen.getByText(/uid-1/i)).toBeInTheDocument();
    expect(screen.getByText(/lat-1, lng-1/i)).toBeInTheDocument();
    expect(screen.getByText(/uid-2/i)).toBeInTheDocument();
    expect(screen.getByText(/lat-2, lng-2/i)).toBeInTheDocument();
  });

  test("should call callback function when a point was clicked", () => {
    const clickHandler = jest.fn();
    const point = points[0];

    render(
      <SearchableListOfPoints points={[point]} onPointClick={clickHandler} />
    );

    fireEvent.click(screen.getByText(/View position/i));

    expect(clickHandler).toHaveBeenCalledTimes(1);
    expect(clickHandler).toHaveBeenLastCalledWith(point.position);
  });

  test("should filter a list", () => {
    render(<SearchableListOfPoints points={points} />);

    fireEvent.change(screen.getByTestId("search-input"), {
      target: {
        value: "uid-2",
      },
    });

    expect(screen.queryByText(/uid-1/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/lat-1, lng-1/i)).not.toBeInTheDocument();
    expect(screen.getByText(/uid-2/i)).toBeInTheDocument();
    expect(screen.getByText(/lat-2, lng-2/i)).toBeInTheDocument();
  });
});
