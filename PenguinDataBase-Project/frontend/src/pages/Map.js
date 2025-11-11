import React, { useEffect, useRef } from 'react';
import { usePenguinContext } from '../context/PenguinContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const Map = () => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const { penguins } = usePenguinContext();

  // Species-based location mapping
  const SPECIES_LOCATIONS = {
    'Emperor': { lat: -66.5, lng: -140, region: 'Ross Sea, Antarctica' },
    'Adélie': { lat: -67.5, lng: -68, region: 'Antarctic Peninsula' },
    'Adelie': { lat: -67.5, lng: -68, region: 'Antarctic Peninsula' },
    'Gentoo': { lat: -64.8, lng: -62.9, region: 'Antarctic Peninsula' },
    'Chinstrap': { lat: -62.2, lng: -58.9, region: 'South Shetland Islands' },
    'Rockhopper': { lat: -54.4, lng: -36.6, region: 'Falkland Islands' },
    'Macaroni': { lat: -54.5, lng: -36.3, region: 'South Georgia' },
    'King': { lat: -54.0, lng: -37.0, region: 'South Georgia' },
    'Royal': { lat: -54.5, lng: 158.9, region: 'Macquarie Island' },
    'African': { lat: -34.0, lng: 18.5, region: 'South Africa' },
    'Magellanic': { lat: -42.5, lng: -64.5, region: 'Patagonia' },
    'Humboldt': { lat: -12.0, lng: -77.0, region: 'Peru/Chile' },
    'Galápagos': { lat: -0.5, lng: -90.5, region: 'Galápagos Islands' },
    'Little Blue': { lat: -41.5, lng: 147.0, region: 'Australia/New Zealand' }
  };

  // Location-based overrides (more specific than species)
  const LOCATION_OVERRIDES = {
    'Ross Sea': { lat: -77.5, lng: 168.0 },
    'McMurdo': { lat: -77.8, lng: 166.7 },
    'Antarctic Peninsula': { lat: -65.0, lng: -64.0 },
    'South Georgia': { lat: -54.5, lng: -36.3 },
    'Falkland Islands': { lat: -51.8, lng: -59.5 },
    'South Shetland Islands': { lat: -62.0, lng: -58.0 },
    'Patagonia': { lat: -45.0, lng: -67.0 },
    'South Africa': { lat: -34.0, lng: 18.5 },
    'Australia': { lat: -42.0, lng: 147.0 },
    'New Zealand': { lat: -46.0, lng: 168.0 },
    'Peru': { lat: -12.0, lng: -77.0 },
    'Chile': { lat: -33.5, lng: -70.5 }
  };

  // Default location for unknown penguins (South Atlantic near Antarctica)
  const DEFAULT_LOCATION = { lat: -60.0, lng: -30.0 };

  /**
   * Get coordinates for a penguin based on species and location
   */
  const getPenguinCoordinates = (penguin) => {
    // First, check if location matches a specific known location
    if (penguin.location) {
      const locationKey = Object.keys(LOCATION_OVERRIDES).find(key => 
        penguin.location.toLowerCase().includes(key.toLowerCase())
      );
      if (locationKey) {
        return [LOCATION_OVERRIDES[locationKey].lat, LOCATION_OVERRIDES[locationKey].lng];
      }
    }

    // Second, check species mapping
    if (penguin.species) {
      const speciesKey = Object.keys(SPECIES_LOCATIONS).find(key => 
        penguin.species.toLowerCase().includes(key.toLowerCase())
      );
      if (speciesKey) {
        return [SPECIES_LOCATIONS[speciesKey].lat, SPECIES_LOCATIONS[speciesKey].lng];
      }
    }

    // Default: Middle of South Atlantic near South Pole
    return [DEFAULT_LOCATION.lat, DEFAULT_LOCATION.lng];
  };

  useEffect(() => {
    // Only initialize map once
    if (mapInstanceRef.current) return;

    // Create map centered on Antarctica
    const map = L.map(mapRef.current).setView([-60.0, -30.0], 3);
    mapInstanceRef.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    // Cleanup function
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update markers when penguins data changes
  useEffect(() => {
    if (!mapInstanceRef.current || !penguins) return;

    const map = mapInstanceRef.current;

    // Clear existing markers (except tile layer)
    map.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Track coordinate usage to detect overlaps
    const coordinateTracker = {};
    
    // First pass: count how many penguins share each coordinate
    penguins.forEach((penguin) => {
      const coordinates = getPenguinCoordinates(penguin);
      const coordKey = `${coordinates[0]},${coordinates[1]}`;
      
      if (!coordinateTracker[coordKey]) {
        coordinateTracker[coordKey] = [];
      }
      coordinateTracker[coordKey].push(penguin);
    });

    // Add markers for each penguin in the database with offset for overlaps
    penguins.forEach((penguin) => {
      console.log('Full penguin object:', JSON.stringify(penguin, null, 2)); // Debug: check ALL data
      
      const coordinates = getPenguinCoordinates(penguin);
      const coordKey = `${coordinates[0]},${coordinates[1]}`;
      const penguinsAtLocation = coordinateTracker[coordKey];
      
      // Calculate offset if multiple penguins at same location
      let finalCoordinates = [...coordinates];
      if (penguinsAtLocation.length > 1) {
        const index = penguinsAtLocation.indexOf(penguin);
        const offsetDistance = 0.3; // degrees offset
        const angle = (360 / penguinsAtLocation.length) * index;
        const angleRad = (angle * Math.PI) / 180;
        
        finalCoordinates[0] += offsetDistance * Math.cos(angleRad);
        finalCoordinates[1] += offsetDistance * Math.sin(angleRad);
      }
      
      const marker = L.marker(finalCoordinates).addTo(map);
      
      // Determine if this is a default location
      const isDefaultLocation = coordinates[0] === DEFAULT_LOCATION.lat && 
                                coordinates[1] === DEFAULT_LOCATION.lng;
      
      // Build popup content - checking if values exist and are displayable
      let popupContent = `
        <div style="color: #eceef3ff; min-width: 200px;">
          <strong style="color: #61dafb; font-size: 16px;">🐧 ${penguin.name || 'Unknown'}</strong><br/>
          <strong>Species:</strong> ${penguin.species || 'Unknown'}<br/>
      `;
      
      // Check location
      if (penguin.location && String(penguin.location).trim() !== '') {
        popupContent += `<strong>Location:</strong> ${penguin.location}<br/>`;
      }
      
      // Check age - allow 0 but not null/undefined
      if (penguin.age !== null && penguin.age !== undefined) {
        popupContent += `<strong>Age:</strong> ${penguin.age} years<br/>`;
      }
      
      // Check weight - allow 0 but not null/undefined
      if (penguin.weight !== null && penguin.weight !== undefined) {
        popupContent += `<strong>Weight:</strong> ${penguin.weight} kg<br/>`;
      }
      
      // Check height - allow 0 but not null/undefined
      if (penguin.height !== null && penguin.height !== undefined) {
        popupContent += `<strong>Height:</strong> ${penguin.height} cm<br/>`;
      }
      
      popupContent += `<strong>Coordinates:</strong> ${coordinates[0].toFixed(2)}°, ${coordinates[1].toFixed(2)}°<br/>`;
      
      if (isDefaultLocation) {
        popupContent += '<em style="color: #ff6b35;">⚠️ Unknown location - default position</em>';
      }
      
      popupContent += '</div>';
      
      marker.bindPopup(popupContent);
    });
  }, [penguins]);

  return (
    <div className="map-page">
      <h2>🐧 Penguin Database Map</h2>
      <p>Interactive map showing locations of penguins in the database ({penguins.length} penguins)</p>
      
      <div className="map-container">
        <div 
          ref={mapRef} 
          style={{ height: '600px', width: '100%', borderRadius: '8px' }}
        />
      </div>
      
      <div className="map-legend">
        <h3>📍 How Location Mapping Works</h3>
        <ul>
          <li>🔵 <strong>Markers show penguins from your database</strong></li>
          <li>📍 <strong>Location Priority:</strong>
            <ul style={{ marginTop: '5px', marginLeft: '20px' }}>
              <li>If penguin has a known location (e.g., "Antarctic Peninsula"), uses that location</li>
              <li>Otherwise, uses typical habitat for the species</li>
              <li>If species/location unknown, placed in South Atlantic near Antarctica ⚠️</li>
            </ul>
          </li>
          <li>💡 <strong>Click markers</strong> to see full penguin details</li>
          <li>🔍 <strong>Zoom and pan</strong> to explore different regions</li>
        </ul>
        
        <h3>🗺️ Supported Species & Regions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
          <div>
            <strong>Antarctica:</strong> Emperor, Adélie, Gentoo, Chinstrap<br/>
            <strong>Sub-Antarctic:</strong> Rockhopper, Macaroni, King, Royal<br/>
            <strong>Temperate:</strong> African, Magellanic
          </div>
          <div>
            <strong>Tropical:</strong> Humboldt, Galápagos<br/>
            <strong>Australia/NZ:</strong> Little Blue<br/>
            <strong>Specific Locations:</strong> Ross Sea, McMurdo, Patagonia, etc.
          </div>
        </div>
      </div>
    </div>
  );
};

export default Map;