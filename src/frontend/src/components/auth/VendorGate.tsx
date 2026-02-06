import { type ReactNode } from 'react';
import { useGetCallerUserProfile } from '../../hooks/queries/useAuthProfile';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { AlertCircle } from 'lucide-react';
import LoadingState from '../states/LoadingState';
import ProfileSetupModal from './ProfileSetupModal';

interface VendorGateProps {
  children: ReactNode;
}

export default function VendorGate({ children }: VendorGateProps) {
  const { data: userProfile, isLoading, isFetched } = useGetCallerUserProfile();

  if (isLoading) {
    return <LoadingState message="Checking vendor access..." />;
  }

  // Show profile setup if no profile exists
  if (isFetched && userProfile === null) {
    return <ProfileSetupModal isVendor={true} />;
  }

  // Check if user is a vendor
  if (userProfile && !userProfile.isVendor) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-md w-full border-destructive/50">
          <CardHeader className="text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle className="text-2xl">Vendor Access Required</CardTitle>
            <CardDescription>
              This area is for vendors only. If you'd like to become a vendor and share your street food with the
              community, please contact support.
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
