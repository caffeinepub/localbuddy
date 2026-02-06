import { RouterProvider, createRouter, createRootRoute, createRoute } from '@tanstack/react-router';
import LandingPage from './pages/LandingPage';
import CustomerPortalPage from './pages/CustomerPortalPage';
import VendorPortalPage from './pages/VendorPortalPage';
import AppLayout from './components/AppLayout';

const rootRoute = createRootRoute({
  component: AppLayout,
});

const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LandingPage,
});

const customerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/customer',
  component: CustomerPortalPage,
});

const vendorRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/vendor',
  component: VendorPortalPage,
});

const routeTree = rootRoute.addChildren([landingRoute, customerRoute, vendorRoute]);

const router = createRouter({ routeTree });

export default function App() {
  return <RouterProvider router={router} />;
}
