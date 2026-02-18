import { Coffee, X, Clock } from 'lucide-react';

interface BreakNotificationProps {
  onDismiss: () => void;
  onSnooze: () => void;
}

export default function BreakNotification({ onDismiss, onSnooze }: BreakNotificationProps) {
  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 9999999,
      }}
      className="animate-in fade-in zoom-in duration-300"
    >
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border-4 border-green-400 dark:border-green-600 p-8 max-w-md">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
            <Coffee className="w-10 h-10 text-white" />
          </div>
          
          <h2 className="text-2xl font-bold text-green-900 dark:text-green-100">
            Time for a Break! ☕
          </h2>
          
          <p className="text-green-800 dark:text-green-200">
            You've been working hard! Take a moment to stretch, hydrate, and rest your eyes.
          </p>

          <div className="flex gap-3 pt-4">
            <button
              onClick={onSnooze}
              className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Clock className="w-4 h-4" />
              Snooze 5 min
            </button>
            <button
              onClick={onDismiss}
              className="flex-1 py-3 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white font-medium transition-all flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
