import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { User, Globe, Volume2 } from 'lucide-react';

const Profile: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { currentUser } = useAuth();
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadProfile();
    }
  }, [currentUser]);

  const loadProfile = async () => {
    try {
      const docRef = doc(db, 'users', currentUser!.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setUserData(docSnap.data());
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const changeLanguage = async (lang: string) => {
    i18n.changeLanguage(lang);
    try {
      const docRef = doc(db, 'users', currentUser!.uid);
      await updateDoc(docRef, {
        'settings.language': lang
      });
      toast.success('Language updated');
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gray-800 rounded-xl border border-gray-700 p-8 mb-8">
        <div className="flex items-center gap-6 mb-8">
          <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center text-4xl font-bold text-white">
            {currentUser?.displayName?.[0] || <User className="w-12 h-12" />}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-white">{currentUser?.displayName}</h1>
            <p className="text-gray-400">{currentUser?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-500">{userData?.points || 0}</div>
            <div className="text-sm text-gray-500">Points</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-500">{userData?.stats?.totalReviews || 0}</div>
            <div className="text-sm text-gray-500">Reviews</div>
          </div>
          <div className="bg-gray-900 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-yellow-500">{userData?.stats?.streak || 0}</div>
            <div className="text-sm text-gray-500">Day Streak</div>
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-xl font-semibold text-white border-b border-gray-700 pb-2">Settings</h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Globe className="w-5 h-5 text-gray-400" />
              <span>Language</span>
            </div>
            <div className="flex gap-2">
              <Button 
                size="sm" 
                variant={i18n.language === 'en' ? 'primary' : 'secondary'}
                onClick={() => changeLanguage('en')}
              >
                English
              </Button>
              <Button 
                size="sm" 
                variant={i18n.language === 'pt' ? 'primary' : 'secondary'}
                onClick={() => changeLanguage('pt')}
              >
                Português
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-gray-400" />
              <span>Sound Effects</span>
            </div>
            <div className="text-sm text-gray-500">
              Coming soon
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
