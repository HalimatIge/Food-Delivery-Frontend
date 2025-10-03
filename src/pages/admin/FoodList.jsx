import { useEffect, useState } from 'react';
import axios from '../../config/axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FiSearch, FiEdit, FiTrash2, FiPlus, FiEye, FiEyeOff, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { API_URL } from '../../config/constants';
const FoodList = () => {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'main', label: 'Main Courses' },
    { value: 'appetizer', label: 'Appetizers' },
    { value: 'dessert', label: 'Desserts' },
    { value: 'beverage', label: 'Beverages' },
    { value: 'special', label: 'Specials' }
  ];

  const fetchFoods = async () => {
    try {
      setLoading(true);
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        ...(searchTerm && { search: searchTerm }),
        ...(filterCategory !== 'all' && { category: filterCategory })
      };

      // const res = await axios.get(`${API_URL}/api/foodItems`, {
      //   params,
      //   withCredentials: true,
      // });
      const res = await axios.get(`${API_URL}/api/foodItems`, {
  params,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
      setFoods(res.data.foodItems || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load food items");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, [currentPage, searchTerm, filterCategory]);

  const handleDelete = (id) => {
    setPendingDeleteId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    try {
      // await axios.delete(`${API_URL}/api/foodItems/${pendingDeleteId}`, {
      //   withCredentials: true,
      // });
      await axios.delete(`${API_URL}/api/foodItems/${pendingDeleteId}`, {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});
      toast.success("Item deleted successfully");
      setShowConfirm(false);
      fetchFoods();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete item");
    }
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setPendingDeleteId(null);
  };

  const toggleAvailability = async (foodId, currentStatus) => {
    try {
      // await axios.put(
      //   `${API_URL}/api/foodItems/${foodId}`,
      //   { available: !currentStatus },
      //   { withCredentials: true }
      // );

      await axios.put(
  `${API_URL}/api/foodItems/${foodId}`,
  { available: !currentStatus },
  { 
    withCredentials: true,
    headers: {
      'Content-Type': 'application/json'
    }
  }
);
      toast.success(`Item ${!currentStatus ? 'activated' : 'deactivated'}`);
      fetchFoods();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update item");
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleCategoryChange = (e) => {
    setFilterCategory(e.target.value);
    setCurrentPage(1);
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };

  const renderPagination = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`px-3 py-1 rounded-lg ${
            currentPage === i
              ? "bg-[#FF4C29] text-white"
              : "bg-white text-gray-700 hover:bg-gray-100"
          }`}
        >
          {i}
        </button>
      );
    }

    return (
      <div className="flex items-center justify-center space-x-2 mt-4">
        <button
          onClick={() => goToPage(currentPage - 1)}
          disabled={currentPage === 1}
          className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          <FiChevronLeft size={16} />
        </button>
        {pages}
        <button
          onClick={() => goToPage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="p-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        >
          <FiChevronRight size={16} />
        </button>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4C29]"></div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#FF4C29]">Food Management</h1>
        <Link 
          to="/admin/foods/new" 
          className="bg-[#FF4C29] text-white px-4 py-2 rounded-lg hover:bg-[#e04427] transition flex items-center"
        >
          <FiPlus className="mr-2" />
          Add New Food
        </Link>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search food items..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-[#FF4C29]"
            />
          </div>
          
          <select
            value={filterCategory}
            onChange={handleCategoryChange}
            className="border rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#FF4C29]"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          
          <div className="text-sm text-gray-600 flex items-center">
            Showing {foods.length} items
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Food Item</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {foods.map((food) => (
                <tr key={food._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <img
                        src={food.images?.[0]?.url || '/placeholder.jpg'}
                        alt={food.name}
                        className="h-10 w-10 rounded-lg object-cover mr-3"
                      />
                      <div>
                        <div className="font-medium text-gray-900">{food.name}</div>
                        <div className="text-sm text-gray-500 truncate max-w-xs">
                          {food.description}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                      {food.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-900">₦{food.price?.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => toggleAvailability(food._id, food.available)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        food.available
                          ? 'bg-green-100 text-green-800 hover:bg-green-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {food.available ? <FiEye className="mr-1" /> : <FiEyeOff className="mr-1" />}
                      {food.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <Link
                        to={`/admin/foods/edit/${food._id}`}
                        className="text-[#FF4C29] hover:text-[#e04427] flex items-center"
                      >
                        <FiEdit className="mr-1" />
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="text-red-600 hover:text-red-800 flex items-center"
                      >
                        <FiTrash2 className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {foods.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">No food items found</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="border-t border-gray-200 px-6 py-4">
            {renderPagination()}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md max-w-sm w-full mx-4">
            <h2 className="text-lg font-bold mb-2">Confirm Delete</h2>
            <p className="text-gray-600 mb-4">Are you sure you want to delete this item? This action cannot be undone.</p>
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodList;