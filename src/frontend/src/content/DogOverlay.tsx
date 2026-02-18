import { useState, useEffect, useRef } from 'react';
import { X, Minimize2, LogIn, LogOut, User } from 'lucide-react';
import MessageBubble from './MessageBubble';
import InteractionButtons from './InteractionButtons';
import NotesPanel from './NotesPanel';
import BreakReminderPanel from './BreakReminderPanel';
import BreakNotification from './BreakNotification';
import { getRandomMessage } from './messages';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetNextNotification } from '../hooks/useQueries';

type DogState = 'idle' | 'eating' | 'petting';

export default function DogOverlay() {
  const [position, setPosition] = useState({ x: 20, y: 20 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [dogState, setDogState] = useState<DogState>('idle');
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);
  const [showNotes, setShowNotes] = useState(false);
  const [showBreakSettings, setShowBreakSettings] = useState(false);
  const [showBreakNotification, setShowBreakNotification] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const overlayRef = useRef<HTMLDivElement>(null);

  const { identity, login, clear, isLoggingIn, loginStatus, loginError } = useInternetIdentity();
  const isAuthenticated = !!identity && !identity.getPrincipal().isAnonymous();

  // Query for notifications only when authenticated
  const { data: notification } = useGetNextNotification();

  // Load saved position from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('dogPosition');
    if (saved) {
      setPosition(JSON.parse(saved));
    }
  }, []);

  // Save position to localStorage
  useEffect(() => {
    localStorage.setItem('dogPosition', JSON.stringify(position));
  }, [position]);

  // Show random encouraging messages
  useEffect(() => {
    const showMessage = () => {
      setCurrentMessage(getRandomMessage());
      setTimeout(() => setCurrentMessage(null), 5000);
    };

    // Show first message after 3 seconds
    const initialTimer = setTimeout(showMessage, 3000);

    // Then show messages every 5-10 minutes
    const interval = setInterval(showMessage, Math.random() * 300000 + 300000);

    return () => {
      clearTimeout(initialTimer);
      clearInterval(interval);
    };
  }, []);

  // Show break notification when backend returns one
  useEffect(() => {
    if (notification && isAuthenticated) {
      setShowBreakNotification(true);
    }
  }, [notification, isAuthenticated]);

  // Show login error as message
  useEffect(() => {
    if (loginError) {
      setCurrentMessage(`Login failed: ${loginError.message}`);
      setTimeout(() => setCurrentMessage(null), 5000);
    }
  }, [loginError]);

  // Show login success message
  useEffect(() => {
    if (loginStatus === 'success') {
      setCurrentMessage('Successfully logged in! 🎉');
      setTimeout(() => setCurrentMessage(null), 3000);
    }
  }, [loginStatus]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return;
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: e.clientX - dragOffset.x,
          y: e.clientY - dragOffset.y,
        });
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleFeed = () => {
    setDogState('eating');
    setCurrentMessage("Yum! Thank you! 🍖");
    setTimeout(() => {
      setDogState('idle');
      setCurrentMessage(null);
    }, 3000);

    // Track feeding
    const feedCount = parseInt(localStorage.getItem('feedCount') || '0');
    localStorage.setItem('feedCount', (feedCount + 1).toString());
  };

  const handlePet = () => {
    setDogState('petting');
    setCurrentMessage("That feels wonderful! 💕");
    setTimeout(() => {
      setDogState('idle');
      setCurrentMessage(null);
    }, 3000);

    // Track petting
    const petCount = parseInt(localStorage.getItem('petCount') || '0');
    localStorage.setItem('petCount', (petCount + 1).toString());
  };

  const handleDismissBreak = () => {
    setShowBreakNotification(false);
  };

  const handleSnoozeBreak = () => {
    setShowBreakNotification(false);
  };

  const handleLogin = () => {
    if (isLoggingIn) return;
    login();
  };

  const handleLogout = () => {
    clear();
    setShowNotes(false);
    setShowBreakSettings(false);
    setCurrentMessage('Logged out successfully');
    setTimeout(() => setCurrentMessage(null), 3000);
  };

  const handleToggleNotes = () => {
    if (!isAuthenticated) {
      setCurrentMessage('Please log in to use notes! 📝');
      setTimeout(() => setCurrentMessage(null), 3000);
      return;
    }
    setShowNotes(!showNotes);
  };

  const handleToggleBreakSettings = () => {
    if (!isAuthenticated) {
      setCurrentMessage('Please log in to set break reminders! ⏰');
      setTimeout(() => setCurrentMessage(null), 3000);
      return;
    }
    setShowBreakSettings(!showBreakSettings);
  };

  const getDogImage = () => {
    switch (dogState) {
      case 'eating':
        return '/assets/generated/dog-eating.dim_256x256.png';
      case 'petting':
        return '/assets/generated/dog-petting.dim_256x256.png';
      default:
        return '/assets/generated/dog-companion.dim_256x256.png';
    }
  };

  if (isMinimized) {
    return (
      <div
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 999999,
        }}
        className="dog-overlay-minimized"
      >
        <button
          onClick={() => setIsMinimized(false)}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 shadow-2xl flex items-center justify-center hover:scale-110 transition-transform cursor-pointer"
        >
          <img src="/assets/generated/dog-companion.dim_256x256.png" alt="Dog" className="w-12 h-12 rounded-full" />
        </button>
      </div>
    );
  }

  return (
    <>
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 999999,
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleMouseDown}
        className="dog-overlay select-none"
      >
        <div className="relative">
          {/* Control buttons */}
          <div className="absolute -top-2 -right-2 flex gap-1 z-10">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                title="Logout"
                className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors"
              >
                <LogOut className="w-3 h-3" />
              </button>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                title="Login"
                className="w-6 h-6 rounded-full bg-green-500 hover:bg-green-600 text-white flex items-center justify-center shadow-lg transition-colors disabled:opacity-50"
              >
                {isLoggingIn ? (
                  <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-3 h-3" />
                )}
              </button>
            )}
            <button
              onClick={() => setIsMinimized(true)}
              className="w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg transition-colors"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Authentication status indicator */}
          {isAuthenticated && (
            <div className="absolute -top-2 -left-2 z-10">
              <div className="w-6 h-6 rounded-full bg-green-500 text-white flex items-center justify-center shadow-lg" title="Logged in">
                <User className="w-3 h-3" />
              </div>
            </div>
          )}

          {/* Dog image */}
          <div className="relative">
            <img
              src={getDogImage()}
              alt="Companion Dog"
              className="w-32 h-32 rounded-3xl shadow-2xl bg-white"
              draggable={false}
            />
            
            {/* Message bubble */}
            {currentMessage && <MessageBubble message={currentMessage} />}
          </div>

          {/* Interaction buttons */}
          <InteractionButtons
            onFeed={handleFeed}
            onPet={handlePet}
            onToggleNotes={handleToggleNotes}
            onToggleBreakSettings={handleToggleBreakSettings}
          />

          {/* Notes panel */}
          {showNotes && isAuthenticated && (
            <div className="absolute top-0 left-36 w-80">
              <NotesPanel onClose={() => setShowNotes(false)} />
            </div>
          )}

          {/* Break settings panel */}
          {showBreakSettings && isAuthenticated && (
            <div className="absolute top-0 left-36 w-80">
              <BreakReminderPanel onClose={() => setShowBreakSettings(false)} />
            </div>
          )}
        </div>
      </div>

      {/* Break notification */}
      {showBreakNotification && (
        <BreakNotification
          onDismiss={handleDismissBreak}
          onSnooze={handleSnoozeBreak}
        />
      )}
    </>
  );
}
