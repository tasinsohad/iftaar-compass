import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Mosque, Comment } from '@/types/mosque';

export function useMosques() {
  return useQuery({
    queryKey: ['mosques'],
    queryFn: async (): Promise<Mosque[]> => {
      const { data, error } = await supabase
        .from('mosques')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
  });
}

export function useComments(mosqueId: string | null) {
  return useQuery({
    queryKey: ['comments', mosqueId],
    queryFn: async (): Promise<Comment[]> => {
      if (!mosqueId) return [];
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .eq('mosque_id', mosqueId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    },
    enabled: !!mosqueId,
  });
}

export function useAddMosque() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (mosque: Omit<Mosque, 'id' | 'confirmed_count' | 'disputed_count' | 'created_at'>) => {
      const { data, error } = await supabase.from('mosques').insert(mosque).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['mosques'] }),
  });
}

export function useAddComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (comment: { mosque_id: string; text: string | null; is_confirmed: boolean }) => {
      const { error: commentError } = await supabase.from('comments').insert(comment);
      if (commentError) throw commentError;

      // Update counts on the mosque
      const countField = comment.is_confirmed ? 'confirmed_count' : 'disputed_count';
      const { data: mosque } = await supabase.from('mosques').select(countField).eq('id', comment.mosque_id).single();
      if (mosque) {
        await supabase
          .from('mosques')
          .update({ [countField]: (mosque[countField] as number) + 1 })
          .eq('id', comment.mosque_id);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['comments', variables.mosque_id] });
      queryClient.invalidateQueries({ queryKey: ['mosques'] });
    },
  });
}
