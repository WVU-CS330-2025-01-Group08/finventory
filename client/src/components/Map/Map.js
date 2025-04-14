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

  // Add state for cached data
  const [countiesData, setCountiesData] = useState(null);
  const [troutStreamsData, setTroutStreamsData] = useState(null);
  
  // Track loading state
  const [loading, setLoading] = useState({
    counties: false,
    troutStreams: false
  });
  
  // Fetch county data if not already cached
  useEffect(() => {
    if (showCounties && !countiesData) {
      setLoading(prev => ({ ...prev, counties: true }));
      
      fetch('http://localhost:3000/layers/counties')
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch counties');
          return response.json();
        })
        .then(data => {
          setCountiesData(data);
          setLoading(prev => ({ ...prev, counties: false }));
        })
        .catch(error => {
          console.error('Error fetching counties:', error);
          setLoading(prev => ({ ...prev, counties: false }));
        });
    }
  }, [showCounties, countiesData]);
  
  // Fetch trout streams data if not already cached
  useEffect(() => {
    if (showTroutStreams && !troutStreamsData) {
      setLoading(prev => ({ ...prev, troutStreams: true }));
      
      fetch('http://localhost:3000/layers/trout-streams')
        .then(response => {
          if (!response.ok) throw new Error('Failed to fetch trout streams');
          return response.json();
        })
        .then(data => {
          setTroutStreamsData(data);
          setLoading(prev => ({ ...prev, troutStreams: false }));
        })
        .catch(error => {
          console.error('Error fetching trout streams:', error);
          setLoading(prev => ({ ...prev, troutStreams: false }));
        });
    }
  }, [showTroutStreams, troutStreamsData]);
  
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
          {loading.counties && <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>Loading...</span>}
        </label>
        <label className="control-item">
          <input 
            type="checkbox" 
            checked={showTroutStreams} 
            onChange={() => setShowTroutStreams(!showTroutStreams)}
          />
          Show Trout Streams
          {loading.troutStreams && <span style={{ marginLeft: '5px', fontSize: '0.8em' }}>Loading...</span>}
        </label>
      </div>
      
      <MapContainer 
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
        {showCounties && countiesData && <CountyLayer data={countiesData} />}
        <MapBoundaries />
        {showTroutStreams && troutStreamsData && <TroutStreamsLayer data={troutStreamsData} />}
      </MapContainer>
    </div>
  );
}

export default WVMap;
export { WVMap };