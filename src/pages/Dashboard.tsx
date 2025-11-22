import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Plus, Book, Trash2, Edit2, PlayCircle } from 'lucide-react';
import { DeckService, type Deck } from '../services/DeckService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Input from '../components/Input';
import { toast } from 'react-toastify';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();
  const { currentUser } = useAuth();
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDeckTitle, setNewDeckTitle] = useState('');
  const [creating, setCreating] = useState(false);

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
      toast.error('Failed to load decks');
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
        isPublic: false,
      });
      toast.success('Deck created!');
      setNewDeckTitle('');
      setIsModalOpen(false);
      loadDecks();
    } catch (error) {
      console.error(error);
      toast.error('Failed to create deck');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteDeck = async (deckId: string) => {
    if (!window.confirm('Are you sure you want to delete this deck?')) return;
    try {
      await DeckService.deleteDeck(deckId);
      setDecks(decks.filter(d => d.id !== deckId));
      toast.success('Deck deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete deck');
    }
  };

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">{t('dashboard.title')}</h1>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="w-5 h-5 mr-2" />
          {t('dashboard.createDeck')}
        </Button>
      </div>

      {decks.length === 0 ? (
        <div className="text-center py-12 bg-gray-800 rounded-xl border border-gray-700 border-dashed">
          <Book className="w-12 h-12 mx-auto text-gray-500 mb-4" />
          <p className="text-gray-400 text-lg">{t('dashboard.noDecks')}</p>
          <Button 
            variant="ghost" 
            className="mt-4"
            onClick={() => setIsModalOpen(true)}
          >
            {t('dashboard.createDeck')}
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <div 
              key={deck.id} 
              className="bg-gray-800 rounded-xl border border-gray-700 p-6 hover:border-blue-500/50 transition-colors group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Book className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => handleDeleteDeck(deck.id)}
                    className="p-2 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              
              <h3 className="text-xl font-semibold text-white mb-2">{deck.title}</h3>
              <p className="text-gray-400 text-sm mb-6">
                {deck.cardCount} cards
              </p>

              <div className="flex gap-3">
                <Link 
                  to={`/deck/${deck.id}`} 
                  className="flex-1"
                >
                  <Button variant="secondary" className="w-full">
                    <Edit2 className="w-4 h-4 mr-2" />
                    {t('common.edit')}
                  </Button>
                </Link>
                <Link 
                  to={`/study/${deck.id}`}
                  className="flex-1"
                >
                  <Button className="w-full">
                    <PlayCircle className="w-4 h-4 mr-2" />
                    {t('dashboard.study')}
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={t('dashboard.createDeck')}
      >
        <form onSubmit={handleCreateDeck} className="space-y-4">
          <Input
            label="Deck Title"
            value={newDeckTitle}
            onChange={(e) => setNewDeckTitle(e.target.value)}
            placeholder="e.g., English Vocabulary"
            autoFocus
          />
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
            >
              {t('common.cancel')}
            </Button>
            <Button 
              type="submit" 
              disabled={creating || !newDeckTitle.trim()}
            >
              {creating ? t('common.loading') : t('common.create')}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Dashboard;
