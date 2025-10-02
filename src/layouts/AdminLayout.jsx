
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Main Content Area - responsive spacing */}
      <div className="flex-1 min-w-0">
        <div className="p-4 sm:p-6 lg:p-8 w-full max-w-[1920px] mx-auto">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;