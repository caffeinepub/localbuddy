import { type VendorProfile } from '../../backend';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../ui/sheet';
import { Button } from '../ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { MapPin, Phone, Navigation, Utensils } from 'lucide-react';

interface VendorDetailPanelProps {
  vendor: VendorProfile;
  onClose: () => void;
}

export default function VendorDetailPanel({ vendor, onClose }: VendorDetailPanelProps) {
  const handleGetDirections = () => {
    const url = `https://www.openstreetmap.org/directions?from=&to=${vendor.location.latitude},${vendor.location.longitude}`;
    window.open(url, '_blank');
  };

  const availableItems = vendor.menu.filter((item) => item.isAvailable);
  const unavailableItems = vendor.menu.filter((item) => !item.isAvailable);

  return (
    <Sheet open={true} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-2xl">{vendor.name}</SheetTitle>
          <SheetDescription>{vendor.description}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Contact & Location */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Contact & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {vendor.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <span>{vendor.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm">
                  {vendor.location.latitude.toFixed(6)}, {vendor.location.longitude.toFixed(6)}
                </span>
              </div>
              <Button onClick={handleGetDirections} className="w-full mt-2">
                <Navigation className="mr-2 h-4 w-4" />
                Get Directions
              </Button>
            </CardContent>
          </Card>

          {/* Menu */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Menu
              </CardTitle>
            </CardHeader>
            <CardContent>
              {vendor.menu.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">No menu items yet</p>
              ) : (
                <div className="space-y-4">
                  {/* Available Items */}
                  {availableItems.length > 0 && (
                    <div className="space-y-3">
                      {availableItems.map((item) => (
                        <div key={item.id.toString()} className="space-y-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <Badge variant="default" className="ml-2">
                              ${item.price.toFixed(2)}
                            </Badge>
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Unavailable Items */}
                  {unavailableItems.length > 0 && (
                    <div className="space-y-3 opacity-60">
                      <p className="text-sm font-medium text-muted-foreground">Currently Unavailable</p>
                      {unavailableItems.map((item) => (
                        <div key={item.id.toString()} className="space-y-1">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium line-through">{item.name}</h4>
                              <p className="text-sm text-muted-foreground">{item.description}</p>
                            </div>
                            <Badge variant="secondary" className="ml-2">
                              ${item.price.toFixed(2)}
                            </Badge>
                          </div>
                          <Separator />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </SheetContent>
    </Sheet>
  );
}
