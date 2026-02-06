# Specification

## Summary
**Goal:** Build LocalBuddy with a landing page that routes users to either a Customer portal for map-based vendor discovery or a Vendor portal for managing vendor profiles and menus, backed by Motoko APIs.

**Planned changes:**
- Create a landing page for “LocalBuddy” with two clear entry points: “I’m a Customer” and “I’m a Vendor”, plus route-based navigation between portals.
- Implement the Customer portal with an OpenStreetMap-based map view, vendor markers, a vendor list view, search/filter (text + category/food type), and an interactive vendor detail panel (info, menu items, price range, hours, directions link).
- Implement the Vendor portal with forms to create/update vendor profile fields, CRUD UI for menu items, and a map-based location picker for vendor coordinates.
- Add a single Motoko actor backend to store vendor profiles, locations (lat/lng), and menu items; provide query APIs for listing/details and update APIs for vendor management with stable storage.
- Wire frontend to backend using React Query, including loading, empty, and basic error states across primary screens.
- Apply a consistent, modern, friendly visual theme (non-blue/purple primary palette by default) and responsive layouts across landing and both portals.
- Add and reference generated static brand assets (logo + hero illustration) from `frontend/public/assets/generated` on the landing page.

**User-visible outcome:** Users can choose Customer or Vendor on the LocalBuddy landing page; customers can find nearby vendors via map and list with searchable filters and details, and vendors can manage their profile, menu, and location with changes saved in the backend and visible to customers after refresh.
