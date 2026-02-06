import { useState, useEffect } from 'react';
import { useGetCallerVendorProfile } from '../../hooks/queries/useVendors';
import { useUpsertVendorProfile } from '../../hooks/mutations/useVendorMutations';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Save } from 'lucide-react';
import LoadingState from '../states/LoadingState';
import { toast } from 'sonner';

export default function VendorProfileForm() {
  const { identity } = useInternetIdentity();
  const { data: vendorProfile, isLoading } = useGetCallerVendorProfile();
  const upsertProfile = useUpsertVendorProfile();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (vendorProfile) {
      setName(vendorProfile.name);
      setDescription(vendorProfile.description);
      setPhone(vendorProfile.phone);
    }
  }, [vendorProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!identity) {
      toast.error('You must be logged in to save your profile');
      return;
    }

    const profile = {
      id: identity.getPrincipal(),
      name: name.trim(),
      description: description.trim(),
      phone: phone.trim(),
      location: vendorProfile?.location || { latitude: 0, longitude: 0 },
      menu: vendorProfile?.menu || [],
      trustedBy: vendorProfile?.trustedBy || [],
    };

    upsertProfile.mutate(profile, {
      onSuccess: () => {
        toast.success('Profile saved successfully!');
      },
      onError: (error) => {
        toast.error(`Failed to save profile: ${error.message}`);
      },
    });
  };

  if (isLoading) {
    return <LoadingState message="Loading your profile..." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Profile</CardTitle>
        <CardDescription>Update your vendor information that customers will see</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Vendor Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Maria's Tacos"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              placeholder="Describe your food, specialties, and what makes you unique..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="e.g., +1 234 567 8900"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Button type="submit" disabled={upsertProfile.isPending || !name.trim() || !description.trim()}>
            <Save className="mr-2 h-4 w-4" />
            {upsertProfile.isPending ? 'Saving...' : 'Save Profile'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
