import { useState, useEffect } from 'react';
import { X, Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { useSetBreakReminder } from '../hooks/useQueries';

interface BreakReminderPanelProps {
  onClose: () => void;
}

export default function BreakReminderPanel({ onClose }: BreakReminderPanelProps) {
  const [interval, setInterval] = useState(30);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const setBreakReminder = useSetBreakReminder();

  useEffect(() => {
    const saved = localStorage.getItem('breakInterval');
    if (saved) {
      setInterval(parseInt(saved));
    }
  }, []);

  const handleSave = async () => {
    try {
      setError(null);
      setSuccess(false);
      await setBreakReminder.mutateAsync(interval);
      localStorage.setItem('breakInterval', interval.toString());
      localStorage.setItem('lastBreak', Date.now().toString());
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save break reminder');
      console.error('Set break reminder error:', err);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-2 border-green-200 dark:border-green-700 overflow-hidden">
      <div className="bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/50 dark:to-emerald-900/50 p-4 flex items-center justify-between">
        <h3 className="font-bold text-green-900 dark:text-green-100 flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Break Reminders
        </h3>
        <button
          onClick={onClose}
          className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="p-4 space-y-4">
        {/* Error display */}
        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-3 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
          </div>
        )}

        {/* Success display */}
        {success && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-3 flex items-start gap-2">
            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-800 dark:text-green-200">Break reminder saved successfully!</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-green-900 dark:text-green-100 mb-2">
            Remind me every:
          </label>
          <div className="flex items-center gap-3">
            <input
              type="number"
              value={interval}
              onChange={(e) => setInterval(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="120"
              className="w-20 px-3 py-2 rounded-xl border-2 border-green-200 dark:border-green-700 bg-white dark:bg-slate-900 text-green-900 dark:text-green-100 focus:outline-none focus:border-green-400 dark:focus:border-green-500 text-center"
            />
            <span className="text-green-800 dark:text-green-200">minutes</span>
          </div>
        </div>

        <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-3 border border-green-200 dark:border-green-800">
          <p className="text-sm text-green-800 dark:text-green-200">
            Your companion will remind you to take a break and stretch every {interval} minutes.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={setBreakReminder.isPending || success}
          className="w-full py-2 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {setBreakReminder.isPending ? (
            <span className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : success ? (
            'Saved!'
          ) : (
            'Save Settings'
          )}
        </button>
      </div>
    </div>
  );
}
