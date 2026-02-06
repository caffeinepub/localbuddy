import { useInternetIdentity } from '../hooks/useInternetIdentity';
import AuthGate from '../components/auth/AuthGate';
import VendorGate from '../components/auth/VendorGate';
import VendorDashboard from '../components/vendor/VendorDashboard';

export default function VendorPortalPage() {
  const { identity, isInitializing } = useInternetIdentity();

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!identity) {
    return <AuthGate />;
  }

  return (
    <VendorGate>
      <VendorDashboard />
    </VendorGate>
  );
}
