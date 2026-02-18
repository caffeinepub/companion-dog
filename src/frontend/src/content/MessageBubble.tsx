interface MessageBubbleProps {
  message: string;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  return (
    <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-48 animate-in fade-in slide-in-from-bottom-2 duration-300">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-3 relative border-2 border-amber-200 dark:border-amber-700">
        <p className="text-sm text-amber-900 dark:text-amber-100 font-medium text-center">
          {message}
        </p>
        <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-white dark:bg-slate-800 border-r-2 border-b-2 border-amber-200 dark:border-amber-700 rotate-45" />
      </div>
    </div>
  );
}
