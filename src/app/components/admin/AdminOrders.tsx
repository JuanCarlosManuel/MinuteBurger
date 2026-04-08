"use client";

import React, { useState } from "react";
import { OrderProps } from "@/types";

interface AdminOrdersProps {
  orders: OrderProps[];
  onStatusChange: (orderId: string, status: 'pending' | 'preparing' | 'completed') => void;
}

export default function AdminOrders({ orders, onStatusChange }: AdminOrdersProps) {
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      case "preparing":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "completed":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-4">
      {orders.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-xl">No orders yet</p>
        </div>
      ) : (
        orders.map((order) => (
          <div
            key={order.id}
            className="bg-gray-500/10 border border-gray-600 rounded-lg overflow-hidden hover:border-amber-500/50 transition-colors"
          >
            {/* Order Header */}
            <button
              onClick={() =>
                setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
              }
              className="w-full px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:bg-gray-500/5 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4 w-full lg:w-auto text-left">
                <div>
                  <p className="text-white font-semibold text-lg">
                    Order #{order.id.slice(0, 8)}
                  </p>
                  <p className="text-gray-400 text-sm">{formatDate(order.timestamp)}</p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex flex-col">
                  <p className="text-gray-300 text-sm">Customer</p>
                  <p className="text-white font-semibold">{order.customerName}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-gray-300 text-sm">Items</p>
                  <p className="text-white font-semibold">{order.items.length} items</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-gray-300 text-sm">Total</p>
                  <p className="text-amber-400 font-semibold">₱{order.total.toLocaleString()}</p>
                </div>

                <select
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    onStatusChange(order.id, e.target.value as 'pending' | 'preparing' | 'completed')
                  }
                  value={order.status}
                  className={`px-4 py-2 rounded border font-semibold text-sm cursor-pointer ${getStatusBadgeColor(
                    order.status
                  )} bg-transparent`}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <svg
                className={`w-5 h-5 text-gray-400 transition-transform ${
                  expandedOrderId === order.id ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </button>

            {/* Order Details */}
            {expandedOrderId === order.id && (
              <div className="border-t border-gray-600 px-6 py-4 bg-gray-500/5">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Name</p>
                    <p className="text-white font-semibold">{order.customerName}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Phone</p>
                    <p className="text-white font-semibold">{order.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm mb-1">Address</p>
                    <p className="text-white font-semibold">{order.customerAddress}</p>
                  </div>
                </div>

                <div>
                  <p className="text-gray-400 text-sm mb-3">Items Ordered:</p>
                  <div className="space-y-2 bg-gray-500/30 rounded p-4">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center">
                        <div className="flex-1">
                          <p className="text-white capitalize">
                            {item.quantity}x {item.name}
                          </p>
                        </div>
                        <p className="text-amber-400 font-semibold">
                          ₱{(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Order Total */}
                  <div className="mt-4 flex justify-between items-center border-t border-gray-600 pt-4">
                    <p className="text-white text-lg font-bold">Total:</p>
                    <p className="text-amber-400 text-xl font-bold">
                      ₱{order.total.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
