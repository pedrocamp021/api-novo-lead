import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { LogOut, Settings, ClipboardList } from 'lucide-react';

const Navbar: React.FC = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="flex-shrink-0 flex items-center">
              <ClipboardList className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold text-gray-800">LeadCRM</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link
              to="/settings"
              className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <Settings className="h-5 w-5" />
            </Link>
            
            <button
              onClick={handleLogout}
              className="flex items-center text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors duration-200"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;