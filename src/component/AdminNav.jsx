import { NavLink } from 'react-router-dom';

const AdminNav = () => {
  return (
    <nav className="fixed h-full w-64 bg-gray-800 text-white p-4">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul className="space-y-2">
        <li>
          <NavLink 
            to="/admin/dashboard" 
            className={({ isActive }) => `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/foods" 
            className={({ isActive }) => `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            Food Management
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/admin/orders" 
            className={({ isActive }) => `block p-2 rounded ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
          >
            Order Management
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default AdminNav;