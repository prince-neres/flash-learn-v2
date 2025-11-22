import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CardService, type Card } from "../services/CardService";
import { DeckService, type Deck } from "../services/DeckService";
import { Button } from "../components/ui/button";
import { ArrowLeft, CheckCircle, Trophy } from "lucide-react";
import { clsx } from "clsx";
import { LoadingState } from "../components/LoadingState";
import { useToast } from "../components/ui/use-toast";

const StudySession: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { toast } = useToast();

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
        toast({ title: t('study.deckNotFound'), variant: 'destructive' });
        navigate('/');
        return;
      }

      setDeck(deckData);
      setDueCards(cardsData);
    } catch (error) {
      console.error(error);
      toast({ title: t('study.loadError'), variant: 'destructive' });
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
      toast({ title: t('study.saveError'), variant: 'destructive' });
    }
  };

  if (loading) return <LoadingState message={t('common.loading')} />;
  if (!deck) return null;

  if (sessionComplete) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="rounded-full bg-green-500/10 p-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{t('study.finished')}</h2>
          <p className="text-muted-foreground">{t('study.completeMessage')}</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => navigate('/leaderboard')}>
            <Trophy className="mr-2 h-4 w-4" />
            {t('study.viewLeaderboard')}
          </Button>
          <Button onClick={() => navigate('/')}>
            {t('study.backToDashboard')}
          </Button>
        </div>
      </div>
    );
  }

  if (dueCards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5">
        <div className="rounded-full bg-blue-500/10 p-6">
          <CheckCircle className="w-16 h-16 text-blue-500" />
        </div>
        <div>
          <h2 className="text-3xl font-bold">{t('study.noCardsTitle')}</h2>
          <p className="text-muted-foreground">{t('study.noCardsBody')}</p>
        </div>
        <Button onClick={() => navigate('/')}>
          {t('study.backToDashboard')}
        </Button>
      </div>
    );
  }

  const currentCard = dueCards[currentIndex];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="ghost" onClick={() => navigate('/')} className="w-fit">
          <ArrowLeft className="w-5 h-5 mr-2" />
          {t('common.back')}
        </Button>
        <div className="text-sm font-medium text-muted-foreground">
          {t('study.progressCounter', { current: currentIndex + 1, total: dueCards.length })}
        </div>
      </div>

      <div 
        className="relative cursor-pointer rounded-3xl border border-border/60 bg-card/80 p-1 shadow-2xl"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div className="rounded-[26px] border border-white/5 bg-gradient-to-br from-primary/10 via-transparent to-transparent p-8">
          <div className="perspective-1000 min-h-[360px]">
            <div className={clsx(
              "relative w-full min-h-[320px] transition-all duration-500 transform-style-3d",
              isFlipped ? "rotate-y-180" : ""
            )}>
              <div className={clsx(
                "absolute inset-0 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-border/60 bg-card px-6 text-center text-lg font-semibold leading-relaxed shadow-xl backface-hidden",
                isFlipped && "opacity-0"
              )}>
                <p>{currentCard.front}</p>
                <span className="mt-8 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {t('study.showAnswer')}
                </span>
              </div>
              <div className={clsx(
                "absolute inset-0 flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-border/60 bg-card px-6 text-center text-lg font-semibold leading-relaxed shadow-xl backface-hidden rotate-y-180",
                !isFlipped && "opacity-0"
              )}>
                <span className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {t('study.answerLabel')}
                </span>
                <p className="mt-6 text-2xl font-semibold text-primary">
                  {currentCard.back}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isFlipped && (
        <div className="grid gap-3 md:grid-cols-4">
          <Button 
            variant="destructive" 
            onClick={() => handleRate(1)}
            className="flex flex-col gap-1 py-4"
          >
            <span className="font-bold">{t('study.again')}</span>
            <span className="text-xs opacity-75">&lt; 1m</span>
          </Button>
          <Button 
            variant="secondary" 
            onClick={() => handleRate(3)}
            className="flex flex-col gap-1 py-4"
          >
            <span className="font-bold">{t('study.hard')}</span>
            <span className="text-xs opacity-75">2d</span>
          </Button>
          <Button 
            onClick={() => handleRate(4)}
            className="flex flex-col gap-1 py-4 bg-green-500 text-white hover:bg-green-500/90"
          >
            <span className="font-bold">{t('study.good')}</span>
            <span className="text-xs opacity-75">4d</span>
          </Button>
          <Button 
            onClick={() => handleRate(5)}
            className="flex flex-col gap-1 py-4 bg-blue-500 text-white hover:bg-blue-500/90"
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
