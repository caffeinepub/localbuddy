import { useState, useEffect, useRef } from 'react';
import { useGetCallerVendorProfile } from '../../hooks/queries/useVendors';
import { useUpsertVendorProfile } from '../../hooks/mutations/useVendorMutations';
import { useInternetIdentity } from '../../hooks/useInternetIdentity';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { MapPin, Save } from 'lucide-react';
import LoadingState from '../states/LoadingState';
import { toast } from 'sonner';

// Declare Leaflet types for window object
declare global {
  interface Window {
    L: any;
  }
}

export default function LocationPicker() {
  const { identity } = useInternetIdentity();
  const { data: vendorProfile, isLoading } = useGetCallerVendorProfile();
  const upsertProfile = useUpsertVendorProfile();

  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const leafletLoadedRef = useRef(false);

  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    if (vendorProfile) {
      setLatitude(vendorProfile.location.latitude.toString());
      setLongitude(vendorProfile.location.longitude.toString());
    }
  }, [vendorProfile]);

  useEffect(() => {
    let isMounted = true;

    const loadLeaflet = () => {
      return new Promise<void>((resolve, reject) => {
        if (window.L) {
          resolve();
          return;
        }

        // Load Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=';
        link.crossOrigin = '';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
        script.integrity = 'sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=';
        script.crossOrigin = '';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Leaflet'));
        document.head.appendChild(script);
      });
    };

    const initMap = async () => {
      if (!mapContainerRef.current || mapRef.current) return;

      try {
        await loadLeaflet();
        if (!isMounted) return;

        const L = window.L;
        leafletLoadedRef.current = true;

        // Fix default marker icon issue
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
          iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
        });

        const initialLat = vendorProfile?.location.latitude || 40.7128;
        const initialLng = vendorProfile?.location.longitude || -74.006;

        const map = L.map(mapContainerRef.current).setView([initialLat, initialLng], 13);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        const marker = L.marker([initialLat, initialLng], { draggable: true }).addTo(map);

        marker.on('dragend', () => {
          const pos = marker.getLatLng();
          setLatitude(pos.lat.toFixed(6));
          setLongitude(pos.lng.toFixed(6));
        });

        map.on('click', (e: any) => {
          marker.setLatLng(e.latlng);
          setLatitude(e.latlng.lat.toFixed(6));
          setLongitude(e.latlng.lng.toFixed(6));
        });

        mapRef.current = map;
        markerRef.current = marker;
      } catch (error) {
        console.error('Failed to initialize map:', error);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, [vendorProfile]);

  const handleManualUpdate = () => {
    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Please enter valid coordinates');
      return;
    }

    if (markerRef.current && mapRef.current && window.L) {
      const L = window.L;
      const newPos = L.latLng(lat, lng);
      markerRef.current.setLatLng(newPos);
      mapRef.current.setView(newPos, 13);
    }
  };

  const handleSave = () => {
    if (!identity || !vendorProfile) {
      toast.error('Unable to save location');
      return;
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    if (isNaN(lat) || isNaN(lng)) {
      toast.error('Please enter valid coordinates');
      return;
    }

    const updatedProfile = {
      ...vendorProfile,
      location: { latitude: lat, longitude: lng },
    };

    upsertProfile.mutate(updatedProfile, {
      onSuccess: () => {
        toast.success('Location saved successfully!');
      },
      onError: (error) => {
        toast.error(`Failed to save location: ${error.message}`);
      },
    });
  };

  if (isLoading) {
    return <LoadingState message="Loading location..." />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vendor Location</CardTitle>
        <CardDescription>Set your vendor location by clicking on the map or dragging the marker</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="h-96 rounded-lg overflow-hidden border border-border">
          <div ref={mapContainerRef} className="w-full h-full" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              placeholder="e.g., 40.712800"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              placeholder="e.g., -74.006000"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleManualUpdate} variant="outline">
            <MapPin className="mr-2 h-4 w-4" />
            Update Map
          </Button>
          <Button onClick={handleSave} disabled={upsertProfile.isPending}>
            <Save className="mr-2 h-4 w-4" />
            {upsertProfile.isPending ? 'Saving...' : 'Save Location'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
