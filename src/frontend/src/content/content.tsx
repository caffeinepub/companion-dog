import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { InternetIdentityProvider } from '../hooks/useInternetIdentity';
import DogOverlay from './DogOverlay';
import '../index.css';

// Create a container for the extension
const container = document.createElement('div');
container.id = 'companion-dog-extension';
container.style.cssText = 'all: initial; position: fixed; z-index: 999999;';
document.body.appendChild(container);

// Create a shadow root to isolate styles
const shadowRoot = container.attachShadow({ mode: 'open' });

// Create a style element and inject styles
const styleElement = document.createElement('style');
styleElement.textContent = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap');
  
  * {
    font-family: 'Nunito', system-ui, -apple-system, sans-serif;
  }
  
  .dog-overlay {
    font-family: 'Nunito', system-ui, -apple-system, sans-serif;
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes slide-in-from-bottom-2 {
    from { transform: translateY(0.5rem); }
    to { transform: translateY(0); }
  }
  
  @keyframes zoom-in {
    from { transform: translate(-50%, -50%) scale(0.95); }
    to { transform: translate(-50%, -50%) scale(1); }
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  
  .animate-in {
    animation: fade-in 0.3s ease-out;
  }
  
  .fade-in {
    animation: fade-in 0.3s ease-out;
  }
  
  .slide-in-from-bottom-2 {
    animation: slide-in-from-bottom-2 0.3s ease-out;
  }
  
  .zoom-in {
    animation: zoom-in 0.3s ease-out;
  }

  .animate-spin {
    animation: spin 1s linear infinite;
  }
`;
shadowRoot.appendChild(styleElement);

// Create root element for React
const rootElement = document.createElement('div');
shadowRoot.appendChild(rootElement);

// Initialize React app with proper provider order
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

console.log('Companion Dog Extension: Initializing...');

const root = ReactDOM.createRoot(rootElement);
root.render(
  <QueryClientProvider client={queryClient}>
    <InternetIdentityProvider>
      <DogOverlay />
    </InternetIdentityProvider>
  </QueryClientProvider>
);

console.log('Companion Dog Extension: Initialized successfully');
