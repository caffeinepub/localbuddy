import { useState } from 'react';
import { useSaveCallerUserProfile } from '../../hooks/mutations/useAuthMutations';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { User } from 'lucide-react';

interface ProfileSetupModalProps {
  isVendor?: boolean;
}

export default function ProfileSetupModal({ isVendor = false }: ProfileSetupModalProps) {
  const [name, setName] = useState('');
  const [isVendorChecked, setIsVendorChecked] = useState(isVendor);
  const saveProfile = useSaveCallerUserProfile();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      saveProfile.mutate({
        name: name.trim(),
        isVendor: isVendorChecked,
      });
    }
  };

  return (
    <Dialog open={true}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <User className="h-8 w-8 text-primary" />
          </div>
          <DialogTitle className="text-center text-2xl">Welcome to LocalBuddy!</DialogTitle>
          <DialogDescription className="text-center">
            Let's set up your profile to get started. What should we call you?
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="isVendor"
              checked={isVendorChecked}
              onCheckedChange={(checked) => setIsVendorChecked(checked === true)}
            />
            <Label htmlFor="isVendor" className="text-sm font-normal cursor-pointer">
              I'm a street food vendor
            </Label>
          </div>

          <Button type="submit" className="w-full" disabled={saveProfile.isPending || !name.trim()}>
            {saveProfile.isPending ? 'Creating Profile...' : 'Continue'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
