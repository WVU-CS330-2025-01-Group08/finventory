import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import CountyLayer from './CountyLayer';
import TroutStreamsLayer from './TroutStreamsLayer';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Sets the map boundaries to these two corners
const WV_BOUNDS = [
  [37.2, -82.6], // Southwest corner
  [40.6, -77.7]  // Northeast corner
];

function MapBoundaries() {
  const map = useMap();
  
  useEffect(() => {
    // Set hard bounds
    map.setMaxBounds(WV_BOUNDS);
    
    // Make bounds "sticky" - 1.0 means maximum stickiness
    map.options.maxBoundsViscosity = 1.0;
    
    // Disable world wrapping (prevents scrolling to see the same map repeated)
    map.options.worldCopyJump = false;
    map.options.continuousWorld = true;
    
    return () => {
      // Cleanup if component unmounts
      map.setMaxBounds(null);
    };
  }, [map]);
  
  return null;
}

function WVMap() {
  const [showTroutStreams, setShowTroutStreams] = useState(false);
  const [showCounties, setShowCounties] = useState(true); // Default to true
  
  return (
    <div className="map-container">
      <div className="map-controls">
        <label className="control-item">
          <input 
            type="checkbox" 
            checked={showCounties} 
            onChange={() => setShowCounties(!showCounties)}
          />
          Show Counties
        </label>
        <label className="control-item">
          <input 
            type="checkbox" 
            checked={showTroutStreams} 
            onChange={() => setShowTroutStreams(!showTroutStreams)}
          />
          Show Trout Streams
        </label>
      </div>
      
      <MapContainer 
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        center={[39.0, -80.25]}
        zoom={7}
        scrollWheelZoom={true}
        minZoom={7}
        maxZoom={10}
        maxBounds={WV_BOUNDS}
        maxBoundsViscosity={1.0}
        worldCopyJump={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {showCounties && <CountyLayer />}
        <MapBoundaries />
        {showTroutStreams && <TroutStreamsLayer />}
      </MapContainer>
    </div>
  );
}

export default WVMap;
export { WVMap };