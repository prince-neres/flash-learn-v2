import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Plus, Trash2, Search } from "lucide-react";
import { DeckService, type Deck } from "../services/DeckService";
import { CardService, type Card } from "../services/CardService";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { Textarea } from "../components/ui/textarea";
import { LoadingState } from "../components/LoadingState";
import { useToast } from "../components/ui/use-toast";
import { Input } from "../components/ui/input";

const DeckDetail: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // New Card State
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [saving, setSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser && deckId) {
      loadData();
    }
  }, [currentUser, deckId]);

  const loadData = async () => {
    try {
      const [deckData, cardsData] = await Promise.all([
        DeckService.getDeck(deckId!),
        CardService.getDeckCards(deckId!)
      ]);
      
      if (!deckData) {
        toast({ title: t('deckDetail.notFound'), variant: 'destructive' });
        navigate('/');
        return;
      }
      
      setDeck(deckData);
      setCards(cardsData);
    } catch (error) {
      console.error(error);
      toast({ title: t('deckDetail.loadError'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!front.trim() || !back.trim()) return;

    setSaving(true);
    try {
      await CardService.createCard(currentUser!.uid, deckId!, {
        front,
        back,
      });
      toast({ title: t('deckDetail.createSuccess') });
      setFront('');
      setBack('');
      // Keep modal open for rapid entry
      loadData(); // Reload to show new card
    } catch (error) {
      console.error(error);
      toast({ title: t('deckDetail.createError'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!window.confirm(t('deckDetail.confirmDelete'))) return;
    try {
      await CardService.deleteCard(deckId!, cardId);
      setCards((prev) => prev.filter((c) => c.id !== cardId));
      toast({ title: t('deckDetail.deleteSuccess') });
    } catch (error) {
      console.error(error);
      toast({ title: t('deckDetail.deleteError'), variant: 'destructive' });
    }
  };
  if (loading) return <LoadingState message={t('common.loading')} />;

  const filteredCards = cards.filter((card) =>
    [card.front, card.back].some((text) => text.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  if (!deck) return null;

  return (
    <div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/')}
            className="rounded-full border border-border/60 text-muted-foreground">
            <ArrowLeft className="w-4 h-4" />
            <span className="sr-only">{t('common.back')}</span>
          </Button>
          <div>
            <h1 className="text-3xl font-bold">{deck.title}</h1>
            <p className="text-muted-foreground">
              {t('deckDetail.cardCount', { count: cards.length })}
            </p>
          </div>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="self-start md:self-auto">
          <Plus className="w-5 h-5 mr-2" />
          {t('deckDetail.addCard')}
        </Button>
      </div>

      <div className="rounded-3xl border border-border/60 bg-card/80 shadow-2xl">
        <div className="border-b border-border/70 p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('deckDetail.searchPlaceholder')}
              className="pl-10"
            />
          </div>
        </div>

        <div className="divide-y divide-border/60">
          {filteredCards.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              {t('deckDetail.emptyState')}
            </div>
          ) : (
            filteredCards.map((card) => (
              <div key={card.id} className="flex items-center justify-between gap-4 p-5 transition hover:bg-muted/30">
                <div className="grid flex-1 gap-4 md:grid-cols-2">
                  <p className="text-base font-medium">{card.front}</p>
                  <p className="text-muted-foreground">{card.back}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={() => handleDeleteCard(card.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            ))
          )}
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('deckDetail.addCard')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateCard} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('deckDetail.frontLabel')}</label>
              <Textarea
                value={front}
                onChange={(e) => setFront(e.target.value)}
                placeholder={t('deckDetail.frontPlaceholder')}
                autoFocus
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">{t('deckDetail.backLabel')}</label>
              <Textarea
                value={back}
                onChange={(e) => setBack(e.target.value)}
                placeholder={t('deckDetail.backPlaceholder')}
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={saving || !front.trim() || !back.trim()}>
                {saving ? t('common.loading') : t('deckDetail.addCard')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DeckDetail;
