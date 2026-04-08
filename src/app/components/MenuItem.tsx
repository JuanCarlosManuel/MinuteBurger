import { MenuItemProps } from "@/types";
import React from "react";

interface MenuItemComponentProps extends MenuItemProps {
  addToCart: (item: MenuItemProps) => void;
}

function MenuItem({
  id,
  name,
  image,
  price,
  category,
  addToCart,
}: MenuItemComponentProps) {
  return (
    <div className="group">
      <div className="flex flex-col items-center justify-between h-full">
        <div className="w-full flex flex-col items-center">
          <img
            src={image}
            className="w-40 sm:w-48 lg:w-56 h-40 sm:h-48 lg:h-56 object-cover transition-transform group-hover:translate-y-2 duration-300"
            alt={name}
          />
          <p className="text-white uppercase text-xs sm:text-sm lg:text-base mt-2 text-center">{name}</p>
          {category && <p className="text-gray-400 text-xs">{category}</p>}
        </div>
        <div className="w-full flex flex-col items-center gap-2 mt-3">
          <p className="text-amber-400 font-semibold text-sm lg:text-lg">₱{price.toLocaleString()}</p>
          <button
            type="button"
            onClick={() => addToCart({ id, name, image, price, category })}
            className="border border-amber-500 text-white px-6 py-2 transition-all hover:bg-amber-500 hover:text-black text-xs sm:text-sm font-semibold w-full max-w-xs"
          >
            Add To Cart
          </button>
        </div>
      </div>
    </div>
  );
}

export default MenuItem;
