import React from "react";

function SearchFilterOption({
  filters,
  setFilters,
  filterDisplayName,
  filterValue,
  filterBGColorFrom,
  filterBGColorTo,
}) {
  const isActive = filters.includes(filterValue);
  return (
    <div
      className="form-group mx-sm-0"
      style={{ padding: 0, padding: "0px 10px", margin: '0 auto' }}
    >
      <h3>
        <span
          className="py-2 btn-custom font-weight-600 badge "
          style={{
            cursor: "pointer",
            backgroundImage: isActive
              ? `linear-gradient(to bottom right, ${filterBGColorFrom}, ${filterBGColorTo})`
              : `linear-gradient(to bottom right, #000000, #434343)`,
            color: "#fff",
            borderColor: "#fff",
            borderRadius: "10px",
            width: "auto",
            minWidth: '80px'
          }}
          onClick={() => {
            isActive
              ? setFilters((prev) =>
                  prev.filter((item) => item !== filterValue)
                )
              : setFilters((prev) => [...prev, filterValue]);
          }}
        >
          {filterDisplayName}
        </span>
      </h3>
    </div>
  );
}

export default SearchFilterOption;
