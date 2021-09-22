import React from "react";
import * as R from "ramda";

import useMediaQuery from "./useMediaQuery";

const styles = {
  list: (isXlDevice) => ({
    overflowY: "scroll",
    maxHeight: isXlDevice ? "100%" : "435px",
    width: isXlDevice ? "400px" : "auto",
  }),
};

export default function SearchableListOfPoints({ points, onPointClick }) {
  const [search, setSearch] = React.useState("");

  const handleSearch = (e) => {
    const searchValue = e.target.value;
    setSearch(searchValue);
  };

  const filteredPoints = !R.isEmpty(search)
    ? R.filter(R.compose(R.startsWith(search), R.prop("id")), points)
    : points;

  const isXlDevice = useMediaQuery("(min-width: 1200px)");

  return (
    <>
      <input
        type="text"
        className="form-control"
        onChange={handleSearch}
        placeholder="search for ID"
      />
      <ul className="mt-1 list-group" style={styles.list(isXlDevice)}>
        {R.map(
          ({ id, position }) => (
            <li
              key={id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <span className="text-nowrap">ID: {id}</span>
              <span className="mx-3 badge bg-secondary rounded-pill text-nowrap">
                {position[0]}, {position[1]}
              </span>
              <button
                onClick={() => onPointClick(position)}
                className="btn btn-primary btn-sm text-nowrap"
              >
                View position
              </button>
            </li>
          ),
          filteredPoints
        )}
      </ul>
    </>
  );
}
