import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from '../config/axios';
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PageHeader from "./PageHeader";
import { API_URL } from '../config/constants';


const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user } = useAuth(); 
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    paymentMethod: "Pay on Delivery",
  });

  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    const userId = user?.id || user?._id;

  //   console.log("🛒 Checkout Debug Info:");
  // console.log("- User ID:", user?.id);
  // console.log("- User object:", user);
  // console.log("- Form data:", form);
  // console.log("- Cart items:", cartItems);
  // console.log("- Total amount:", totalAmount);

   
  
  if (!form.fullName || !form.phone || !form.address) {
    toast.error("Please fill in all required fields");
    return;
  }

  if (!userId) {
    toast.error("User not authenticated");
    return;
  }

  if (cartItems.length === 0) {
    toast.error("Cart is empty");
    return;
  }

  try {
    const orderData = {
      userId: userId,
      items: cartItems,
      totalAmount,
      fullName: form.fullName,
      phone: form.phone,
      address: form.address,
      paymentMethod: form.paymentMethod,
    };

    console.log("📦 Sending order data:", orderData);

    // const response = await axios.post(`${API_URL}/api/orders`, orderData);
    const response = await axios.post(`${API_URL}/api/orders`, orderData, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
    
    // console.log("✅ Order response:", response.data);

    toast.success("Order placed successfully!");
    clearCart();
    navigate("/orders");
  } catch (err) {
    
    toast.error(err.response?.data?.message || "Something went wrong");
  }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
     <PageHeader title="Checkout" />

      {/* Order Summary */}
      <div className="mb-6">
        <h2 className="font-semibold text-lg mb-2">Order Summary</h2>
        {cartItems.map((item) => (
          <div key={item._id} className="flex justify-between border-b py-2">
            <span>
              {item.name} × {item.quantity}
            </span>
            <span>₦{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="text-right font-bold mt-2">
          Total: ₦{totalAmount.toFixed(2)}
        </div>
      </div>

      {/* Delivery Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="fullName"
          placeholder="Full Name"
          required
          value={form.fullName}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          required
          value={form.phone}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <textarea
          name="address"
          placeholder="Delivery Address"
          required
          value={form.address}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />
        <select
          name="paymentMethod"
          value={form.paymentMethod}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        >
          <option value="Pay on Delivery">Pay on Delivery</option>
          <option value="Card">Card</option>
        </select>

        <button
          type="submit"
          className="bg-[#FF4C29] text-white px-6 py-2 rounded hover:bg-[#e04427]"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;
