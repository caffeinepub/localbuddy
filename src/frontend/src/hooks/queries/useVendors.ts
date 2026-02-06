import { useQuery } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { type VendorProfile } from '../../backend';

export function useListVendors() {
  const { actor, isFetching } = useActor();

  return useQuery<VendorProfile[]>({
    queryKey: ['vendors'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listVendorProfilesByLocation();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetVendorProfile(vendorId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<VendorProfile | null>({
    queryKey: ['vendor', vendorId],
    queryFn: async () => {
      if (!actor) return null;
      const principal = { toString: () => vendorId } as any;
      return actor.getVendorProfile(principal);
    },
    enabled: !!actor && !isFetching && !!vendorId,
  });
}

export function useGetCallerVendorProfile() {
  const { actor, isFetching } = useActor();

  return useQuery<VendorProfile | null>({
    queryKey: ['callerVendorProfile'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getCallerVendorProfile();
    },
    enabled: !!actor && !isFetching,
  });
}
