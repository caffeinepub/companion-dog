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
      console.error('[DogOverlay] Login error detected:', loginError);
      setCurrentMessage(`Login failed: ${loginError.message}`);
      setTimeout(() => setCurrentMessage(null), 5000);
    }
  }, [loginError]);

  // Show login success message
  useEffect(() => {
    if (loginStatus === 'success') {
      console.log('[DogOverlay] Login successful');
      setCurrentMessage('Successfully logged in! 🎉');
      setTimeout(() => setCurrentMessage(null), 3000);
    }
  }, [loginStatus]);

  // Debug logging for authentication state
  useEffect(() => {
    console.log('[DogOverlay] Auth state:', {
      isAuthenticated,
      loginStatus,
      principal: identity?.getPrincipal().toString()
    });
  }, [isAuthenticated, loginStatus, identity]);

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
    console.log('[DogOverlay] Login button clicked, isLoggingIn:', isLoggingIn);
    if (isLoggingIn) {
      console.log('[DogOverlay] Already logging in, ignoring click');
      return;
    }
    console.log('[DogOverlay] Calling login()');
    try {
      login();
      setCurrentMessage('Opening login window...');
      setTimeout(() => {
        if (loginStatus === 'logging-in') {
          setCurrentMessage(null);
        }
      }, 2000);
    } catch (error) {
      console.error('[DogOverlay] Login error:', error);
      setCurrentMessage('Login failed. Please try again.');
      setTimeout(() => setCurrentMessage(null), 3000);
    }
  };

  const handleLogout = () => {
    console.log('[DogOverlay] Logout initiated');
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
        }}
        className="dog-overlay select-none"
        onMouseDown={handleMouseDown}
      >
        <div className="relative">
          {/* Control buttons */}
          <div className="absolute -top-2 -right-2 flex gap-1 z-10">
            <button
              onClick={() => setIsMinimized(true)}
              className="w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
              title="Minimize"
            >
              <Minimize2 className="w-3 h-3" />
            </button>
          </div>

          {/* Auth button */}
          <div className="absolute -top-2 -left-2 z-10">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleLogin}
                disabled={isLoggingIn}
                className="w-8 h-8 rounded-full bg-green-500 hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed text-white flex items-center justify-center shadow-lg transition-colors cursor-pointer"
                title={isLoggingIn ? 'Logging in...' : 'Login'}
              >
                {isLoggingIn ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <LogIn className="w-4 h-4" />
                )}
              </button>
            )}
          </div>

          {/* Message bubble */}
          {currentMessage && <MessageBubble message={currentMessage} />}

          {/* Dog image */}
          <div className="relative">
            <img
              src={getDogImage()}
              alt="Companion Dog"
              className="w-32 h-32 cursor-move"
              draggable={false}
            />
          </div>

          {/* Interaction buttons */}
          <InteractionButtons
            onFeed={handleFeed}
            onPet={handlePet}
            onToggleNotes={handleToggleNotes}
            onToggleBreakSettings={handleToggleBreakSettings}
          />
        </div>
      </div>

      {/* Notes panel */}
      {showNotes && (
        <div
          style={{
            position: 'fixed',
            left: `${position.x + 150}px`,
            top: `${position.y}px`,
            zIndex: 999999,
          }}
        >
          <NotesPanel onClose={() => setShowNotes(false)} />
        </div>
      )}

      {/* Break reminder settings panel */}
      {showBreakSettings && (
        <div
          style={{
            position: 'fixed',
            left: `${position.x + 150}px`,
            top: `${position.y}px`,
            zIndex: 999999,
          }}
        >
          <BreakReminderPanel onClose={() => setShowBreakSettings(false)} />
        </div>
      )}

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
