import { useEffect, useRef } from 'react';
import { type VendorProfile } from '../../backend';

interface OsmVendorMapProps {
  vendors: VendorProfile[];
  selectedVendor: VendorProfile | null;
  onSelectVendor: (vendor: VendorProfile) => void;
}

// Declare Leaflet types for window object
declare global {
  interface Window {
    L: any;
  }
}

export default function OsmVendorMap({ vendors, selectedVendor, onSelectVendor }: OsmVendorMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);
  const markersRef = useRef<Map<string, any>>(new Map());
  const leafletLoadedRef = useRef(false);

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

        // Initialize map
        const map = L.map(mapContainerRef.current).setView([40.7128, -74.006], 13);

        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxZoom: 19,
        }).addTo(map);

        mapRef.current = map;

        // Center map on vendors if available
        if (vendors.length > 0) {
          const bounds = L.latLngBounds(vendors.map((v: VendorProfile) => [v.location.latitude, v.location.longitude]));
          map.fitBounds(bounds, { padding: [50, 50] });
        }
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
  }, []);

  // Update markers when vendors change
  useEffect(() => {
    if (!mapRef.current || !leafletLoadedRef.current || !window.L) return;

    const L = window.L;

    // Clear existing markers
    markersRef.current.forEach((marker) => marker.remove());
    markersRef.current.clear();

    // Add new markers
    vendors.forEach((vendor) => {
      const marker = L.marker([vendor.location.latitude, vendor.location.longitude])
        .addTo(mapRef.current)
        .bindPopup(`<strong>${vendor.name}</strong><br/>${vendor.description}`);

      marker.on('click', () => {
        onSelectVendor(vendor);
      });

      markersRef.current.set(vendor.id.toString(), marker);
    });

    // Fit bounds if vendors exist
    if (vendors.length > 0) {
      const bounds = L.latLngBounds(vendors.map((v: VendorProfile) => [v.location.latitude, v.location.longitude]));
      mapRef.current.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [vendors, onSelectVendor]);

  // Highlight selected vendor
  useEffect(() => {
    if (!mapRef.current || !leafletLoadedRef.current || !window.L) return;

    const L = window.L;

    // Reset all markers to default icon
    markersRef.current.forEach((marker) => {
      marker.setIcon(new L.Icon.Default());
    });

    // Highlight selected marker
    if (selectedVendor) {
      const marker = markersRef.current.get(selectedVendor.id.toString());
      if (marker) {
        const highlightIcon = L.icon({
          iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
          shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
          shadowSize: [41, 41],
        });
        marker.setIcon(highlightIcon);
        mapRef.current.setView([selectedVendor.location.latitude, selectedVendor.location.longitude], 15);
        marker.openPopup();
      }
    }
  }, [selectedVendor]);

  return <div ref={mapContainerRef} className="w-full h-full" />;
}
