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
          <div key={order.id} className="mb-4">
            {/* Order Summary Row */}
            <button
              onClick={() =>
                setExpandedOrderId(expandedOrderId === order.id ? null : order.id)
              }
              className="w-full bg-gray-500/10 border border-gray-600 rounded-lg px-6 py-4 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 hover:bg-gray-500/20 hover:border-amber-500/50 transition-all"
            >
              <div className="flex flex-col text-left">
                <p className="text-white font-semibold text-lg">
                  Order #{order.id.slice(0, 8)}
                </p>
                <p className="text-gray-400 text-sm">{formatDate(order.timestamp)}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
                <div className="flex flex-col">
                  <p className="text-gray-300 text-xs">Customer</p>
                  <p className="text-white font-semibold text-sm">{order.customerName}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-gray-300 text-xs">Items</p>
                  <p className="text-white font-semibold text-sm">{order.items.length}</p>
                </div>

                <div className="flex flex-col">
                  <p className="text-gray-300 text-xs">Total</p>
                  <p className="text-amber-400 font-semibold text-sm">₱{order.total.toLocaleString()}</p>
                </div>

                <select
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    onStatusChange(order.id, e.target.value as 'pending' | 'preparing' | 'completed')
                  }
                  value={order.status}
                  className={`px-4 py-2 rounded border font-semibold text-xs cursor-pointer ${getStatusBadgeColor(
                    order.status
                  )} bg-transparent`}
                >
                  <option value="pending">Pending</option>
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <svg
                className={`w-5 h-5 text-gray-400 transition-transform flex-shrink-0 ${
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

            {/* Ticket-Style Order Details */}
            {expandedOrderId === order.id && (
              <div className="mt-3 bg-white/5 border border-amber-500/30 rounded-lg overflow-hidden">
                {/* Ticket Header */}
                <div className="bg-gradient-to-r from-amber-600/20 to-amber-700/20 px-6 py-4 text-center border-b border-amber-500/30">
                  <p className="text-amber-300 font-bold text-lg">BISNAR'S BURGER</p>
                  <p className="text-gray-400 text-xs mt-1">
                    ================================
                  </p>
                </div>

                {/* Order Number & Date */}
                <div className="px-6 py-4 border-b border-gray-600">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Order #</span>
                    <span className="text-white font-semibold">{order.id.slice(0, 8)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-400 text-sm">Date/Time</span>
                    <span className="text-white font-semibold text-sm">{formatDate(order.timestamp)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400 text-sm">Status</span>
                    <span className={`font-semibold px-3 py-1 rounded text-xs ${getStatusBadgeColor(order.status)}`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Customer Info */}
                <div className="px-6 py-4 border-b border-gray-600 bg-gray-500/5">
                  <p className="text-gray-300 text-xs uppercase tracking-widest mb-3 font-semibold">Customer Info</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Name:</span>
                      <span className="text-white font-semibold">{order.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400 text-sm">Phone:</span>
                      <span className="text-white">{order.customerPhone}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-gray-400 text-sm">Address:</span>
                      <span className="text-white text-right max-w-xs">{order.customerAddress}</span>
                    </div>
                  </div>
                </div>

                {/* Items Section */}
                <div className="px-6 py-4 border-b border-gray-600">
                  <p className="text-gray-300 text-xs uppercase tracking-widest mb-3 font-semibold">Items Ordered</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between items-center text-sm">
                        <div className="flex-1">
                          <span className="text-white capitalize font-medium">
                            {item.quantity}x {item.name}
                          </span>
                        </div>
                        <span className="text-gray-400 text-xs">
                          ₱{item.price.toLocaleString()} ea
                        </span>
                        <span className="text-amber-400 font-semibold ml-3 min-w-16 text-right">
                          ₱{(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Divider */}
                <div className="px-6 py-2">
                  <p className="text-gray-600 text-xs text-center">
                    ================================
                  </p>
                </div>

                {/* Total */}
                <div className="px-6 py-4 bg-amber-600/10 border-t border-amber-500/30">
                  <div className="flex justify-between items-center">
                    <span className="text-white text-lg font-bold">TOTAL:</span>
                    <span className="text-amber-400 text-2xl font-bold">
                      ₱{order.total.toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 text-center border-t border-gray-600 bg-gray-500/5">
                  <p className="text-gray-400 text-xs">
                    Thank you for your order!
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    ================================
                  </p>
                </div>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
