import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { auth } from '../lib/firebase';
import { LogOut, User as UserIcon } from 'lucide-react';

const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <nav className="bg-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <span className="text-xl font-bold text-blue-500">FlashLearn</span>
              </Link>
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  {t('dashboard.title')}
                </Link>
                <Link to="/leaderboard" className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700">
                  Leaderboard
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {currentUser ? (
                <>
                  <Link to="/profile" className="p-2 rounded-full hover:bg-gray-700">
                    <UserIcon className="w-5 h-5" />
                  </Link>
                  <button onClick={handleLogout} className="p-2 rounded-full hover:bg-gray-700">
                    <LogOut className="w-5 h-5" />
                  </button>
                </>
              ) : (
                <Link to="/login" className="text-sm font-medium hover:text-blue-400">
                  {t('auth.login')}
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
