import { Outlet, useNavigate, useRouterState } from '@tanstack/react-router';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from './ui/button';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function AppLayout() {
  const navigate = useNavigate();
  const { identity, login, clear, loginStatus } = useInternetIdentity();
  const queryClient = useQueryClient();
  const routerState = useRouterState();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isAuthenticated = !!identity;
  const isLoggingIn = loginStatus === 'logging-in';
  const currentPath = routerState.location.pathname;

  const handleAuth = async () => {
    if (isAuthenticated) {
      await clear();
      queryClient.clear();
      navigate({ to: '/' });
    } else {
      try {
        await login();
      } catch (error: any) {
        console.error('Login error:', error);
        if (error.message === 'User is already authenticated') {
          await clear();
          setTimeout(() => login(), 300);
        }
      }
    }
  };

  const handleNavigation = (path: string) => {
    navigate({ to: path });
    setMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => handleNavigation('/')}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img
                src="/assets/generated/localbuddy-logo.dim_512x256.png"
                alt="LocalBuddy"
                className="h-10 w-auto"
              />
            </button>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <Button
                variant={currentPath === '/customer' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('/customer')}
              >
                Find Food
              </Button>
              <Button
                variant={currentPath === '/vendor' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('/vendor')}
              >
                I'm a Vendor
              </Button>
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                variant={isAuthenticated ? 'outline' : 'default'}
              >
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 hover:bg-accent rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <nav className="md:hidden mt-4 pb-2 flex flex-col gap-2">
              <Button
                variant={currentPath === '/customer' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('/customer')}
                className="w-full justify-start"
              >
                Find Food
              </Button>
              <Button
                variant={currentPath === '/vendor' ? 'default' : 'ghost'}
                onClick={() => handleNavigation('/vendor')}
                className="w-full justify-start"
              >
                I'm a Vendor
              </Button>
              <Button
                onClick={handleAuth}
                disabled={isLoggingIn}
                variant={isAuthenticated ? 'outline' : 'default'}
                className="w-full justify-start"
              >
                {isLoggingIn ? 'Logging in...' : isAuthenticated ? 'Logout' : 'Login'}
              </Button>
            </nav>
          )}
        </div>
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      <footer className="border-t border-border bg-card mt-auto">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            © 2026. Built with ❤️ using{' '}
            <a
              href="https://caffeine.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground transition-colors"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}
