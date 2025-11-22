import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Plus, Trash2, Search } from 'lucide-react';
import { DeckService, type Deck } from '../services/DeckService';
import { CardService, type Card } from '../services/CardService';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import Modal from '../components/Modal';
import { toast } from 'react-toastify';

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
        toast.error('Deck not found');
        navigate('/');
        return;
      }
      
      setDeck(deckData);
      setCards(cardsData);
    } catch (error) {
      console.error(error);
      toast.error('Failed to load deck data');
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
      toast.success('Card created!');
      setFront('');
      setBack('');
      // Keep modal open for rapid entry
      loadData(); // Reload to show new card
    } catch (error) {
      console.error(error);
      toast.error('Failed to create card');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    if (!window.confirm('Delete this card?')) return;
    try {
      await CardService.deleteCard(deckId!, cardId);
      setCards(cards.filter(c => c.id !== cardId));
      toast.success('Card deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete card');
    }
  };

  if (loading) return <div className="p-8 text-center">{t('common.loading')}</div>;
  if (!deck) return null;

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" onClick={() => navigate('/')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-white">{deck.title}</h1>
          <p className="text-gray-400">{cards.length} cards</p>
        </div>
        <div className="ml-auto">
          <Button onClick={() => setIsModalOpen(true)}>
            <Plus className="w-5 h-5 mr-2" />
            Add Card
          </Button>
        </div>
      </div>

      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
        <div className="p-4 border-b border-gray-700 bg-gray-800/50">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search cards..." 
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>
        
        <div className="divide-y divide-gray-700">
          {cards.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No cards yet. Add one to get started!
            </div>
          ) : (
            cards.map((card) => (
              <div key={card.id} className="p-4 hover:bg-gray-700/50 transition-colors flex items-center justify-between group">
                <div className="grid grid-cols-2 gap-8 flex-1">
                  <div className="text-white">{card.front}</div>
                  <div className="text-gray-400">{card.back}</div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-4">
                  <button 
                    onClick={() => handleDeleteCard(card.id)}
                    className="p-2 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New Card"
      >
        <form onSubmit={handleCreateCard} className="space-y-4">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Front (Question)</label>
            <textarea
              className="w-full h-24 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
              value={front}
              onChange={(e) => setFront(e.target.value)}
              placeholder="Enter the question..."
              autoFocus
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-300">Back (Answer)</label>
            <textarea
              className="w-full h-24 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white focus:outline-none focus:border-blue-500 resize-none"
              value={back}
              onChange={(e) => setBack(e.target.value)}
              placeholder="Enter the answer..."
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => setIsModalOpen(false)}
            >
              Done
            </Button>
            <Button 
              type="submit" 
              disabled={saving || !front.trim() || !back.trim()}
            >
              {saving ? 'Saving...' : 'Add Card'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default DeckDetail;
