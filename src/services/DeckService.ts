import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  serverTimestamp,
  getDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Deck {
  id: string;
  ownerId: string;
  ownerName?: string;
  title: string;
  category: string;
  tags: string[];
  isPublic: boolean;
  cardCount: number;
  createdAt: any;
}

const COLLECTION_NAME = 'decks';

export const DeckService = {
  createDeck: async (ownerId: string, deck: Partial<Deck>) => {
    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      ...deck,
      ownerId,
      cardCount: 0,
      isPublic: deck.isPublic ?? false,
      createdAt: serverTimestamp(),
    });
    return docRef.id;
  },

  getUserDecks: async (ownerId: string) => {
    const q = query(
      collection(db, COLLECTION_NAME), 
      where('ownerId', '==', ownerId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deck));
  },

  getDeck: async (deckId: string) => {
    const docRef = doc(db, COLLECTION_NAME, deckId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Deck;
    }
    return null;
  },

  updateDeck: async (deckId: string, data: Partial<Deck>) => {
    const docRef = doc(db, COLLECTION_NAME, deckId);
    await updateDoc(docRef, data);
  },

  deleteDeck: async (deckId: string) => {
    const docRef = doc(db, COLLECTION_NAME, deckId);
    await deleteDoc(docRef);
  },

  getPublicDecks: async () => {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('isPublic', '==', true),
      orderBy('createdAt', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Deck));
  }
};
