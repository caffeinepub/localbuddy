import Map "mo:core/Map";
import Set "mo:core/Set";
import Runtime "mo:core/Runtime";
import Int "mo:core/Int";
import Text "mo:core/Text";
import Float "mo:core/Float";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Principal "mo:core/Principal";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Types (All persistent types must have only immutable fields)
  public type Location = {
    latitude : Float;
    longitude : Float;
  };

  public type MenuItem = {
    id : Int;
    name : Text;
    description : Text;
    price : Float;
    isAvailable : Bool;
  };

  public type VendorProfile = {
    id : Principal;
    name : Text;
    description : Text;
    location : Location;
    menu : [MenuItem];
    phone : Text;
    trustedBy : [Principal];
  };

  public type UserProfile = {
    name : Text;
    isVendor : Bool;
  };

  // Persistent state
  let vendorProfiles = Map.empty<Principal, VendorProfile>();
  let userProfiles = Map.empty<Principal, UserProfile>();
  var nextMenuItemId = 0;

  // Authorization
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Helper function to compare locations
  func compareByLocation(a : VendorProfile, b : VendorProfile) : Order.Order {
    switch (Float.compare(a.location.latitude, b.location.latitude)) {
      case (#equal) { Float.compare(a.location.longitude, b.location.longitude) };
      case (order) { order };
    };
  };

  // User Profile Management (required by frontend)
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Vendor Profile Management
  public shared ({ caller }) func upsertVendorProfile(profile : VendorProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage vendor profiles");
    };
    // Ensure vendor can only update their own profile
    if (profile.id != caller) {
      Runtime.trap("Unauthorized: Can only update your own vendor profile");
    };
    vendorProfiles.add(caller, profile);
  };

  public query ({ caller }) func getVendorProfile(vendorId : Principal) : async ?VendorProfile {
    // Anyone (including guests) can view vendor profiles
    vendorProfiles.get(vendorId);
  };

  public query ({ caller }) func getCallerVendorProfile() : async ?VendorProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access vendor profiles");
    };
    vendorProfiles.get(caller);
  };

  public query ({ caller }) func listVendorProfilesByLocation() : async [VendorProfile] {
    // Anyone (including guests) can list vendors - this is for customers
    let profiles = vendorProfiles.values().toArray();
    profiles.sort(compareByLocation);
  };

  public query ({ caller }) func getVendorProfileCount() : async Nat {
    // Anyone (including guests) can get the count
    vendorProfiles.size();
  };

  // Menu Management
  public shared ({ caller }) func addMenuItem(menuItem : MenuItem) : async Int {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage menu items");
    };

    // Get the caller's vendor profile
    let ?vendorProfile = vendorProfiles.get(caller) else {
      Runtime.trap("Vendor profile not found. Create a vendor profile first.");
    };

    let id = nextMenuItemId;
    nextMenuItemId += 1;

    // Create new menu item with assigned ID
    let newMenuItem = {
      id = id;
      name = menuItem.name;
      description = menuItem.description;
      price = menuItem.price;
      isAvailable = menuItem.isAvailable;
    };

    // Add menu item to caller's vendor profile only
    let updatedMenu = vendorProfile.menu.concat([newMenuItem]);
    let updatedProfile = {
      id = vendorProfile.id;
      name = vendorProfile.name;
      description = vendorProfile.description;
      location = vendorProfile.location;
      menu = updatedMenu;
      phone = vendorProfile.phone;
      trustedBy = vendorProfile.trustedBy;
    };

    vendorProfiles.add(caller, updatedProfile);
    id;
  };

  public shared ({ caller }) func updateMenuItem(menuItem : MenuItem) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage menu items");
    };

    // Get the caller's vendor profile
    let ?vendorProfile = vendorProfiles.get(caller) else {
      Runtime.trap("Vendor profile not found");
    };

    // Update the menu item in the caller's vendor profile
    let updatedMenu = vendorProfile.menu.map(
      func(item : MenuItem) : MenuItem {
        if (item.id == menuItem.id) {
          menuItem;
        } else {
          item;
        };
      }
    );

    let updatedProfile = {
      id = vendorProfile.id;
      name = vendorProfile.name;
      description = vendorProfile.description;
      location = vendorProfile.location;
      menu = updatedMenu;
      phone = vendorProfile.phone;
      trustedBy = vendorProfile.trustedBy;
    };

    vendorProfiles.add(caller, updatedProfile);
  };

  public shared ({ caller }) func removeMenuItem(menuItemId : Int) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can manage menu items");
    };

    // Get the caller's vendor profile
    let ?vendorProfile = vendorProfiles.get(caller) else {
      Runtime.trap("Vendor profile not found");
    };

    // Remove the menu item from the caller's vendor profile
    let updatedMenu = vendorProfile.menu.filter(
      func(item : MenuItem) : Bool {
        item.id != menuItemId;
      }
    );

    let updatedProfile = {
      id = vendorProfile.id;
      name = vendorProfile.name;
      description = vendorProfile.description;
      location = vendorProfile.location;
      menu = updatedMenu;
      phone = vendorProfile.phone;
      trustedBy = vendorProfile.trustedBy;
    };

    vendorProfiles.add(caller, updatedProfile);
  };
};
