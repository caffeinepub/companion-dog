import { useState } from 'react';
import { X, Plus, Edit2, Trash2, Save, AlertCircle } from 'lucide-react';
import { useNotes, useCreateNote, useEditNote, useDeleteNote } from '../hooks/useQueries';

interface NotesPanelProps {
  onClose: () => void;
}

export default function NotesPanel({ onClose }: NotesPanelProps) {
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingId, setEditingId] = useState<bigint | null>(null);
  const [editContent, setEditContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const { data: notes = [], isLoading, error: queryError } = useNotes();
  const createNote = useCreateNote();
  const editNote = useEditNote();
  const deleteNote = useDeleteNote();

  const handleCreate = async () => {
    if (!newNoteContent.trim()) return;
    
    try {
      setError(null);
      await createNote.mutateAsync(newNoteContent);
      setNewNoteContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create note');
      console.error('Create note error:', err);
    }
  };

  const handleEdit = async (id: bigint) => {
    if (!editContent.trim()) return;
    
    try {
      setError(null);
      await editNote.mutateAsync({ id, content: editContent });
      setEditingId(null);
      setEditContent('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to edit note');
      console.error('Edit note error:', err);
    }
  };

  const handleDelete = async (id: bigint) => {
    if (!confirm('Delete this note?')) return;
    
    try {
      setError(null);
      await deleteNote.mutateAsync(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete note');
      console.error('Delete note error:', err);
    }
  };

  const startEdit = (id: bigint, content: string) => {
    setEditingId(id);
    setEditContent(content);
    setError(null);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-2 border-amber-200 dark:border-amber-700 overflow-hidden">
      <div className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50 p-4 flex items-center justify-between">
        <h3 className="font-bold text-amber-900 dark:text-amber-100">Quick Notes</h3>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
        {/* Error display */}
        {(error || queryError) && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">
              {error || (queryError instanceof Error ? queryError.message : 'Failed to load notes')}
            </p>
          </div>
        )}

        {/* New note input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleCreate()}
            placeholder="Add a note..."
            className="flex-1 px-3 py-2 rounded-xl border-2 border-amber-200 dark:border-amber-700 bg-white dark:bg-slate-900 text-amber-900 dark:text-amber-100 placeholder-amber-400 dark:placeholder-amber-600 focus:outline-none focus:border-amber-400 dark:focus:border-amber-500"
          />
          <button
            onClick={handleCreate}
            disabled={createNote.isPending || !newNoteContent.trim()}
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createNote.isPending ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <Plus className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Notes list */}
        {isLoading ? (
          <div className="text-center text-amber-600 dark:text-amber-400 py-4">
            <div className="inline-block w-6 h-6 border-2 border-amber-600 border-t-transparent rounded-full animate-spin" />
            <p className="mt-2">Loading notes...</p>
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center text-amber-600 dark:text-amber-400 py-4">
            <p>No notes yet</p>
            <p className="text-xs mt-1">Add your first note above!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {notes.map((note) => (
              <div
                key={note.id.toString()}
                className="bg-amber-50 dark:bg-slate-900 rounded-xl p-3 border border-amber-200 dark:border-amber-800"
              >
                {editingId === note.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleEdit(note.id)}
                      className="flex-1 px-2 py-1 rounded-lg border border-amber-300 dark:border-amber-600 bg-white dark:bg-slate-800 text-amber-900 dark:text-amber-100 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleEdit(note.id)}
                      disabled={editNote.isPending || !editContent.trim()}
                      className="w-8 h-8 rounded-lg bg-green-500 hover:bg-green-600 text-white flex items-center justify-center disabled:opacity-50"
                    >
                      {editNote.isPending ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(null);
                        setEditContent('');
                      }}
                      className="w-8 h-8 rounded-lg bg-gray-500 hover:bg-gray-600 text-white flex items-center justify-center"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm text-amber-900 dark:text-amber-100 flex-1">{note.content}</p>
                    <div className="flex gap-1">
                      <button
                        onClick={() => startEdit(note.id, note.content)}
                        className="w-7 h-7 rounded-lg bg-blue-500 hover:bg-blue-600 text-white flex items-center justify-center transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => handleDelete(note.id)}
                        disabled={deleteNote.isPending}
                        className="w-7 h-7 rounded-lg bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors disabled:opacity-50"
                      >
                        {deleteNote.isPending ? (
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-3 h-3" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
