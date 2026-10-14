import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

export interface UseUserLineupsReturn {
  favorites: string[];
  learned: string[];
  isLoading: boolean;
  isSyncing: boolean;
  toggleFavorite: (lineupId: string, e?: React.MouseEvent) => Promise<void>;
  toggleLearned: (lineupId: string, e?: React.MouseEvent) => Promise<void>;
}

export const useUserLineups = (): UseUserLineupsReturn => {
  const { user, isConfigured } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [learned, setLearned] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Load initial data (from Supabase if logged in, otherwise localStorage)
  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setIsLoading(true);

      // If user is authenticated and Supabase is configured: fetch from DB
      if (user && isConfigured) {
        try {
          const { data, error } = await supabase
            .from('user_lineups')
            .select('lineup_id, is_favorite, is_learned')
            .eq('user_id', user.id);

          if (!error && data && isMounted) {
            const favs = data.filter((item) => item.is_favorite).map((item) => item.lineup_id);
            const lrns = data.filter((item) => item.is_learned).map((item) => item.lineup_id);

            setFavorites(favs);
            setLearned(lrns);

            // Also cache locally
            localStorage.setItem(`cs2_favs_${user.id}`, JSON.stringify(favs));
            localStorage.setItem(`cs2_lrn_${user.id}`, JSON.stringify(lrns));
            setIsLoading(false);
            return;
          }
        } catch (err) {
          console.error('Error loading Supabase user_lineups:', err);
        }
      }

      // Fallback: localStorage (Guest or Demo mode)
      if (isMounted) {
        const cacheKey = user ? `cs2_favs_${user.id}` : 'cs2_favorites_guest';
        const lrnKey = user ? `cs2_lrn_${user.id}` : 'cs2_learned_guest';

        const savedFavs = localStorage.getItem(cacheKey);
        const savedLrns = localStorage.getItem(lrnKey);

        setFavorites(savedFavs ? JSON.parse(savedFavs) : ['mirage-smoke-ct', 'mirage-smoke-window-t']);
        setLearned(savedLrns ? JSON.parse(savedLrns) : ['mirage-smoke-stairs']);
        setIsLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [user, isConfigured]);

  // Toggle Favorite
  const toggleFavorite = useCallback(
    async (lineupId: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();

      const willBeFavorite = !favorites.includes(lineupId);
      const isCurrentlyLearned = learned.includes(lineupId);

      // 1. Optimistic UI update
      const updatedFavs = willBeFavorite
        ? [...favorites, lineupId]
        : favorites.filter((id) => id !== lineupId);

      setFavorites(updatedFavs);

      // LocalStorage Cache
      const cacheKey = user ? `cs2_favs_${user.id}` : 'cs2_favorites_guest';
      localStorage.setItem(cacheKey, JSON.stringify(updatedFavs));

      // 2. Supabase DB Sync (if authenticated & configured)
      if (user && isConfigured) {
        setIsSyncing(true);
        try {
          const { error } = await supabase.from('user_lineups').upsert(
            {
              user_id: user.id,
              lineup_id: lineupId,
              is_favorite: willBeFavorite,
              is_learned: isCurrentlyLearned,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,lineup_id' }
          );

          if (error) {
            console.error('Supabase upsert error (favorite):', error);
          }
        } catch (err) {
          console.error('Failed to sync favorite to Supabase:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    },
    [favorites, learned, user, isConfigured]
  );

  // Toggle Learned
  const toggleLearned = useCallback(
    async (lineupId: string, e?: React.MouseEvent) => {
      if (e) e.stopPropagation();

      const willBeLearned = !learned.includes(lineupId);
      const isCurrentlyFavorite = favorites.includes(lineupId);

      // 1. Optimistic UI update
      const updatedLearned = willBeLearned
        ? [...learned, lineupId]
        : learned.filter((id) => id !== lineupId);

      setLearned(updatedLearned);

      // LocalStorage Cache
      const cacheKey = user ? `cs2_lrn_${user.id}` : 'cs2_learned_guest';
      localStorage.setItem(cacheKey, JSON.stringify(updatedLearned));

      // 2. Supabase DB Sync (if authenticated & configured)
      if (user && isConfigured) {
        setIsSyncing(true);
        try {
          const { error } = await supabase.from('user_lineups').upsert(
            {
              user_id: user.id,
              lineup_id: lineupId,
              is_favorite: isCurrentlyFavorite,
              is_learned: willBeLearned,
              updated_at: new Date().toISOString(),
            },
            { onConflict: 'user_id,lineup_id' }
          );

          if (error) {
            console.error('Supabase upsert error (learned):', error);
          }
        } catch (err) {
          console.error('Failed to sync learned to Supabase:', err);
        } finally {
          setIsSyncing(false);
        }
      }
    },
    [favorites, learned, user, isConfigured]
  );

  return {
    favorites,
    learned,
    isLoading,
    isSyncing,
    toggleFavorite,
    toggleLearned,
  };
};
