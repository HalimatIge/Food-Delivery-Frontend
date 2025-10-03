import React, { useEffect, useState } from "react";
import axios from "../config/axios";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FoodItemCard from "../component/FoodItemCard";
import { FiSearch, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { API_URL } from '../config/constants';

const Dashboard = () => {
  const { user, authLoading } = useAuth();
  const navigate = useNavigate();

  const [category, setCategory] = useState("all");
  const [foodItems, setFoodItems] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState("dateAdded");
  const [order, setOrder] = useState("desc");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const categories = [
    { id: "all", name: "All Items" },
    { id: "starter", name: "Starters" },
    { id: "main", name: "Main Courses" },
    { id: "dessert", name: "Desserts" },
    { id: "beverage", name: "Beverages" },
    { id: "side", name: "Sides" }
  ];

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (user) {
      const fetchFood = async () => {
        setLoading(true);
        try {
          const endpoint = `${API_URL}/api/foodItems?category=${category}&page=${page}&sort=${sort}&order=${order}&search=${search}`;
          const res = await axios.get(endpoint,
            {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
}
          );
          setFoodItems(res.data.foodItems || []);
          setTotalPages(res.data.totalPages || 1);
        } catch (err) {
          console.error("Failed to fetch food items", err);
          setFoodItems([]);
        } finally {
          setLoading(false);
        }
      };

      const debounceTimer = setTimeout(() => {
        fetchFood();
      }, 300);

      return () => clearTimeout(debounceTimer);
    }
  }, [category, page, sort, order, search, user]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-7 px-4 md:px-8 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <header className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[#FF4C29] mb-1">
            Welcome back, {user?.firstname}
          </h1>
          <p className="text-lg text-gray-600">
            Discover delicious meals from our menu
          </p>
        </header>

        {/* Category Tabs */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 pb-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => {
                  setCategory(cat.id);
                  setPage(1);
                }}
                className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat.id
                    ? "bg-[#FF4C29] text-white shadow-md"
                    : "bg-white text-gray-700 hover:bg-gray-100 shadow-sm"
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search and Filter Controls */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="relative w-full md:w-96">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for dishes..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent"
                value={search}
                onChange={handleSearchChange}
              />
            </div>

            <div className="flex gap-3 w-full md:w-auto">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent"
              >
                <option value="dateAdded">Newest First</option>
                <option value="price">Price</option>
                <option value="name">Name</option>
                <option value="popularity">Popularity</option>
              </select>

              <select
                value={order}
                onChange={(e) => setOrder(e.target.value)}
                className="border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-[#FF4C29] focus:border-transparent"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
            </div>
          </div>
        </div>

        {/* Food Items Grid */}
        <section>
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF4C29]"></div>
            </div>
          ) : foodItems.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-sm">
              <h3 className="text-xl font-medium text-gray-700 mb-2">
                No items found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search or filter criteria
              </p>
            </div>
          ) : (
            <>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {foodItems.map((item) => (
                  <FoodItemCard key={item._id} item={item} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10">
                  <nav className="flex items-center gap-2">
                    <button
                      onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                      disabled={page === 1}
                      className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Previous page"
                    >
                      <FiChevronLeft size={20} />
                    </button>

                    <div className="flex gap-1">
                      {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                        let pageNum;
                        if (totalPages <= 5) {
                          pageNum = i + 1;
                        } else if (page <= 3) {
                          pageNum = i + 1;
                        } else if (page >= totalPages - 2) {
                          pageNum = totalPages - 4 + i;
                        } else {
                          pageNum = page - 2 + i;
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center ${
                              page === pageNum
                                ? "bg-[#FF4C29] text-white"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            {pageNum}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                      disabled={page === totalPages}
                      className="p-2 rounded-full border border-gray-300 text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Next page"
                    >
                      <FiChevronRight size={20} />
                    </button>
                  </nav>
                </div>
              )}
            </>
          )}
        </section>
      </div>
    </div>
  );
};

export default Dashboard;

