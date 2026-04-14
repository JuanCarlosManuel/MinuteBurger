"use client";
import React from "react";
import MenuItem from "../components/MenuItem";
import SpeechSearch from "../components/SpeechSearch";
import foodMenu from "../../constant/foodMenu.json";
import ProductFilter from "../components/ProductFilter";
import { useGlobalContext } from "@/context/store";

function page() {
  const { cart, updateCart } = useGlobalContext();
  const [openFilters, setOpenFilters] = React.useState<boolean>(true);
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");
  const [searchQuery, setSearchQuery] = React.useState<string>("");

  const filteredMenu = foodMenu.filter((item: any) => {
    // Filter by category
    const categoryMatch = selectedCategory === "All" || item.category === selectedCategory;
    
    // Filter by search query
    const searchMatch = searchQuery === "" || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return categoryMatch && searchMatch;
  });
  
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const onAddToCart = (newItem: any) => {
    let updatedCart = [...cart];
    const index = updatedCart.findIndex((obj) => obj.id === newItem.id);
    if (index !== -1) {
      updatedCart[index].quantity += 1;
    } else {
      updatedCart.push({ ...newItem, quantity: 1 });
    }

    updateCart(updatedCart);
  };

  return (
    <div className="px-3 sm:px-6 pt-36 lg:px-24 min-h-screen pb-12">
      <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 text-center">Our Menu</h1>
      
      {/* Speech Search - Full width above filters and menu */}
      <div className="mb-6">
        <SpeechSearch onSearchChange={handleSearchChange} placeholder="Search menu items or use voice..." />
      </div>
      
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Filters - Hidden on mobile, visible on lg */}
        <div className="w-full lg:w-1/4">
          <div className="bg-gray-500/5 rounded-lg backdrop-filter backdrop-blur-lg text-white sticky top-40">
            <button
              type="button"
              onClick={() => setOpenFilters(!openFilters)}
              className="w-full lg:hidden flex flex-row justify-between items-center py-4 px-4 border-b border-gray-500"
            >
              <span className="font-semibold">Filters</span>
              <svg
                className={`w-6 h-6 text-white transition-transform ${openFilters ? 'rotate-180' : ''}`}
                aria-hidden="true"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.5}
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <div className={`py-4 ${openFilters ? 'block' : 'hidden lg:block'}`}>
              <ProductFilter selectedCategory={selectedCategory} onCategoryChange={setSelectedCategory} />
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        <div className="w-full lg:w-3/4">
          {searchQuery && (
            <div className="mb-4 p-4 bg-amber-700/20 border border-amber-600/50 rounded-lg">
              <p className="text-white">
                Searching for: <span className="font-semibold text-amber-400">"{searchQuery}"</span>
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredMenu.length > 0 ? (
              filteredMenu.map((item: any) => (
                <MenuItem
                  id={item.id}
                  key={item.id}
                  name={item.name}
                  image={item.image}
                  price={item.price}
                  category={item.category}
                  addToCart={onAddToCart}
                />
              ))
            ) : (
              <div className="col-span-full text-center text-gray-400 py-12">
                <p className="text-xl">
                  {searchQuery ? `No items found matching "${searchQuery}"` : "No items in this category"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
