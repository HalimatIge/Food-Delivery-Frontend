import React, { useEffect, useState } from "react";
import axios from "../../config/axios";
import { toast } from "react-toastify";
import OrderDetailsModal from "../../component/OrderDetailsModal";
import { API_URL } from '../../config/constants';
const statusOptions = [
  "Pending",
  "Processing",
  "Confirmed",
  "On the way",
  "Delivered",
  "Cancelled"
];

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  Processing: "bg-blue-100 text-blue-800",
  Confirmed: "bg-indigo-100 text-indigo-800",
  "On the way": "bg-orange-100 text-orange-800",
  Delivered: "bg-green-100 text-green-800",
  Cancelled: "bg-red-100 text-red-800",
};

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // const response = await axios.get(`${API_URL}/api/orders`);
        const response = await axios.get(`${API_URL}/api/orders`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
        setOrders(response.data.data);
      } catch (err) {
        toast.error("Failed to fetch orders");
        console.error("Error fetching orders:", err);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      // await axios.put(`${API_URL}/api/orders/${orderId}/status`, { 
      //   status: newStatus 
      // });
      await axios.put(`${API_URL}/api/orders/${orderId}/status`, 
  { status: newStatus },
  {
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  }
);
      
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (err) {
      toast.error("Failed to update order status");
      console.error("Error updating status:", err);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesStatus = filterStatus === "All" || order.status === filterStatus;
    const matchesSearch = 
      order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (order.fullName && order.fullName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return matchesStatus && matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4C29]"></div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6 lg:mb-8">
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#FF4C29]">
          Order Management
        </h1>
        
        {/* Filters Section */}
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-full sm:w-48 flex-shrink-0"
          >
            <option value="All">All Statuses</option>
            {statusOptions.map(status => (
              <option key={status} value={status}>{status}</option>
            ))}
          </select>
          
          <input
            type="text"
            placeholder="Search by order ID or name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded text-sm w-full"
          />
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 bg-white rounded-lg shadow">
          <p className="text-gray-500 text-sm sm:text-base">No orders found matching your criteria</p>
        </div>
      ) : isMobileView ? (
        /* Mobile Cards View */
        <div className="space-y-4">
          {filteredOrders.map((order) => (
            <div key={order._id} className="bg-white rounded-lg shadow p-4 border-l-4 border-[#FF4C29]">
              <div className="space-y-3">
                {/* Order Header */}
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-semibold text-gray-900 text-sm">#{order._id.slice(-6)}</p>
                    <p className="text-xs text-gray-500">{order.fullName || "N/A"}</p>
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </span>
                </div>

                {/* Order Details */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Amount:</span>
                    <p className="font-medium">₦{order.totalAmount.toFixed(2)}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Status:</span>
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e.target.value)}
                      className={`text-xs font-medium px-2 py-1 rounded-full w-full mt-1 ${
                        statusColors[order.status] || "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status}>{status}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center pt-2 border-t border-gray-100">
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="text-[#FF4C29] hover:text-[#FF4C29]/80 font-medium text-xs py-1 px-3 border border-[#FF4C29] rounded"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Desktop Table View */
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 py-3 sm:px-6 sm:py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order._id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 sm:px-6 sm:py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order._id.slice(-6)}
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.fullName || "N/A"}
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      ₦{order.totalAmount.toFixed(2)}
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-4 whitespace-nowrap">
                      <select
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          statusColors[order.status] || "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-4 py-4 sm:px-6 sm:py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="text-[#FF4C29] hover:text-[#FF4C29]/80 font-medium text-sm py-1 px-3 border border-[#FF4C29] rounded hover:bg-[#FF4C29] hover:text-white transition-colors"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default AdminOrdersPage;