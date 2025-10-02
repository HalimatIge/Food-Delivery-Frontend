import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';


const AdminDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="  sm:p-4 lg:p-8 min-h-screen bg-gray-50">
      {/* Header Section */}
     <div className='p-6'>
       <div className="">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
          Admin Dashboard
        </h1>
        <p className="text-base sm:text-lg lg:text-xl text-gray-600">
          Welcome back, {user?.firstname || 'Admin'}!
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
        {/* Food Management Card */}
        <Link 
          to="/admin/foods" 
          className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-blue-500 hover:scale-105 active:scale-95"
        >
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-blue-100 rounded-full mr-3 sm:mr-4 shadow-inner">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">Food Management</h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 leading-relaxed">
            Manage menu items, prices, and categories
          </p>
          <div className="text-blue-600 font-medium text-sm sm:text-base lg:text-lg flex items-center group">
            Go to Food Management 
            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
          </div>
        </Link>

        {/* Users Management Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-green-100 rounded-full mr-3 sm:mr-4 shadow-inner">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">User Management</h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 leading-relaxed">
            View and manage user accounts and permissions
          </p>
          <div className="text-gray-400 font-medium text-sm sm:text-base lg:text-lg">Coming Soon</div>
        </div>

        {/* Analytics Card */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-purple-100 rounded-full mr-3 sm:mr-4 shadow-inner">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">Analytics</h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 leading-relaxed">
            View sales reports and customer insights
          </p>
          <div className="text-gray-400 font-medium text-sm sm:text-base lg:text-lg">Coming Soon</div>
        </div>

        {/* Additional Card for Larger Screens */}
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 hover:scale-105 xl:block hidden">
          <div className="flex items-center mb-3 sm:mb-4">
            <div className="p-2 sm:p-3 bg-red-100 rounded-full mr-3 sm:mr-4 shadow-inner">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 lg:w-7 lg:h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">Inventory</h2>
          </div>
          <p className="text-sm sm:text-base lg:text-lg text-gray-600 mb-3 sm:mb-4 leading-relaxed">
            Track stock levels and manage supplies
          </p>
          <div className="text-gray-400 font-medium text-sm sm:text-base lg:text-lg">Coming Soon</div>
        </div>
      </div>

      {/* Quick Stats Section */}
      <div className="bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 lg:mb-8 text-gray-800">
          Quick Stats
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          <div className="bg-blue-50 p-3 sm:p-4 lg:p-5 rounded-lg border-l-4 border-blue-500 hover:shadow-md transition-shadow">
            <p className="text-xs sm:text-sm lg:text-base text-blue-600 mb-1 font-medium">Total Menu Items</p>
            <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-blue-700">24</p>
            <p className="text-xs text-blue-500 mt-1">+2 this week</p>
          </div>
          <div className="bg-green-50 p-3 sm:p-4 lg:p-5 rounded-lg border-l-4 border-green-500 hover:shadow-md transition-shadow">
            <p className="text-xs sm:text-sm lg:text-base text-green-600 mb-1 font-medium">Available Items</p>
            <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-green-700">18</p>
            <p className="text-xs text-green-500 mt-1">75% available</p>
          </div>
          <div className="bg-yellow-50 p-3 sm:p-4 lg:p-5 rounded-lg border-l-4 border-yellow-500 hover:shadow-md transition-shadow">
            <p className="text-xs sm:text-sm lg:text-base text-yellow-600 mb-1 font-medium">Categories</p>
            <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-yellow-700">5</p>
            <p className="text-xs text-yellow-500 mt-1">3 active</p>
          </div>
          <div className="bg-purple-50 p-3 sm:p-4 lg:p-5 rounded-lg border-l-4 border-purple-500 hover:shadow-md transition-shadow">
            <p className="text-xs sm:text-sm lg:text-base text-purple-600 mb-1 font-medium">Most Popular</p>
            <p className="text-lg sm:text-2xl lg:text-3xl font-bold text-purple-700 truncate">Cheeseburger</p>
            <p className="text-xs text-purple-500 mt-1">48 orders today</p>
          </div>
        </div>
      </div>

      {/* Recent Activity Section for Larger Screens */}
      <div className="mt-6 sm:mt-8 lg:mt-10 bg-white p-4 sm:p-6 lg:p-8 rounded-xl shadow-md xl:block hidden">
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-semibold mb-4 sm:mb-6 text-gray-800">
          Recent Activity
        </h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">New order received #ORD-1234</span>
            <span className="text-xs text-gray-400">2 minutes ago</span>
          </div>
          <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
            <span className="text-sm text-gray-600">Menu item updated: Cheeseburger</span>
            <span className="text-xs text-gray-400">1 hour ago</span>
          </div>
        </div>
      </div>
     </div>
    </div>
  );
};

export default AdminDashboard;