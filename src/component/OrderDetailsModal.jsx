import React from "react";
import { createPortal } from "react-dom";

const OrderDetailsModal = ({ order, onClose }) => {
  if (!order) return null;

  return createPortal(
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center">
      <div className="bg-white max-w-lg w-full p-6 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
        >
          &times;
        </button>

        <h2 className="text-xl font-bold mb-4 text-[#FF4C29]">Order Details</h2>

        <p className="mb-2"><strong>Order ID:</strong> {order._id}</p>
        <p className="mb-2"><strong>Customer:</strong> {order.fullName}</p>
        <p className="mb-2"><strong>Phone:</strong> {order.phone}</p>
        <p className="mb-2"><strong>Address:</strong> {order.address}</p>
        <p className="mb-2"><strong>Payment:</strong> {order.paymentMethod}</p>
        <p className="mb-2"><strong>Status:</strong> {order.status}</p>

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Items:</h3>
          <ul className="text-sm space-y-1">
            {order.items.map((item) => (
              <li key={item._id} className="flex justify-between">
                <span>{item.name} × {item.quantity}</span>
                <span>₦{(item.price * item.quantity).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="text-right font-bold mt-4 text-lg">
          Total: ₦{order.totalAmount.toFixed(2)}
        </p>
      </div>
    </div>,
    document.body
  );
};

export default OrderDetailsModal;
