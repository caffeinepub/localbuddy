import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import VendorProfileForm from './VendorProfileForm';
import MenuItemsEditor from './MenuItemsEditor';
import LocationPicker from './LocationPicker';
import { Store, Utensils, MapPin } from 'lucide-react';

export default function VendorDashboard() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Vendor Dashboard</h1>
        <p className="text-muted-foreground">Manage your vendor profile, menu, and location</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3 lg:w-auto">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline">Profile</span>
          </TabsTrigger>
          <TabsTrigger value="menu" className="flex items-center gap-2">
            <Utensils className="h-4 w-4" />
            <span className="hidden sm:inline">Menu</span>
          </TabsTrigger>
          <TabsTrigger value="location" className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden sm:inline">Location</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <VendorProfileForm />
        </TabsContent>

        <TabsContent value="menu">
          <MenuItemsEditor />
        </TabsContent>

        <TabsContent value="location">
          <LocationPicker />
        </TabsContent>
      </Tabs>
    </div>
  );
}
