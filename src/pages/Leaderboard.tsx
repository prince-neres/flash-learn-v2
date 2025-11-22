import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Trophy, Medal } from 'lucide-react';
import { GamificationService } from '../services/GamificationService';
import { useAuth } from '../context/AuthContext';
import { clsx } from 'clsx';

const Leaderboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const loadLeaderboard = async () => {
    try {
      const data = await GamificationService.getLeaderboard();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white">Leaderboard</h1>
        <p className="text-gray-400">Top learners this week</p>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="divide-y divide-gray-700">
          {users.map((user, index) => (
            <div 
              key={user.id} 
              className={clsx(
                "flex items-center p-4 hover:bg-gray-700/50 transition-colors",
                user.id === currentUser?.uid && "bg-blue-500/10 border-l-4 border-blue-500"
              )}
            >
              <div className="w-12 text-center font-bold text-gray-500 text-xl">
                {index + 1}
              </div>
              <div className="flex-1 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold text-white">
                  {user.displayName?.[0] || '?'}
                </div>
                <div>
                  <div className="font-medium text-white">
                    {user.displayName || 'Anonymous'}
                    {index < 3 && <Medal className="inline-block w-4 h-4 ml-2 text-yellow-500" />}
                  </div>
                  <div className="text-sm text-gray-400">
                    {user.stats?.totalReviews || 0} reviews
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-blue-400">
                  {user.points || 0}
                </div>
                <div className="text-xs text-gray-500 uppercase">Points</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Leaderboard;
