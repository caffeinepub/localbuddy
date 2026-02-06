import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface MenuItem {
    id: bigint;
    name: string;
    isAvailable: boolean;
    description: string;
    price: number;
}
export interface Location {
    latitude: number;
    longitude: number;
}
export interface VendorProfile {
    id: Principal;
    trustedBy: Array<Principal>;
    menu: Array<MenuItem>;
    name: string;
    description: string;
    phone: string;
    location: Location;
}
export interface UserProfile {
    name: string;
    isVendor: boolean;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addMenuItem(menuItem: MenuItem): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getCallerVendorProfile(): Promise<VendorProfile | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    getVendorProfile(vendorId: Principal): Promise<VendorProfile | null>;
    getVendorProfileCount(): Promise<bigint>;
    isCallerAdmin(): Promise<boolean>;
    listVendorProfilesByLocation(): Promise<Array<VendorProfile>>;
    removeMenuItem(menuItemId: bigint): Promise<void>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateMenuItem(menuItem: MenuItem): Promise<void>;
    upsertVendorProfile(profile: VendorProfile): Promise<void>;
}
