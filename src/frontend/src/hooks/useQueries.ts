import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Note } from '../backend';

export function useNotes() {
  const { actor, isFetching } = useActor();

  return useQuery<Note[]>({
    queryKey: ['notes'],
    queryFn: async () => {
      if (!actor) {
        console.log('useNotes: Actor not available');
        return [];
      }
      console.log('useNotes: Fetching notes from backend');
      const notes = await actor.getNotes();
      console.log('useNotes: Received notes:', notes);
      return notes;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: string) => {
      if (!actor) {
        console.error('useCreateNote: Actor not initialized');
        throw new Error('Please log in to create notes');
      }
      console.log('useCreateNote: Creating note with content:', content);
      const note = await actor.createNote(content);
      console.log('useCreateNote: Note created:', note);
      return note;
    },
    onSuccess: () => {
      console.log('useCreateNote: Invalidating notes query');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('useCreateNote: Error creating note:', error);
    },
  });
}

export function useEditNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: bigint; content: string }) => {
      if (!actor) {
        console.error('useEditNote: Actor not initialized');
        throw new Error('Please log in to edit notes');
      }
      console.log('useEditNote: Editing note', id, 'with content:', content);
      const note = await actor.editNote(id, content);
      console.log('useEditNote: Note edited:', note);
      return note;
    },
    onSuccess: () => {
      console.log('useEditNote: Invalidating notes query');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('useEditNote: Error editing note:', error);
    },
  });
}

export function useDeleteNote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: bigint) => {
      if (!actor) {
        console.error('useDeleteNote: Actor not initialized');
        throw new Error('Please log in to delete notes');
      }
      console.log('useDeleteNote: Deleting note', id);
      await actor.deleteNote(id);
      console.log('useDeleteNote: Note deleted');
    },
    onSuccess: () => {
      console.log('useDeleteNote: Invalidating notes query');
      queryClient.invalidateQueries({ queryKey: ['notes'] });
    },
    onError: (error) => {
      console.error('useDeleteNote: Error deleting note:', error);
    },
  });
}

export function useSetBreakReminder() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async (intervalMinutes: number) => {
      if (!actor) {
        console.error('useSetBreakReminder: Actor not initialized');
        throw new Error('Please log in to set break reminders');
      }
      // Convert minutes to nanoseconds
      const intervalNanoseconds = BigInt(intervalMinutes * 60 * 1_000_000_000);
      console.log('useSetBreakReminder: Setting break reminder to', intervalMinutes, 'minutes (', intervalNanoseconds, 'nanoseconds)');
      await actor.setBreakReminder(intervalNanoseconds);
      console.log('useSetBreakReminder: Break reminder set successfully');
    },
    onError: (error) => {
      console.error('useSetBreakReminder: Error setting break reminder:', error);
    },
  });
}

export function useProcessNotifications() {
  const { actor } = useActor();

  return useMutation({
    mutationFn: async () => {
      if (!actor) {
        console.error('useProcessNotifications: Actor not initialized');
        throw new Error('Actor not initialized');
      }
      console.log('useProcessNotifications: Processing notifications');
      const result = await actor.processNotifications();
      console.log('useProcessNotifications: Notifications processed at', result);
      return result;
    },
    onError: (error) => {
      console.error('useProcessNotifications: Error processing notifications:', error);
    },
  });
}

export function useGetNextNotification() {
  const { actor, isFetching } = useActor();

  return useQuery<string | null>({
    queryKey: ['notification'],
    queryFn: async () => {
      if (!actor) {
        console.log('useGetNextNotification: Actor not available');
        return null;
      }
      console.log('useGetNextNotification: Fetching next notification');
      const notification = await actor.getNextNotification();
      console.log('useGetNextNotification: Received notification:', notification);
      return notification;
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 60000, // Check every minute
  });
}
