import React from "react";

interface ProductFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

function ProductFilter({ selectedCategory, onCategoryChange }: ProductFilterProps) {
  const categories = ["All", "Burgers", "Drinks"];

  return (
    <div>
      <div className="space-y-4 border-b px-4 lg:px-6 pb-6 border-gray-700">
        {categories.map((category) => (
          <div key={category} className="flex flex-row items-center gap-2">
            <input
              type="radio"
              value={category}
              name="category"
              checked={selectedCategory === category}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-4 h-4 bg-amber-600 checked:bg-amber-400 cursor-pointer"
            />
            <label className="cursor-pointer text-sm lg:text-base">{category}</label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductFilter;
