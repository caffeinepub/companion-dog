interface InteractionButtonsProps {
  onFeed: () => void;
  onPet: () => void;
  onToggleNotes: () => void;
  onToggleBreakSettings: () => void;
}

export default function InteractionButtons({
  onFeed,
  onPet,
  onToggleNotes,
  onToggleBreakSettings,
}: InteractionButtonsProps) {
  return (
    <div className="flex gap-2 mt-3 justify-center">
      <button
        onClick={onFeed}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        title="Feed"
      >
        <img src="/assets/generated/icon-feed.dim_64x64.png" alt="Feed" className="w-6 h-6" />
      </button>
      <button
        onClick={onPet}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600 shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        title="Pet"
      >
        <img src="/assets/generated/icon-pet.dim_64x64.png" alt="Pet" className="w-6 h-6" />
      </button>
      <button
        onClick={onToggleNotes}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600 shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        title="Notes"
      >
        <img src="/assets/generated/icon-notes.dim_64x64.png" alt="Notes" className="w-6 h-6" />
      </button>
      <button
        onClick={onToggleBreakSettings}
        className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 shadow-lg flex items-center justify-center transition-all hover:scale-110 cursor-pointer"
        title="Break Reminder"
      >
        <img src="/assets/generated/icon-break.dim_64x64.png" alt="Break" className="w-6 h-6" />
      </button>
    </div>
  );
}
