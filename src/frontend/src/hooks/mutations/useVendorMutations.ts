import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../useActor';
import { type VendorProfile, type MenuItem } from '../../backend';

export function useUpsertVendorProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: VendorProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.upsertVendorProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerVendorProfile'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useAddMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItem: MenuItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMenuItem(menuItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerVendorProfile'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useUpdateMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItem: MenuItem) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateMenuItem(menuItem);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerVendorProfile'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}

export function useRemoveMenuItem() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (menuItemId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.removeMenuItem(menuItemId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['callerVendorProfile'] });
      queryClient.invalidateQueries({ queryKey: ['vendors'] });
    },
  });
}
