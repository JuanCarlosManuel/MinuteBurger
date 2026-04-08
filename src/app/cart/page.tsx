"use client";
import React from "react";
import { useRouter } from "next/navigation";
import CartItem from "../components/CartItem";
import { useGlobalContext } from "@/context/store";
import { OrderProps } from "@/types";

function page() {
  const router = useRouter();
  const { cart, updateCart, addOrder } = useGlobalContext();
  const [subtotal, setSubtotal] = React.useState(0);
  const [customerName, setCustomerName] = React.useState("");
  const [customerPhone, setCustomerPhone] = React.useState("");
  const [customerAddress, setCustomerAddress] = React.useState("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [error, setError] = React.useState("");
  const [successMessage, setSuccessMessage] = React.useState("");

  React.useEffect(() => {
    let total = cart.reduce((a, b) => a + (b.quantity * b.price || 0), 0);
    setSubtotal(total);
  }, [cart]);

  const onIncreaseQuantity = (id: number) => {
    let clonedItems = [...cart];
    clonedItems.forEach((item) => {
      if (item.id === id) {
        item.quantity += 1;
      }
    });
    updateCart(clonedItems);
  };

  const onDecreaseQuantity = (id: number) => {
    let clonedItems = [...cart];
    const index = clonedItems.findIndex((obj) => obj.id === id);
    if (index !== -1) {
      if (clonedItems[index].quantity >= 1) {
        clonedItems[index].quantity -= 1;
        updateCart(clonedItems);
      } else {
        clonedItems.splice(index, 1);
        updateCart(clonedItems);
      }
    }
  };

  const handlePlaceOrder = async () => {
    setError("");
    setSuccessMessage("");

    // Validation
    if (!customerName.trim()) {
      setError("Please enter your full name");
      return;
    }
    if (!customerPhone.trim()) {
      setError("Please enter your phone number");
      return;
    }
    if (!customerAddress.trim()) {
      setError("Please enter your address");
      return;
    }
    if (cart.length === 0) {
      setError("Your cart is empty");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create order object
      const newOrder: OrderProps = {
        id: Date.now().toString(),
        timestamp: Date.now(),
        customerName: customerName.trim(),
        customerPhone: customerPhone.trim(),
        customerAddress: customerAddress.trim(),
        items: cart,
        total: subtotal,
        status: "pending",
      };

      // Add order to context/storage
      addOrder(newOrder);

      // Clear cart
      updateCart([]);

      // Show success message
      setSuccessMessage("Order placed successfully! Thank you for your order.");
      
      // Reset form
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");

      // Redirect after 2 seconds
      setTimeout(() => {
        router.push("/menu");
      }, 2000);
    } catch (err) {
      setError("Failed to place order. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="px-4 pt-36 lg:px-24 min-h-screen pb-12">
      <div className="flex flex-col lg:flex-row gap-10">
        <div className="w-full lg:w-1/2 bg-gray-500/5 rounded-lg backdrop-filter backdrop-blur-lg">
          <div className="border-b border-gray-600 py-4 px-4">
            <h2 className="text-white text-xl">Contact Info</h2>
          </div>
          <div className="px-4 py-4">
            <div className="flex flex-col">
              <label className="text-gray-100">Full Name: *</label>
              <input
                type="text"
                placeholder="Your Full Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-transparent border border-gray-500 text-white mt-1 px-3 py-2 rounded focus:border-amber-500 outline-none"
              />
            </div>
          </div>
          <div className="px-4 py-4">
            <div className="flex flex-col">
              <label className="text-gray-100">Phone Number: *</label>
              <input
                type="text"
                placeholder="Your Phone Number"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="bg-transparent border border-gray-500 text-white mt-1 px-3 py-2 rounded focus:border-amber-500 outline-none"
              />
            </div>
          </div>
          <div className="px-4 py-4">
            <div className="flex flex-col">
              <label className="text-gray-100">Address: *</label>
              <input
                type="text"
                placeholder="Your Address"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                className="bg-transparent border border-gray-500 text-white mt-1 px-3 py-2 rounded focus:border-amber-500 outline-none"
              />
            </div>
          </div>
        </div>
        <div className="w-full lg:w-1/2 bg-gray-500/5 rounded-lg backdrop-filter backdrop-blur-lg">
          <div className="border-b border-gray-600 py-4 px-4">
            <h2 className="text-white text-xl">Order Summary</h2>
          </div>
          <div className="px-4 py-4 flex flex-col gap-4 border-b border-gray-600 max-h-64 overflow-y-auto">
            {cart.length === 0 ? (
              <p className="text-gray-400 text-center py-8">Your cart is empty</p>
            ) : (
              cart.map((item, index) => (
                <CartItem
                  key={index}
                  name={item.name}
                  image={item.image}
                  id={item.id}
                  price={item.price}
                  quantity={item.quantity}
                  increaseQuantity={onIncreaseQuantity}
                  decreaseQuantity={onDecreaseQuantity}
                />
              ))
            )}
          </div>
          <div className="px-4 py-6 flex flex-col">
            <div className="border-t border-gray-600 pt-4 mb-4">
              <div className="flex flex-row justify-between text-white">
                <span className="text-gray-300">Subtotal:</span>
                <span className="font-semibold text-lg">₱{subtotal.toLocaleString()}</span>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-2 rounded mb-4 text-sm">
                {error}
              </div>
            )}

            {successMessage && (
              <div className="bg-green-500/20 border border-green-500/50 text-green-300 px-4 py-2 rounded mb-4 text-sm">
                {successMessage}
              </div>
            )}

            <button
              type="button"
              onClick={handlePlaceOrder}
              disabled={isSubmitting || cart.length === 0}
              className="w-full rounded-full py-2 font-bold text-lg bg-amber-400 text-black mt-10 transition-all hover:scale-105 shadow-lg shadow-amber-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default page;
