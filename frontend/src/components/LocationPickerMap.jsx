import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import { MapPin, Crosshair } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
      map.flyTo(e.latlng, map.getZoom());
    },
  });

  return position === null ? null : (
    <Marker
      draggable={true}
      eventHandlers={{
        dragend: (e) => {
          const marker = e.target;
          const pos = marker.getLatLng();
          setPosition(pos);
          map.flyTo(pos, map.getZoom());
        },
      }}
      position={position}
    ></Marker>
  );
}

function ChangeView({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, map.getZoom());
    }
  }, [center, map]);
  return null;
}

export default function LocationPickerMap({ position, onChange }) {
  // Default to somewhere, e.g. London or New York. Let's do a central coordinate.
  const [mapCenter, setMapCenter] = useState([40.7128, -74.0060]); 

  useEffect(() => {
    if (position && position.lat && position.lng) {
      setMapCenter([position.lat, position.lng]);
    }
  }, [position]);

  const handleLocateMe = (e) => {
    e.preventDefault();
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          const newPos = { lat: latitude, lng: longitude };
          onChange(newPos);
          setMapCenter([latitude, longitude]);
        },
        (err) => {
          console.error("Error getting location", err);
          alert("Could not get your location. Please check permissions.");
        }
      );
    } else {
      alert("Geolocation is not supported by your browser");
    }
  };

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-between items-center">
        <label className="text-xs font-syne font-bold tracking-wider text-[#2d5a34] uppercase flex items-center gap-2">
          <MapPin size={14} /> Map Location
        </label>
        <button
          type="button"
          onClick={handleLocateMe}
          className="flex items-center gap-1 text-[10px] font-syne font-bold text-[#4a9e5c] hover:bg-[#e8f5ea] px-2 py-1 rounded-md transition-colors"
        >
          <Crosshair size={12} /> Locate Me
        </button>
      </div>
      <div className="h-[250px] w-full rounded-xl overflow-hidden border border-[#c8e6cc] shadow-sm relative" style={{ zIndex: 0 }}>
        <MapContainer
          center={mapCenter}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%', zIndex: 0 }}
        >
          <ChangeView center={mapCenter} />
          <TileLayer
            attribution='&amp;copy <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={onChange} />
        </MapContainer>
        {!position && (
          <div className="absolute inset-0 z-[1000] pointer-events-none flex items-center justify-center">
            <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-[#e0f0e3] text-xs font-syne text-[#2d5a34] font-bold animate-pulse">
              Click on the map to pin your salon location
            </div>
          </div>
        )}
      </div>
      {position && (
        <p className="text-[10px] text-[#6aaa7a] font-syne flex items-center gap-1">
          <MapPin size={10} /> Selected coordinates: {position.lat.toFixed(4)}, {position.lng.toFixed(4)}
        </p>
      )}
    </div>
  );
}
