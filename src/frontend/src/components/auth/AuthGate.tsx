import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { LogIn, Shield } from 'lucide-react';

export default function AuthGate() {
  const { login, loginStatus } = useInternetIdentity();
  const isLoggingIn = loginStatus === 'logging-in';

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center p-4">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Login Required</CardTitle>
          <CardDescription>Please log in to access this feature and start exploring LocalBuddy.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={handleLogin} disabled={isLoggingIn} className="w-full" size="lg">
            <LogIn className="mr-2 h-5 w-5" />
            {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
