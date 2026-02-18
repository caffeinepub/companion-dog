import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Heart, Sparkles } from 'lucide-react';
import { useInternetIdentity } from './hooks/useInternetIdentity';

export default function App() {
  const { login, clear, identity, isLoggingIn } = useInternetIdentity();
  const [isBuilding, setIsBuilding] = useState(false);

  const handleDownload = async () => {
    setIsBuilding(true);
    // Simulate build process
    setTimeout(() => {
      setIsBuilding(false);
      alert('Extension build complete! In a production environment, this would trigger a zip download.');
    }, 2000);
  };

  const currentYear = new Date().getFullYear();
  const appIdentifier = encodeURIComponent(window.location.hostname || 'companion-dog');

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <header className="border-b border-amber-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center">
              <Heart className="w-6 h-6 text-white fill-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-amber-900 dark:text-amber-100">Companion Dog</h1>
              <p className="text-sm text-amber-700 dark:text-amber-300">Your encouraging browser buddy</p>
            </div>
          </div>
          <div>
            {identity ? (
              <Button onClick={clear} variant="outline" className="rounded-full">
                Logout
              </Button>
            ) : (
              <Button onClick={login} disabled={isLoggingIn} className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                {isLoggingIn ? 'Connecting...' : 'Login'}
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto space-y-8">
          <section className="text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 text-sm font-medium">
              <Sparkles className="w-4 h-4" />
              Browser Extension
            </div>
            <h2 className="text-5xl font-bold text-amber-950 dark:text-amber-50">
              Meet Your New Best Friend
            </h2>
            <p className="text-xl text-amber-800 dark:text-amber-200 max-w-2xl mx-auto">
              A friendly dog companion that lives in your browser, offering encouragement, reminders, and a place to jot down your thoughts.
            </p>
          </section>

          <Card className="border-2 border-amber-200 dark:border-amber-800 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-amber-100 to-orange-100 dark:from-amber-900/50 dark:to-orange-900/50">
              <CardTitle className="text-2xl text-amber-950 dark:text-amber-50">Download Your Companion</CardTitle>
              <CardDescription className="text-amber-800 dark:text-amber-200">
                Get started with your encouraging browser buddy in seconds
              </CardDescription>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-amber-900 dark:text-amber-100">Features:</h3>
                  <ul className="space-y-3 text-amber-800 dark:text-amber-200">
                    <li className="flex items-start gap-2">
                      <Heart className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Encouraging messages throughout your day</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Feed and pet your companion for interactive fun</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Quick note-taking without leaving your page</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Heart className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                      <span>Customizable break reminders</span>
                    </li>
                  </ul>
                </div>
                <div className="space-y-4">
                  <h3 className="font-semibold text-lg text-amber-900 dark:text-amber-100">Installation:</h3>
                  <ol className="space-y-3 text-amber-800 dark:text-amber-200 list-decimal list-inside">
                    <li>Download the extension zip file</li>
                    <li>Extract the zip to a folder</li>
                    <li>Open Chrome/Edge and go to Extensions</li>
                    <li>Enable "Developer mode"</li>
                    <li>Click "Load unpacked" and select the folder</li>
                  </ol>
                </div>
              </div>

              {!identity && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 text-center">
                  <p className="text-amber-900 dark:text-amber-100 mb-4">
                    Please login to download and sync your companion's data across devices
                  </p>
                  <Button onClick={login} disabled={isLoggingIn} className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600">
                    {isLoggingIn ? 'Connecting...' : 'Login to Continue'}
                  </Button>
                </div>
              )}

              {identity && (
                <Button
                  onClick={handleDownload}
                  disabled={isBuilding}
                  size="lg"
                  className="w-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-lg py-6"
                >
                  <Download className="w-5 h-5 mr-2" />
                  {isBuilding ? 'Building Extension...' : 'Download Extension'}
                </Button>
              )}
            </CardContent>
          </Card>

          <Card className="border-2 border-amber-200 dark:border-amber-800 rounded-3xl">
            <CardHeader>
              <CardTitle className="text-amber-950 dark:text-amber-50">Preview</CardTitle>
              <CardDescription className="text-amber-800 dark:text-amber-200">
                See what your companion looks like
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center p-8">
              <div className="relative">
                <img
                  src="/assets/generated/dog-companion.dim_256x256.png"
                  alt="Companion Dog"
                  className="w-64 h-64 rounded-3xl shadow-2xl"
                />
                <div className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-4 max-w-xs">
                  <p className="text-sm text-amber-900 dark:text-amber-100 font-medium">
                    "You're doing amazing! Keep up the great work! 🌟"
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="border-t border-amber-200/50 dark:border-slate-700/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-amber-700 dark:text-amber-300">
            <p className="flex items-center justify-center gap-2">
              © {currentYear} Built with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> using{' '}
              <a
                href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${appIdentifier}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-600 dark:text-amber-400 hover:underline font-medium"
              >
                caffeine.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
