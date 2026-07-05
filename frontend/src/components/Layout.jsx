import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, UploadCloud, History as HistoryIcon, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Chatbot from './Chatbot';

const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Analyze Resume', path: '/upload', icon: <UploadCloud size={20} /> },
    { name: 'History', path: '/history', icon: <HistoryIcon size={20} /> },
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar toggle */}
      <div className="md:hidden fixed top-0 left-0 w-full bg-white shadow-sm z-20 flex justify-between items-center p-4">
        <span className="text-xl font-bold text-blue-600">Smart Resume</span>
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-600">
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-10 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col`}>
        <div className="flex items-center justify-center h-20 border-b border-gray-100 hidden md:flex">
          <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">Smart Resume</span>
        </div>
        
        <div className="px-6 py-4 border-b border-gray-100 hidden md:block">
          <p className="text-sm text-gray-500">Welcome back,</p>
          <p className="font-semibold text-gray-800 truncate">{user?.name}</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto mt-16 md:mt-0">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-blue-600'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="mr-3"><LogOut size={20} /></span>
            Log Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-0 md:ml-64 p-6 pt-24 md:pt-6 overflow-y-auto w-full max-w-7xl mx-auto">
        {children}
      </main>
      <Chatbot />
    </div>
  );
};

export default Layout;
