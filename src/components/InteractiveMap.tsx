import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import { MONUMENTS_DATA, Monument, METRO_LINES_DATA } from '../data/delhiData';
import {
  MapPin,
  Navigation,
  Compass,
  Layers,
  Download,
  CheckCircle,
  WifiOff,
  Sparkles,
  Train,
  UtensilsCrossed,
  ZoomIn,
  ZoomOut,
  Maximize2,
  RefreshCw,
  LocateFixed,
  Route,
  Bookmark,
  Plus,
  Trash2,
  Hotel,
  Coffee,
  X,
  Target,
  Crosshair,
} from 'lucide-react';

export interface SavedUserLocation {
  id: string;
  name: string;
  type: 'hotel' | 'cafe' | 'metro' | 'custom';
  lat: number;
  lng: number;
  notes?: string;
}

interface InteractiveMapProps {
  onSelectMonument: (monument: Monument) => void;
  selectedMonumentId?: string;
  isOfflineMode: boolean;
  onToggleOffline: () => void;
}

// Preset GPS reference points in Delhi for simulator
const REFERENCE_POINTS = [
  { name: 'Connaught Place (CP Center)', lat: 28.6304, lng: 77.2177 },
  { name: 'New Delhi Railway Station (NDLS)', lat: 28.6431, lng: 77.2223 },
  { name: 'Chandni Chowk / Old Delhi', lat: 28.6506, lng: 77.2303 },
  { name: 'IGI Airport Terminal 3', lat: 28.5562, lng: 77.1000 },
  { name: 'Hauz Khas Village (South Delhi)', lat: 28.5494, lng: 77.2001 },
  { name: 'Lajpat Nagar Central Market', lat: 28.5700, lng: 77.2430 },
];

// Key Metro Lines coordinate tracks for Delhi
const METRO_TRACKS = [
  {
    name: 'Yellow Line (Kashmere Gate - Qutub Minar)',
    color: '#eab308',
    coords: [
      [28.6675, 77.2285], // Kashmere Gate
      [28.6565, 77.2310], // Chandni Chowk
      [28.6431, 77.2223], // New Delhi
      [28.6328, 77.2195], // Rajiv Chowk (CP)
      [28.6145, 77.2120], // Central Secretariat
      [28.5880, 77.2090], // Jor Bagh
      [28.5680, 77.2070], // INA / Dilli Haat
      [28.5475, 77.2060], // AIIMS / Hauz Khas
      [28.5245, 77.1855], // Qutab Minar
    ] as [number, number][],
  },
  {
    name: 'Violet Line / Heritage Line (Red Fort - Lotus Temple)',
    color: '#8b5cf6',
    coords: [
      [28.6562, 77.2410], // Lal Quila
      [28.6507, 77.2334], // Jama Masjid
      [28.6380, 77.2400], // Delhi Gate
      [28.6250, 77.2210], // Janpath
      [28.6145, 77.2120], // Central Secretariat
      [28.5990, 77.2270], // Khan Market
      [28.5900, 77.2380], // JLN Stadium (Humayun Tomb)
      [28.5535, 77.2588], // Kalkaji Mandir (Lotus Temple)
    ] as [number, number][],
  },
  {
    name: 'Blue Line (Rajiv Chowk - Akshardham)',
    color: '#3b82f6',
    coords: [
      [28.6328, 77.2195], // Rajiv Chowk
      [28.6280, 77.2350], // Mandi House
      [28.6230, 77.2510], // Pragati Maidan / Supreme Court
      [28.6127, 77.2773], // Akshardham
    ] as [number, number][],
  },
  {
    name: 'Airport Express Line (Orange Line)',
    color: '#f97316',
    coords: [
      [28.6431, 77.2223], // New Delhi
      [28.6285, 77.2150], // Shivaji Stadium
      [28.5910, 77.1610], // Dhaula Kuan
      [28.5520, 77.1210], // Delhi Aerocity
      [28.5562, 77.1000], // IGI Airport T3
    ] as [number, number][],
  },
];

type TileStyle = 'dark' | 'streets' | 'osm';

const DEFAULT_SAVED_LOCATIONS: SavedUserLocation[] = [
  {
    id: 'loc-1',
    name: 'My Hotel (Janpath Imperial)',
    type: 'hotel',
    lat: 28.6230,
    lng: 77.2185,
    notes: 'Base stay in Central Delhi near Janpath Metro',
  },
  {
    id: 'loc-2',
    name: 'Favorite Breakfast Spot (Paharganj)',
    type: 'cafe',
    lat: 28.6425,
    lng: 77.2150,
    notes: 'Sita Ram Diwan Chand Chole Bhature',
  },
];

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  onSelectMonument,
  selectedMonumentId,
  isOfflineMode,
  onToggleOffline,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const labelsLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const metroLayerRef = useRef<L.LayerGroup | null>(null);
  const userLocationsLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLineRef = useRef<L.Polyline | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [activeFilter, setActiveFilter] = useState<'all' | 'UNESCO Heritage' | 'Fort & Palace' | 'Sacred & Spiritual' | 'Modern & Civic'>('all');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number; name: string }>(REFERENCE_POINTS[0]);
  const [tileStyle, setTileStyle] = useState<TileStyle>('dark');
  const [showMetroTracks, setShowMetroTracks] = useState(true);
  const [isLocating, setIsLocating] = useState(false);
  const [locationAccuracy, setLocationAccuracy] = useState<string | null>(null);

  // User Saved Locations State
  const [savedLocations, setSavedLocations] = useState<SavedUserLocation[]>(() => {
    try {
      const stored = localStorage.getItem('delhi_saved_user_locations');
      return stored ? JSON.parse(stored) : DEFAULT_SAVED_LOCATIONS;
    } catch {
      return DEFAULT_SAVED_LOCATIONS;
    }
  });
  const [showAddLocationModal, setShowAddLocationModal] = useState(false);
  const [showLocationsDrawer, setShowLocationsDrawer] = useState(false);
  const [newLocName, setNewLocName] = useState('');
  const [newLocType, setNewLocType] = useState<'hotel' | 'cafe' | 'metro' | 'custom'>('hotel');
  const [newLocLat, setNewLocLat] = useState('28.6300');
  const [newLocLng, setNewLocLng] = useState('77.2180');
  const [newLocNotes, setNewLocNotes] = useState('');

  const [offlineDownloaded, setOfflineDownloaded] = useState<boolean>(() => {
    return localStorage.getItem('delhi_offline_pack_downloaded') === 'true';
  });
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);

  // Save to localStorage whenever savedLocations changes
  useEffect(() => {
    try {
      localStorage.setItem('delhi_saved_user_locations', JSON.stringify(savedLocations));
    } catch (e) {
      console.error(e);
    }
  }, [savedLocations]);

  // Calculate distance using Haversine formula
  const getDistanceKm = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return (R * c).toFixed(1);
  };

  // Estimate fair auto fare based on Delhi Transport formula (₹30 first 1.5km, ₹11/km after)
  const getFairAutoFare = (distanceKmStr: string) => {
    const d = parseFloat(distanceKmStr);
    if (d <= 1.5) return '₹30 - ₹40';
    const fare = 30 + (d - 1.5) * 11;
    return `₹${Math.round(fare)} - ₹${Math.round(fare * 1.25)}`;
  };

  // 100% Free, Reliable Tile Layers without API Key Requirement
  const getTileConfig = (style: TileStyle) => {
    switch (style) {
      case 'streets':
        return {
          url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors',
          maxZoom: 19,
        };
      case 'osm':
        return {
          url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
          attribution: '&copy; OpenStreetMap contributors, Humanitarian',
          maxZoom: 19,
        };
      case 'dark':
      default:
        return {
          url: 'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}',
          attribution: 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ',
          maxZoom: 16,
        };
    }
  };

  // Initialize Map immediately on Delhi
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
      return;
    }

    try {
      // Initialize directly centered on Delhi
      const map = L.map(mapContainerRef.current, {
        center: [28.6139, 77.2090], // Central Delhi
        zoom: 12,
        minZoom: 10,
        maxZoom: 18,
        zoomControl: false,
      });

      // Layer groups
      const markersLayer = L.layerGroup().addTo(map);
      const metroLayer = L.layerGroup().addTo(map);
      const userLocsLayer = L.layerGroup().addTo(map);

      markersLayerRef.current = markersLayer;
      metroLayerRef.current = metroLayer;
      userLocationsLayerRef.current = userLocsLayer;

      // Base tile layer
      const config = getTileConfig(tileStyle);
      const tileLayer = L.tileLayer(config.url, {
        attribution: config.attribution,
        maxZoom: config.maxZoom,
      });

      tileLayer.on('tileerror', () => {
        tileLayer.setUrl('https://tile.openstreetmap.org/{z}/{x}/{y}.png');
      });

      tileLayer.addTo(map);
      tileLayerRef.current = tileLayer;

      // Labels layer for Esri dark base
      const labelsLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}',
        { maxZoom: 16 }
      ).addTo(map);
      labelsLayerRef.current = labelsLayer;

      // Allow clicking map to pick coordinates for new custom location
      map.on('click', (e: L.LeafletMouseEvent) => {
        setNewLocLat(e.latlng.lat.toFixed(4));
        setNewLocLng(e.latlng.lng.toFixed(4));
      });

      mapInstanceRef.current = map;

      // Invalidate sizes smoothly
      setTimeout(() => map.invalidateSize(), 150);
      setTimeout(() => map.invalidateSize(), 400);
      setTimeout(() => map.invalidateSize(), 1000);
    } catch (err) {
      console.error('Leaflet initialization error:', err);
    }

    const resizeObserver = new ResizeObserver(() => {
      mapInstanceRef.current?.invalidateSize();
    });

    if (mapContainerRef.current) {
      resizeObserver.observe(mapContainerRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // Update Tile Style
  useEffect(() => {
    if (!tileLayerRef.current || !mapInstanceRef.current) return;
    const config = getTileConfig(tileStyle);
    tileLayerRef.current.setUrl(config.url);

    if (labelsLayerRef.current) {
      if (tileStyle === 'dark') {
        if (!mapInstanceRef.current.hasLayer(labelsLayerRef.current)) {
          labelsLayerRef.current.addTo(mapInstanceRef.current);
        }
      } else {
        if (mapInstanceRef.current.hasLayer(labelsLayerRef.current)) {
          labelsLayerRef.current.remove();
        }
      }
    }
  }, [tileStyle]);

  // Update Metro Tracks
  useEffect(() => {
    if (!metroLayerRef.current || !mapInstanceRef.current) return;
    metroLayerRef.current.clearLayers();

    if (!showMetroTracks) return;

    METRO_TRACKS.forEach((track) => {
      L.polyline(track.coords, {
        color: track.color,
        weight: 4,
        opacity: 0.85,
        dashArray: '8, 6',
      })
        .bindTooltip(`🚇 ${track.name}`, { sticky: true })
        .addTo(metroLayerRef.current!);

      track.coords.forEach(([lat, lng]) => {
        L.circleMarker([lat, lng], {
          radius: 4,
          fillColor: track.color,
          fillOpacity: 1,
          color: '#ffffff',
          weight: 1.5,
        }).addTo(metroLayerRef.current!);
      });
    });
  }, [showMetroTracks]);

  // Render Saved User Locations on Map (Hotels, Cafes, Base)
  useEffect(() => {
    if (!userLocationsLayerRef.current) return;
    const layer = userLocationsLayerRef.current;
    layer.clearLayers();

    savedLocations.forEach((loc) => {
      const isHotel = loc.type === 'hotel';
      const isCafe = loc.type === 'cafe';

      const iconBg = isHotel ? '#8b5cf6' : isCafe ? '#f59e0b' : '#10b981';
      const iconBorder = isHotel ? '#c4b5fd' : isCafe ? '#fde68a' : '#a7f3d0';

      const customMarkerHtml = `
        <div style="position: relative; width: 34px; height: 34px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: ${iconBg}40;
            animation: pulse 2s infinite;
          "></div>
          <div style="
            position: relative;
            width: 28px;
            height: 28px;
            background: ${iconBg};
            border: 2px solid ${iconBorder};
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 14px ${iconBg}aa;
            font-size: 13px;
          ">
            ${isHotel ? '🏨' : isCafe ? '☕' : '📍'}
          </div>
        </div>
      `;

      const markerIcon = L.divIcon({
        className: 'custom-saved-location-marker',
        html: customMarkerHtml,
        iconSize: [34, 34],
        iconAnchor: [17, 17],
      });

      const distFromUser = getDistanceKm(userLocation.lat, userLocation.lng, loc.lat, loc.lng);
      const autoFare = getFairAutoFare(distFromUser);

      const marker = L.marker([loc.lat, loc.lng], { icon: markerIcon });
      marker.bindPopup(`
        <div style="padding: 4px; min-width: 200px; color: #fff; font-family: sans-serif;">
          <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 2px;">
            <span style="font-size: 10px; font-weight: bold; text-transform: uppercase; color: ${iconBg};">Saved Location</span>
            <span style="font-size: 10px; background: rgba(255,255,255,0.15); padding: 1px 5px; border-radius: 4px;">${distFromUser} km from you</span>
          </div>
          <h4 style="margin: 0; font-size: 14px; font-weight: bold; color: #fff;">${loc.name}</h4>
          ${loc.notes ? `<p style="margin: 4px 0 6px 0; font-size: 11px; color: #cbd5e1;">${loc.notes}</p>` : ''}
          <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 4px; font-size: 11px; color: #94a3b8;">
            🛺 <strong>Fair Auto:</strong> ${autoFare}
          </div>
        </div>
      `);

      marker.addTo(layer);
    });
  }, [savedLocations, userLocation]);

  // Update Monument Markers and Route Line
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    const map = mapInstanceRef.current;
    const markersLayer = markersLayerRef.current;
    markersLayer.clearLayers();

    if (routeLineRef.current) {
      routeLineRef.current.remove();
      routeLineRef.current = null;
    }

    const filtered = MONUMENTS_DATA.filter(
      (m) => activeFilter === 'all' || m.category === activeFilter
    );

    filtered.forEach((monument) => {
      const isSelected = monument.id === selectedMonumentId;
      const distance = getDistanceKm(userLocation.lat, userLocation.lng, monument.lat, monument.lng);
      const autoFare = getFairAutoFare(distance);

      const markerHtml = `
        <div style="position: relative; width: 36px; height: 36px; display: flex; align-items: center; justify-content: center; cursor: pointer;">
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 9999px;
            background: ${isSelected ? 'rgba(59, 130, 246, 0.4)' : 'rgba(37, 99, 235, 0.2)'};
            animation: ${isSelected ? 'ping 1.6s cubic-bezier(0, 0, 0.2, 1) infinite' : 'none'};
          "></div>
          <div style="
            position: relative;
            width: ${isSelected ? '32px' : '28px'};
            height: ${isSelected ? '32px' : '28px'};
            background: ${isSelected ? '#2563eb' : '#1e3a8a'};
            border: 2px solid ${isSelected ? '#93c5fd' : '#3b82f6'};
            border-radius: 9999px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 0 16px ${isSelected ? 'rgba(59, 130, 246, 0.9)' : 'rgba(37, 99, 235, 0.5)'};
            transition: all 0.2s ease;
          ">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        className: 'custom-delhi-marker',
        html: markerHtml,
        iconSize: [36, 36],
        iconAnchor: [18, 18],
      });

      const marker = L.marker([monument.lat, monument.lng], { icon: customIcon });

      const popupContent = `
        <div style="padding: 6px; min-width: 230px; font-family: sans-serif; color: #fff;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 4px;">
            <span style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.05em; color: #60a5fa; font-weight: 700;">${monument.category}</span>
            <span style="font-size: 11px; background: rgba(59, 130, 246, 0.2); color: #93c5fd; padding: 2px 6px; border-radius: 4px; font-weight: 700;">${distance} km from you</span>
          </div>
          <h4 style="margin: 0 0 4px 0; font-size: 14px; font-weight: 800; color: #fff;">${monument.name}</h4>
          <p style="margin: 0 0 8px 0; font-size: 11px; color: #cbd5e1; line-height: 1.35;">${monument.summary.slice(0, 90)}...</p>
          <div style="border-top: 1px solid rgba(255,255,255,0.15); padding-top: 6px; margin-bottom: 8px; font-size: 11px; color: #94a3b8; line-height: 1.4;">
            <div>🚇 <strong>Metro:</strong> ${monument.nearestMetro.station} (${monument.nearestMetro.walkingDistance})</div>
            <div>💰 <strong>Ticket:</strong> ₹${monument.entryFee.indian} (Ind) / ₹${monument.entryFee.foreigner} (Foreigner)</div>
            <div>🛺 <strong>Fair Auto:</strong> ${autoFare} from your spot</div>
          </div>
          <button id="btn-inspect-${monument.id}" style="
            width: 100%;
            background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%);
            color: #fff;
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 4px;
            box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
          ">
            <span>Explore Guide &amp; Details</span> &rarr;
          </button>
        </div>
      `;

      marker.bindPopup(popupContent, { maxWidth: 290 });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`btn-inspect-${monument.id}`);
        if (btn) {
          btn.addEventListener('click', () => {
            onSelectMonument(monument);
            map.closePopup();
          });
        }
      });

      marker.addTo(markersLayer);
    });

    // Plot User Location Marker with Glowing Cyan Radar Waves
    if (userMarkerRef.current) {
      userMarkerRef.current.remove();
    }

    const userMarkerHtml = `
      <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 9999px;
          background: rgba(56, 189, 248, 0.35);
          animation: ping 1.8s cubic-bezier(0, 0, 0.2, 1) infinite;
        "></div>
        <div style="
          position: absolute;
          inset: 4px;
          border-radius: 9999px;
          border: 2px solid #38bdf8;
          opacity: 0.7;
          animation: spin 8s linear infinite;
        "></div>
        <div style="
          position: relative;
          width: 22px;
          height: 22px;
          background: #0284c7;
          border: 2.5px solid #ffffff;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 0 20px rgba(56, 189, 248, 1);
        ">
          <div style="width: 7px; height: 7px; background: #ffffff; border-radius: 9999px;"></div>
        </div>
      </div>
    `;

    const userIcon = L.divIcon({
      className: 'custom-user-marker',
      html: userMarkerHtml,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    const userM = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(markersLayer);
    userM.bindPopup(`
      <div style="padding: 4px; font-size: 12px; color: #fff;">
        <strong style="color: #38bdf8; font-size: 13px;">📍 You Are Here:</strong><br/>
        <div style="font-weight: bold; margin-top: 2px;">${userLocation.name}</div>
        <div style="font-size: 11px; color: #94a3b8; margin-top: 2px;">GPS: ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}</div>
      </div>
    `);
    userMarkerRef.current = userM;

    // Draw connecting route line to selected monument if any
    if (selectedMonumentId) {
      const selected = MONUMENTS_DATA.find((m) => m.id === selectedMonumentId);
      if (selected) {
        map.flyTo([selected.lat, selected.lng], 13.5, { duration: 1.2 });

        const routeLine = L.polyline(
          [
            [userLocation.lat, userLocation.lng],
            [selected.lat, selected.lng],
          ],
          {
            color: '#3b82f6',
            weight: 3.5,
            opacity: 0.85,
            dashArray: '6, 6',
          }
        ).addTo(map);

        routeLineRef.current = routeLine;
      }
    }
  }, [activeFilter, userLocation, selectedMonumentId]);

  // "SHOW MY LOCATION" handler with instant smooth animation
  const handleShowMyLocation = useCallback(() => {
    setIsLocating(true);

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          const acc = Math.round(pos.coords.accuracy);

          setUserLocation({
            lat,
            lng,
            name: 'My Real Device GPS Position',
          });
          setLocationAccuracy(`±${acc}m accuracy`);
          setIsLocating(false);

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([lat, lng], 14, { duration: 1.5 });
            // Open user popup after fly
            setTimeout(() => {
              userMarkerRef.current?.openPopup();
            }, 1600);
          }
        },
        (error) => {
          console.warn('Geolocation denied or unavailable, centering on current active location:', error);
          setIsLocating(false);
          // If browser blocks GPS or inside an iframe, gracefully center on current location with nice ripple
          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.2 });
            setTimeout(() => {
              userMarkerRef.current?.openPopup();
            }, 1300);
          }
        },
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 10000 }
      );
    } else {
      setIsLocating(false);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 14, { duration: 1.2 });
        setTimeout(() => {
          userMarkerRef.current?.openPopup();
        }, 1300);
      }
    }
  }, [userLocation]);

  // Add Custom User Location
  const handleSaveCustomLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLocName.trim()) return;

    const lat = parseFloat(newLocLat) || 28.6304;
    const lng = parseFloat(newLocLng) || 77.2177;

    const newLoc: SavedUserLocation = {
      id: `loc-${Date.now()}`,
      name: newLocName.trim(),
      type: newLocType,
      lat,
      lng,
      notes: newLocNotes.trim() || undefined,
    };

    setSavedLocations((prev) => [newLoc, ...prev]);
    setShowAddLocationModal(false);
    setNewLocName('');
    setNewLocNotes('');

    // Fly to newly added location
    mapInstanceRef.current?.flyTo([lat, lng], 14, { duration: 1.2 });
  };

  const handleDeleteLocation = (id: string) => {
    setSavedLocations((prev) => prev.filter((l) => l.id !== id));
  };

  const handleDownloadOfflinePack = () => {
    setDownloadProgress(10);
    const interval = setInterval(() => {
      setDownloadProgress((prev) => {
        if (prev === null) return 20;
        if (prev >= 100) {
          clearInterval(interval);
          setOfflineDownloaded(true);
          localStorage.setItem('delhi_offline_pack_downloaded', 'true');
          localStorage.setItem('delhi_monuments_cache', JSON.stringify(MONUMENTS_DATA));
          setTimeout(() => setDownloadProgress(null), 1200);
          return 100;
        }
        return prev + 25;
      });
    }, 200);
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();
  const handleResetDelhi = () => {
    mapInstanceRef.current?.flyTo([28.6139, 77.2090], 12, { duration: 1 });
  };

  return (
    <div className="relative w-full h-[680px] md:h-[750px] flex flex-col bg-[#070b14] border border-blue-500/20 rounded-3xl overflow-hidden shadow-2xl shadow-black/80">
      {/* Top Map HUD Bar */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Filter Pills */}
        <div className="flex items-center gap-1.5 bg-[#0a0f1d]/90 backdrop-blur-xl p-1.5 rounded-2xl border border-blue-500/25 pointer-events-auto shadow-2xl overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              activeFilter === 'all'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-950 border border-blue-400/40'
                : 'text-zinc-300 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            All Sites ({MONUMENTS_DATA.length})
          </button>
          <button
            onClick={() => setActiveFilter('UNESCO Heritage')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'UNESCO Heritage'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-950 border border-blue-400/40'
                : 'text-zinc-300 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            🏛️ UNESCO Sites
          </button>
          <button
            onClick={() => setActiveFilter('Sacred & Spiritual')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'Sacred & Spiritual'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-950 border border-blue-400/40'
                : 'text-zinc-300 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            🕊️ Sacred Temples
          </button>
          <button
            onClick={() => setActiveFilter('Modern & Civic')}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === 'Modern & Civic'
                ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-950 border border-blue-400/40'
                : 'text-zinc-300 hover:text-white hover:bg-blue-950/40'
            }`}
          >
            🇮🇳 India Gate
          </button>
        </div>

        {/* Right Controls: Style Switcher, My Locations Drawer, Metro Overlay */}
        <div className="flex items-center gap-2 pointer-events-auto flex-wrap justify-end">
          {/* My Saved Locations Button */}
          <button
            onClick={() => setShowLocationsDrawer((prev) => !prev)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#0d1527]/90 backdrop-blur-xl border border-blue-500/30 text-amber-300 hover:bg-blue-950/60 transition-all shadow-lg"
          >
            <Bookmark className="w-3.5 h-3.5 text-amber-400" />
            <span>My Locations ({savedLocations.length})</span>
          </button>

          {/* Add New Custom Location Button */}
          <button
            onClick={() => setShowAddLocationModal(true)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-[#0d1527]/90 backdrop-blur-xl border border-blue-500/30 text-emerald-300 hover:bg-emerald-950/50 transition-all shadow-lg"
            title="Save custom hotel or spot on map"
          >
            <Plus className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Add Spot</span>
          </button>

          {/* Layer switcher */}
          <div className="flex items-center bg-[#0a0f1d]/90 backdrop-blur-xl p-1 rounded-2xl border border-blue-500/25 text-xs shadow-xl">
            <button
              onClick={() => setTileStyle('dark')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                tileStyle === 'dark' ? 'bg-blue-600 text-white shadow-md shadow-blue-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              Midnight Dark
            </button>
            <button
              onClick={() => setTileStyle('streets')}
              className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                tileStyle === 'streets' ? 'bg-blue-600 text-white shadow-md shadow-blue-950' : 'text-zinc-400 hover:text-white'
              }`}
            >
              OSM Streets
            </button>
          </div>

          {/* Metro Lines overlay toggle */}
          <button
            onClick={() => setShowMetroTracks((prev) => !prev)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-lg backdrop-blur-xl ${
              showMetroTracks
                ? 'bg-cyan-950/90 border-cyan-500/60 text-cyan-200'
                : 'bg-[#0d1527]/90 border-blue-500/25 text-zinc-400 hover:border-blue-500'
            }`}
          >
            <Train className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Metro Lines</span>
          </button>

          {/* Offline Toggle */}
          <button
            onClick={onToggleOffline}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-lg backdrop-blur-xl ${
              isOfflineMode
                ? 'bg-amber-600/90 border-amber-400 text-white animate-pulse'
                : 'bg-[#0d1527]/90 border-blue-500/25 text-zinc-200 hover:border-blue-500'
            }`}
          >
            {isOfflineMode ? <WifiOff className="w-3.5 h-3.5" /> : <Compass className="w-3.5 h-3.5 text-blue-400" />}
            <span>{isOfflineMode ? 'Offline Mode' : 'Live Map'}</span>
          </button>
        </div>
      </div>

      {/* Floating Action: Prominent "SHOW MY LOCATION" Radar Button */}
      <div className="absolute right-4 top-20 z-[1000] flex flex-col gap-2 pointer-events-auto">
        <button
          onClick={handleShowMyLocation}
          disabled={isLocating}
          className="group relative flex items-center gap-2 px-3.5 py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-black text-xs shadow-xl shadow-blue-950/90 border border-blue-400/50 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          title="Click to pinpoint and center on your location"
        >
          <div className="relative">
            <Crosshair className={`w-4 h-4 text-white ${isLocating ? 'animate-spin' : 'group-hover:rotate-45 transition-transform'}`} />
            <div className="absolute -inset-1 rounded-full bg-cyan-400/30 animate-ping"></div>
          </div>
          <span className="tracking-wide">{isLocating ? 'Locating...' : 'Show My Location'}</span>
        </button>

        {/* Map Control Buttons */}
        <div className="flex flex-col gap-1.5 bg-[#0a0f1d]/90 backdrop-blur-xl p-1 rounded-xl border border-blue-500/25 shadow-xl self-end">
          <button
            onClick={handleZoomIn}
            className="w-8 h-8 rounded-lg bg-[#0f172a] hover:bg-blue-900/60 text-white flex items-center justify-center transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-8 h-8 rounded-lg bg-[#0f172a] hover:bg-blue-900/60 text-white flex items-center justify-center transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetDelhi}
            className="w-8 h-8 rounded-lg bg-[#0f172a] hover:bg-blue-900/60 text-blue-400 flex items-center justify-center transition-all"
            title="Recenter Central Delhi"
          >
            <LocateFixed className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Leaflet Map View */}
      <div
        ref={mapContainerRef}
        id="delhi-leaflet-map"
        className="w-full h-full min-h-[580px] relative z-0"
      />

      {/* Bottom Floating Bar: My Active Location HUD & Distance Telemetry */}
      <div className="absolute bottom-4 left-4 right-4 z-[1000] pointer-events-none">
        <div className="bg-[#0a0f1d]/95 backdrop-blur-xl border border-blue-500/30 rounded-2xl p-3 shadow-2xl shadow-black flex flex-wrap items-center justify-between gap-3 pointer-events-auto">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
              <span className="text-xs font-bold text-zinc-300">My Location:</span>
            </div>

            <select
              value={userLocation.name}
              onChange={(e) => {
                const found = REFERENCE_POINTS.find((p) => p.name === e.target.value);
                if (found) {
                  setUserLocation(found);
                  mapInstanceRef.current?.flyTo([found.lat, found.lng], 13.5, { duration: 1.2 });
                }
              }}
              className="bg-[#10192d] text-xs font-bold text-cyan-200 border border-blue-500/40 rounded-xl px-3 py-1.5 focus:outline-none focus:border-blue-500"
            >
              {REFERENCE_POINTS.map((pt) => (
                <option key={pt.name} value={pt.name}>
                  {pt.name}
                </option>
              ))}
            </select>

            <button
              onClick={handleShowMyLocation}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-blue-900 to-indigo-900 hover:from-blue-800 hover:to-indigo-800 border border-blue-400/40 text-blue-200 font-bold text-xs flex items-center gap-1.5 shadow-md"
            >
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Pinpoint Me</span>
            </button>
          </div>

          <div className="flex items-center gap-3 text-xs text-zinc-400">
            <span className="flex items-center gap-1.5 text-blue-400 font-bold">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              {MONUMENTS_DATA.length} Monuments Active
            </span>
            <span className="hidden sm:flex items-center gap-1 text-amber-300 font-semibold">
              <Hotel className="w-3.5 h-3.5 text-amber-400" />
              {savedLocations.length} Custom Spots Saved
            </span>
          </div>
        </div>
      </div>

      {/* Slide-out Drawer: "My Saved Locations & Hotel Base" */}
      {showLocationsDrawer && (
        <div className="absolute top-16 right-4 z-[1100] w-80 max-w-[90vw] max-h-[480px] bg-[#090e1a]/98 backdrop-blur-2xl border border-blue-500/40 rounded-3xl p-4 shadow-2xl overflow-y-auto space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-blue-950 pb-2">
            <div className="flex items-center gap-2">
              <Bookmark className="w-4 h-4 text-amber-400" />
              <h4 className="text-sm font-black text-white font-heading">My Saved Locations</h4>
            </div>
            <button
              onClick={() => setShowLocationsDrawer(false)}
              className="p-1 rounded-lg hover:bg-blue-950 text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-zinc-400 leading-normal">
            Pin your hotel, guest house, or favorite cafes in Delhi to calculate exact return routes and fair auto fares.
          </p>

          <div className="space-y-2">
            {savedLocations.map((loc) => {
              const dist = getDistanceKm(userLocation.lat, userLocation.lng, loc.lat, loc.lng);
              const autoFare = getFairAutoFare(dist);
              return (
                <div
                  key={loc.id}
                  className="p-3 rounded-2xl bg-[#0f172a] border border-blue-950 hover:border-blue-500/60 transition-all flex items-start justify-between gap-2 group"
                >
                  <div
                    onClick={() => {
                      mapInstanceRef.current?.flyTo([loc.lat, loc.lng], 14.5, { duration: 1.2 });
                      setShowLocationsDrawer(false);
                    }}
                    className="flex-1 cursor-pointer"
                  >
                    <div className="flex items-center gap-1.5">
                      <span>{loc.type === 'hotel' ? '🏨' : loc.type === 'cafe' ? '☕' : '📍'}</span>
                      <strong className="text-xs text-white group-hover:text-amber-300 transition-colors">
                        {loc.name}
                      </strong>
                    </div>
                    {loc.notes && <p className="text-[11px] text-zinc-400 mt-0.5">{loc.notes}</p>}
                    <div className="text-[10px] text-zinc-500 mt-1 flex items-center gap-2">
                      <span>{dist} km from you</span>
                      <span>&bull;</span>
                      <span className="text-emerald-400 font-bold">{autoFare} auto</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleDeleteLocation(loc.id)}
                    className="p-1.5 rounded-lg text-zinc-500 hover:text-red-400 hover:bg-blue-950/60 transition-colors"
                    title="Remove location"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => {
              setShowLocationsDrawer(false);
              setShowAddLocationModal(true);
            }}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-blue-950"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Another Location</span>
          </button>
        </div>
      )}

      {/* Modal: "Add My Location" */}
      {showAddLocationModal && (
        <div className="fixed inset-0 z-[2500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0a0f1d] border border-blue-500/50 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-blue-950 pb-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-500" />
                <h3 className="text-base font-bold text-white font-heading">Add to My Locations</h3>
              </div>
              <button
                onClick={() => setShowAddLocationModal(false)}
                className="p-1.5 rounded-xl bg-zinc-900 hover:bg-blue-950 text-zinc-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveCustomLocation} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Location Name (e.g. My Hotel, Airbnb, Friend's Place)
                </label>
                <input
                  type="text"
                  required
                  value={newLocName}
                  onChange={(e) => setNewLocName(e.target.value)}
                  placeholder="e.g. Radisson Blu Marina, Connaught Place"
                  className="w-full bg-[#10192d] border border-blue-900/60 rounded-xl px-3.5 py-2.5 text-xs md:text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Category Type
                  </label>
                  <select
                    value={newLocType}
                    onChange={(e) => setNewLocType(e.target.value as any)}
                    className="w-full bg-[#10192d] border border-blue-900/60 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-blue-500"
                  >
                    <option value="hotel">🏨 Hotel / Stay</option>
                    <option value="cafe">☕ Cafe / Dining</option>
                    <option value="metro">🚇 Metro Station</option>
                    <option value="custom">📍 Custom Landmark</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">
                    Auto-Fill Current GPS
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setNewLocLat(userLocation.lat.toFixed(4));
                      setNewLocLng(userLocation.lng.toFixed(4));
                    }}
                    className="w-full py-2 px-2.5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-900/50 text-xs font-semibold text-blue-200"
                  >
                    Use Active Pin
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Latitude</label>
                  <input
                    type="text"
                    value={newLocLat}
                    onChange={(e) => setNewLocLat(e.target.value)}
                    className="w-full bg-[#10192d] border border-blue-900/60 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 mb-1">Longitude</label>
                  <input
                    type="text"
                    value={newLocLng}
                    onChange={(e) => setNewLocLng(e.target.value)}
                    className="w-full bg-[#10192d] border border-blue-900/60 rounded-xl px-3 py-2 text-xs text-white font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 mb-1">
                  Optional Notes (Room number, landmark near gate)
                </label>
                <input
                  type="text"
                  value={newLocNotes}
                  onChange={(e) => setNewLocNotes(e.target.value)}
                  placeholder="e.g. Near Inner Circle Gate 2, Paharganj market entrance"
                  className="w-full bg-[#10192d] border border-blue-900/60 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddLocationModal(false)}
                  className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs text-white font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-xs shadow-lg shadow-blue-950"
                >
                  Save Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
