import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom"; 
import PageHeader from "./PageHeader";
import { API_URL } from '../config/constants';


const OrdersPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate(); 
  const [orders, setOrders] = useState([]);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
const [selectedOrderId, setSelectedOrderId] = useState(null);

  useEffect(() => {
    const userId = user?.id || user?._id;
    if (userId) {
      console.log("🔄 Fetching orders for user ID:", userId); // Debug log
      axios.get(`${API_URL}/api/orders/${userId}`)
        .then(res => {
           console.log("✅ Orders fetched:", res.data); // Debug log
          setOrders(res.data.data)
        })
       .catch(err => {
          console.error("❌ Failed to fetch user orders", err);
          console.error("Error details:", err.response?.data);
        });
    }
  }, [user]);

  if (!user) return <p className="p-6">You need to log in to view orders.</p>;

  const promptCancel = (orderId) => {
  setSelectedOrderId(orderId);
  setShowConfirmModal(true);
};
 const handleGoBack = () => {
    navigate(-1); // Goes back to previous page in history
  };


const confirmCancel = async () => {
  try {
    const res = await axios.put(`${API_URL}/api/orders/${selectedOrderId}/cancel`);
    setOrders((prev) =>
      prev.map((order) =>
        order._id === selectedOrderId ? { ...order, status: "Cancelled" } : order
      )
    );
    toast.success(res.data.message || "Order cancelled successfully!");
  } catch (err) {
    toast.error(err.response?.data?.message || "Failed to cancel order.");
  } finally {
    setShowConfirmModal(false);
    setSelectedOrderId(null);
  }
};

const canCancel = (createdAt) => {
  const createdTime = new Date(createdAt).getTime();
  const now = new Date().getTime();
  const diffMinutes = (now - createdTime) / 60000;
  return diffMinutes <= 10;
};

  return (
    <div className="p-6 max-w-4xl mx-auto ">
   

 <PageHeader title="My Orders" />

      {orders.length === 0 ? (
        <p>You haven’t placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 rounded-lg shadow-md p-4 mb-6"
          >
            <div className="flex justify-between items-center mb-2">
              <p><strong>Order ID:</strong> {order._id}</p>
              <span
                className={`px-2 py-1 rounded text-xs font-semibold ${
  order.status === "Delivered"
    ? "bg-green-100 text-green-700"
    : order.status === "Cancelled"
    ? "bg-red-100 text-red-600"
    : order.status === "Pending"
    ? "bg-yellow-100 text-yellow-700"
    : order.status === "Processing"
    ? "bg-blue-100 text-blue-700"
    : order.status === "Confirmed"
    ? "bg-purple-100 text-purple-700"
    : order.status === "On the way"
    ? "bg-orange-100 text-orange-700"
    : "bg-gray-100 text-gray-700"
}`}

              >
                {order.status || "Pending"}
              </span>
            </div>

            <p className="text-sm text-gray-600">Ordered on: {new Date(order.createdAt).toLocaleString()}</p>
            <p className="text-sm">Delivery address: {order.address}</p>
            <p className="text-sm">Payment: {order.paymentMethod}</p>

            <ul className="mt-3 space-y-1 text-sm">
              {order.items.map((item) => (
                <li key={item._id}>
                  - {item.name} × {item.quantity} = ₦{(item.price * item.quantity).toFixed(2)}
                </li>
              ))}
            </ul>

            <p className="text-right font-semibold mt-2">
              Total: ₦{order.totalAmount.toFixed(2)}
            </p>

         <div>
             

{canCancel(order.createdAt) && order.status === "Pending" && (
  <button
    onClick={() => promptCancel(order._id)}
    className="text-red-500 hover:underline text-sm"
  >
    Cancel Order
  </button>
)}

         </div>

            
          </div>
          
        ))
      )
    }
    {showConfirmModal && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded shadow-md max-w-sm w-full">
      <h2 className="text-lg font-semibold mb-4">Cancel Order?</h2>
      <p className="mb-6">Are you sure you want to cancel this order?</p>
      <div className="flex justify-end gap-4">
        <button
          onClick={() => setShowConfirmModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          No
        </button>
        <button
          onClick={confirmCancel}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Yes, Cancel
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default OrdersPage;

