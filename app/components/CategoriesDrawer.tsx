import React, { useState, useEffect } from "react";

interface CategoriesDrawerProps {
  isOpen: boolean;
  toggleDrawer: () => void;
  onFilterChange: (filters: FilterState) => void;
  productType: "garment" | "fabric";
}

interface FilterState {
  categories: string[];
  priceRanges: string[];
  colors: string[];
  sizes: string[];
  brands: string[];
  materials: string[];
  patterns: string[];
}

const CategoriesDrawer: React.FC<CategoriesDrawerProps> = ({
  isOpen,
  toggleDrawer,
  onFilterChange,
  productType,
}) => {
  const [filters, setFilters] = useState<FilterState>({
    categories: [],
    priceRanges: [],
    colors: [],
    sizes: [],
    brands: [],
    materials: [],
    patterns: [],
  });

  const garmentCategories = [
    "Casual Saree",
    "Occasional Saree",
    "Suits",
    "Luxury Saree",
    "Kurtis",
  ];

  const fabricCategories = ["Cotton", "Silk", "Linen", "Wool", "Synthetic"];

  const garmentFilters = [
    {
      name: "Price Range",
      key: "priceRanges",
      options: ["₹0 - ₹1000", "₹1001 - ₹3000", "₹3001 - ₹5000", "₹5000+"],
    },
    {
      name: "Color",
      key: "colors",
      options: ["Red", "Blue", "Green", "Yellow", "Pink", "Purple"],
    },
    {
      name: "Size",
      key: "sizes",
      options: ["XS", "S", "M", "L", "XL", "XXL"],
    },
    {
      name: "Brand",
      key: "brands",
      options: ["Brand A", "Brand B", "Brand C", "Brand D"],
    },
  ];

  const fabricFilters = [
    {
      name: "Price Range (per meter)",
      key: "priceRanges",
      options: ["₹0 - ₹500", "₹501 - ₹1000", "₹1001 - ₹2000", "₹2000+"],
    },
    {
      name: "Color",
      key: "colors",
      options: ["Red", "Blue", "Green", "Yellow", "White", "Black"],
    },
    {
      name: "Material",
      key: "materials",
      options: ["Cotton", "Silk", "Linen", "Wool", "Polyester"],
    },
    {
      name: "Pattern",
      key: "patterns",
      options: ["Solid", "Printed", "Striped", "Checkered", "Floral"],
    },
  ];

  const categories =
    productType === "garment" ? garmentCategories : fabricCategories;
  const filterOptions =
    productType === "garment" ? garmentFilters : fabricFilters;

  useEffect(() => {
    // Reset filters when product type changes
    setFilters({
      categories: [],
      priceRanges: [],
      colors: [],
      sizes: [],
      brands: [],
      materials: [],
      patterns: [],
    });
    onFilterChange({
      categories: [],
      priceRanges: [],
      colors: [],
      sizes: [],
      brands: [],
      materials: [],
      patterns: [],
    });
  }, [productType, onFilterChange]);

  const handleFilterChange = (filterType: keyof FilterState, value: string) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters };
      if (filterType === "priceRanges") {
        // Remove the currency symbol and split the range
        const [min, max] = value.replace(/₹/g, "").split(" - ").map(Number);

        const rangeString = max ? `${min}-${max}` : `${min}+`;

        if (updatedFilters[filterType].some((range) => range === rangeString)) {
          updatedFilters[filterType] = updatedFilters[filterType].filter(
            (range) => range !== rangeString
          );
        } else {
          updatedFilters[filterType] = [
            ...updatedFilters[filterType],
            rangeString,
          ];
        }
      } else {
        const index = updatedFilters[filterType].indexOf(value);
        if (index === -1) {
          updatedFilters[filterType] = [...updatedFilters[filterType], value];
        } else {
          updatedFilters[filterType] = updatedFilters[filterType].filter(
            (item) => item !== value
          );
        }
      }
      onFilterChange(updatedFilters);
      return updatedFilters;
    });
  };

  return (
    <div className="relative">
      <div
        className={`sticky top-[64px] left-0 h-[calc(100vh-64px)] w-72 bg-base-200 transition-transform duration-300 ease-in-out z-20 overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-2">
          <h2 className="text-lg font-bold mb-2 text-primary">Categories</h2>
          <div className="space-y-1">
            {categories.map((category) => (
              <div key={category} className="form-control">
                <label className="label cursor-pointer py-1 justify-start space-x-2">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary checkbox-sm"
                    checked={filters.categories.includes(category)}
                    onChange={() => handleFilterChange("categories", category)}
                  />
                  <span className="label-text text-sm">{category}</span>
                </label>
              </div>
            ))}
          </div>

          <h2 className="text-lg font-bold mt-4 mb-2 text-primary">Filters</h2>
          <div className="space-y-2">
            {filterOptions.map((filter) => (
              <div
                key={filter.name}
                className="collapse collapse-arrow bg-base-100 rounded-box"
              >
                <input type="checkbox" className="peer" />
                <div className="collapse-title text-sm font-medium text-sky-500">
                  {filter.name}
                </div>
                <div className="collapse-content text-sm">
                  {filter.options.map((option) => (
                    <div key={option} className="form-control">
                      <label className="label cursor-pointer py-1 justify-start space-x-2">
                        <input
                          type="checkbox"
                          className="checkbox checkbox-sm checkbox-info"
                          checked={filters[
                            filter.key as keyof FilterState
                          ].includes(option)}
                          onChange={() =>
                            handleFilterChange(
                              filter.key as keyof FilterState,
                              option
                            )
                          }
                        />
                        <span className="label-text text-sm ">{option}</span>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <button
        onClick={toggleDrawer}
        className={`fixed writing-vertical top-1/3 -translate-y-1/3 btn-primary btn-outline p-2 rounded-r-md z-20 transition-all duration-300 ${
          isOpen ? "left-72" : "left-0"
        }`}
        title={
          isOpen
            ? "Close categories and filters"
            : "Open categories and filters"
        }
      >
        {isOpen ? "Close" : "Categories & Filters"}
      </button>
    </div>
  );
};

export default CategoriesDrawer;
/*<button
  onClick={toggleDrawer}
  className={`fixed writing-vertical top-1/4 -translate-y-1/4  btn-primary btn-outline text-white p-2 rounded-r-md z-20 transition-all duration-300 ${
    isOpen ? "left-64" : "left-0"
  }`}
>
  {isOpen ? "Close" : "Categories & Filters"}
</button>; */ //alternative

/*<SwapIcon
  isOpen={isOpen}
  toggleDrawer={toggleDrawer}
  className={`fixed top-1/2 -translate-y-1/2 z-20 transition-all duration-300 ${
    isOpen ? "left-64" : "left-0"
  }`}
/>;  */
