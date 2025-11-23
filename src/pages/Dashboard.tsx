import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Plus, Book, Trash2, Edit2, PlayCircle } from "lucide-react";
import { DeckService, type Deck } from "../services/DeckService";
import { useAuth } from "../context/AuthContext";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "../components/ui/dialog";
import { LoadingState } from "../components/LoadingState";
import { useToast } from "../components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Switch } from "../components/ui/switch";

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [creating, setCreating] = useState(false);
  const [isDeckPublic, setIsDeckPublic] = useState(false);
  const [visibilityLoading, setVisibilityLoading] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      loadDecks();
    }
  }, [currentUser]);

  const loadDecks = async () => {
    try {
      const userDecks = await DeckService.getUserDecks(currentUser!.uid);
      setDecks(userDecks);
    } catch (error) {
      console.error(error);
      toast({ title: t('dashboard.loadError'), variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateDeck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeckTitle.trim()) return;

    setCreating(true);
    try {
      await DeckService.createDeck(currentUser!.uid, {
        title: newDeckTitle,
        category: 'General',
        tags: [],
        isPublic: isDeckPublic,
        ownerName: currentUser?.displayName || currentUser?.email || undefined,
      });
      toast({ title: t('dashboard.createSuccess') });
      setNewDeckTitle('');
      setIsDeckPublic(false);
      setIsModalOpen(false);
      loadDecks();
    } catch (error) {
      console.error(error);
      toast({ title: t('dashboard.createError'), variant: 'destructive' });
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!window.confirm(t('dashboard.confirmDelete'))) return;
    try {
      await DeckService.deleteDeck(deckId);
      setDecks((prev) => prev.filter((d) => d.id !== deckId));
      toast({ title: t('dashboard.deleteSuccess') });
    } catch (error) {
      console.error(error);
      toast({ title: t('dashboard.deleteError'), variant: 'destructive' });
    }
  };

  const handleToggleVisibility = async (deck: Deck) => {
    setVisibilityLoading(deck.id);
    try {
      await DeckService.updateDeck(deck.id, { isPublic: !deck.isPublic });
      setDecks((prev) => prev.map((item) => item.id === deck.id ? { ...item, isPublic: !deck.isPublic } : item));
      toast({ title: deck.isPublic ? t('visibility.toggleSuccessPrivate') : t('visibility.toggleSuccessPublic') });
    } catch (error) {
      console.error(error);
      toast({ title: t('visibility.toggleError'), variant: 'destructive' });
    } finally {
      setVisibilityLoading(null);
    }
  };

  if (loading) return <LoadingState message={t('common.loading')} />;

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <p className="text-sm uppercase tracking-widest text-muted-foreground">{t('common.back')}</p>
          <h1 className="text-3xl font-bold">{t('dashboard.title')}</h1>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="shadow-lg">
          <Plus className="w-5 h-5 mr-2" />
          {t('dashboard.createDeck')}
        </Button>
      </div>

      {decks.length === 0 ? (
        <Card className="glass-panel text-center py-12 border-dashed">
          <CardHeader>
            <Book className="w-12 h-12 mx-auto text-primary" />
            <CardTitle>{t('dashboard.noDecks')}</CardTitle>
            <CardDescription>{t('dashboard.emptyHelper')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => setIsModalOpen(true)}>
              {t('dashboard.createDeck')}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <Card 
              key={deck.id} 
              className="relative overflow-hidden border-border/50 bg-gradient-to-br from-background to-card/70 transition-all hover:-translate-y-1 hover:border-primary/50"
            >
              <CardHeader className="flex flex-row items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary shadow-inner p-4">
                  <Book className="h-5 w-5" aria-hidden />
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                    <span>{deck.isPublic ? t('visibility.public') : t('visibility.private')}</span>
                    <Switch
                      checked={deck.isPublic}
                      onCheckedChange={() => handleToggleVisibility(deck)}
                      disabled={visibilityLoading === deck.id}
                      aria-label={t('visibility.fieldLabel')}
                    />
                  </div>
                  <button 
                  type="button"
                  onClick={() => handleDeleteDeck(deck.id)}
                  className="rounded-full p-2 text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive"
                  aria-label={t('dashboard.deleteDeckLabel', { title: deck.title })}
                >
                  <Trash2 className="h-4 w-4" aria-hidden />
                </button>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <CardTitle className="text-2xl">{deck.title}</CardTitle>
                  <CardDescription>
                    {t('dashboard.cardCount', { count: deck.cardCount })}
                  </CardDescription>
                </div>
                <div className="flex gap-3">
                  <Link to={`/deck/${deck.id}`} className="flex-1">
                    <Button variant="outline" className="w-full">
                      <Edit2 className="w-4 h-4 mr-2" />
                      {t('common.edit')}
                    </Button>
                  </Link>
                  <Link to={`/study/${deck.id}`} className="flex-1">
                    <Button className="w-full">
                      <PlayCircle className="w-4 h-4 mr-2" />
                      {t('dashboard.study')}
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t('dashboard.createDeck')}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreateDeck} className="space-y-4">
            <Input
              value={newDeckTitle}
              onChange={(e) => setNewDeckTitle(e.target.value)}
              placeholder={t('dashboard.titlePlaceholder')}
              autoFocus
            />
            <div className="rounded-2xl border border-border/60 bg-muted/10 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{t('visibility.fieldLabel')}</p>
                  <p className="text-xs text-muted-foreground">{t('visibility.fieldHint')}</p>
                </div>
                <Switch checked={isDeckPublic} onCheckedChange={setIsDeckPublic} />
              </div>
              <p className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {isDeckPublic ? t('visibility.public') : t('visibility.private')}
              </p>
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>
                {t('common.cancel')}
              </Button>
              <Button type="submit" disabled={creating || !newDeckTitle.trim()}>
                {creating ? t('common.loading') : t('common.create')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Dashboard;
