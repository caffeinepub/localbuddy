import { useState, useMemo } from 'react';
import { useListVendors } from '../../hooks/queries/useVendors';
import { type VendorProfile } from '../../backend';
import VendorList from './VendorList';
import VendorDetailPanel from './VendorDetailPanel';
import OsmVendorMap from '../map/OsmVendorMap';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card } from '../ui/card';
import { Search, MapPin } from 'lucide-react';
import LoadingState from '../states/LoadingState';
import EmptyState from '../states/EmptyState';
import ErrorState from '../states/ErrorState';

export default function CustomerBrowseView() {
  const { data: vendors, isLoading, error } = useListVendors();
  const [selectedVendor, setSelectedVendor] = useState<VendorProfile | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filteredVendors = useMemo(() => {
    if (!vendors) return [];

    return vendors.filter((vendor) => {
      const matchesSearch =
        searchQuery === '' ||
        vendor.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        vendor.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = categoryFilter === 'all' || vendor.description.toLowerCase().includes(categoryFilter);

      return matchesSearch && matchesCategory;
    });
  }, [vendors, searchQuery, categoryFilter]);

  if (isLoading) {
    return <LoadingState message="Loading vendors..." />;
  }

  if (error) {
    return <ErrorState message="Failed to load vendors. Please try again." />;
  }

  if (!vendors || vendors.length === 0) {
    return (
      <EmptyState
        icon={MapPin}
        title="No Vendors Yet"
        description="Be the first to discover street food vendors in your area. Check back soon!"
      />
    );
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="container mx-auto px-4 py-6 h-full">
        {/* Search and Filter Bar */}
        <Card className="p-4 mb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search vendors or food..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="street">Street Food</SelectItem>
                <SelectItem value="snack">Snacks</SelectItem>
                <SelectItem value="meal">Meals</SelectItem>
                <SelectItem value="drink">Drinks</SelectItem>
                <SelectItem value="dessert">Desserts</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </Card>

        {/* Main Content: Map and List */}
        <div className="grid lg:grid-cols-3 gap-4 h-[calc(100%-6rem)]">
          {/* Vendor List */}
          <div className="lg:col-span-1 overflow-hidden">
            <VendorList
              vendors={filteredVendors}
              selectedVendor={selectedVendor}
              onSelectVendor={setSelectedVendor}
            />
          </div>

          {/* Map */}
          <div className="lg:col-span-2 relative rounded-lg overflow-hidden border border-border">
            <OsmVendorMap vendors={filteredVendors} selectedVendor={selectedVendor} onSelectVendor={setSelectedVendor} />
          </div>
        </div>

        {/* Vendor Detail Panel */}
        {selectedVendor && <VendorDetailPanel vendor={selectedVendor} onClose={() => setSelectedVendor(null)} />}
      </div>
    </div>
  );
}
