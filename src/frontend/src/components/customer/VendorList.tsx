import { type VendorProfile } from '../../backend';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { MapPin, Phone } from 'lucide-react';

interface VendorListProps {
  vendors: VendorProfile[];
  selectedVendor: VendorProfile | null;
  onSelectVendor: (vendor: VendorProfile) => void;
}

export default function VendorList({ vendors, selectedVendor, onSelectVendor }: VendorListProps) {
  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 pr-4">
        {vendors.map((vendor) => {
          const isSelected = selectedVendor?.id.toString() === vendor.id.toString();
          const menuCount = vendor.menu.length;
          const availableItems = vendor.menu.filter((item) => item.isAvailable).length;

          return (
            <Card
              key={vendor.id.toString()}
              className={`cursor-pointer transition-all hover:shadow-md ${
                isSelected ? 'border-primary border-2 shadow-md' : ''
              }`}
              onClick={() => onSelectVendor(vendor)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{vendor.name}</CardTitle>
                    <CardDescription className="line-clamp-2 mt-1">{vendor.description}</CardDescription>
                  </div>
                  {isSelected && <Badge variant="default">Selected</Badge>}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>
                      {vendor.location.latitude.toFixed(4)}, {vendor.location.longitude.toFixed(4)}
                    </span>
                  </div>
                  {vendor.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      <span>{vendor.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2 pt-1">
                    <Badge variant="secondary">
                      {availableItems} of {menuCount} items available
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </ScrollArea>
  );
}
