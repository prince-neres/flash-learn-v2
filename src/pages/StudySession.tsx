import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CardService, type Card } from '../services/CardService';
import { DeckService, type Deck } from '../services/DeckService';
import Button from '../components/Button';
import { toast } from 'react-toastify';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

const StudySession: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [dueCards, setDueCards] = useState<Card[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [sessionComplete, setSessionComplete] = useState(false);

  useEffect(() => {
    if (deckId) {
      loadSession();
    }
  }, [deckId]);

  const loadSession = async () => {
    try {
      const [deckData, cardsData] = await Promise.all([
        DeckService.getDeck(deckId!),
        CardService.getDueCards(deckId!)
      ]);
      
      if (!deckData) {
        toast.error('Deck not found');
        navigate('/');
        return;
      }

      setDeck(deckData);
      setDueCards(cardsData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load study session');
    } finally {
      setLoading(false);
    }
  };

  const handleRate = async (quality: number) => {
    const currentCard = dueCards[currentIndex];
    try {
      await CardService.processReview(currentCard, quality);
      
      if (currentIndex < dueCards.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setIsFlipped(false);
      } else {
        setSessionComplete(true);
      }
    } catch (error) {
      console.error(error);
      toast.error('Failed to save progress');
    }
  };

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;
  if (!deck) return null;

  if (sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <CheckCircle className="w-20 h-20 text-green-500 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">{t('study.finished')}</h2>
        <p className="text-gray-400 mb-8">You have reviewed all due cards for this deck.</p>
        <Button onClick={() => navigate('/')}>
          {t('study.backToDashboard')}
        </Button>
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
        <CheckCircle className="w-20 h-20 text-blue-500 mb-6" />
        <h2 className="text-3xl font-bold text-white mb-4">All Caught Up!</h2>
        <p className="text-gray-400 mb-8">There are no cards due for review right now.</p>
        <Button onClick={() => navigate('/')}>
          {t('study.backToDashboard')}
        </Button>
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5 mr-2" />
          Quit
        </Button>
        <div className="text-gray-400">
          Card {currentIndex + 1} of {dueCards.length}
        </div>
      </div>

      <div 
        className="perspective-1000 min-h-[400px] cursor-pointer"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div className={clsx(
          "relative w-full h-full transition-all duration-500 transform-style-3d",
          isFlipped ? "rotate-y-180" : ""
        )}>
          {/* Front */}
          <div className={clsx(
            "absolute inset-0 w-full min-h-[400px] bg-gray-800 rounded-2xl border border-gray-700 p-8 flex items-center justify-center text-center backface-hidden",
            isFlipped && "opacity-0 pointer-events-none" // Hide front when flipped to avoid z-fighting or interaction issues if any
          )}>
            <div className="text-2xl font-medium text-white">
              {currentCard.front}
            </div>
            <div className="absolute bottom-4 text-gray-500 text-sm">
              Click to reveal answer
            </div>
          </div>

          {/* Back */}
          <div className={clsx(
            "absolute inset-0 w-full min-h-[400px] bg-gray-800 rounded-2xl border border-gray-700 p-8 flex flex-col items-center justify-center text-center backface-hidden rotate-y-180",
            !isFlipped && "opacity-0 pointer-events-none"
          )}>
            <div className="text-gray-400 text-sm mb-4 uppercase tracking-wider">Answer</div>
            <div className="text-2xl font-medium text-white mb-8">
              {currentCard.back}
            </div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="mt-8 grid grid-cols-4 gap-4">
          <Button 
            variant="danger" 
            onClick={() => handleRate(1)}
            className="flex flex-col py-4"
          >
            <span className="font-bold">{t('study.again')}</span>
            <span className="text-xs opacity-75">&lt; 1m</span>
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleRate(3)}
            className="flex flex-col py-4"
          >
            <span className="font-bold">{t('study.hard')}</span>
            <span className="text-xs opacity-75">2d</span>
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleRate(4)}
            className="flex flex-col py-4 bg-green-600 hover:bg-green-700"
          >
            <span className="font-bold">{t('study.good')}</span>
            <span className="text-xs opacity-75">4d</span>
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleRate(5)}
            className="flex flex-col py-4 bg-blue-500 hover:bg-blue-600"
          >
            <span className="font-bold">{t('study.easy')}</span>
            <span className="text-xs opacity-75">7d</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default StudySession;
