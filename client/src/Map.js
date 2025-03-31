import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, useMap, GeoJSON } from 'react-leaflet';
import * as L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet icon issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// County layer using direct GeoJSON fetch
function CountyLayer() {
  const map = useMap();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    console.log("Fetching WV county data...");
    
    // GeoJSON fetch
    fetch('https://services.wvgis.wvu.edu/arcgis/rest/services/Boundaries/wv_political_boundary/MapServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=geojson')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log("County data loaded:", data);
        setLoading(false);
        
        // Create counties with more visible styling
        const countyLayer = L.geoJSON(data, {
            style: {
              color: '#6B8EB9',       // Lighter blue for borders
              weight: 1.5,            // Slightly thinner lines
              fillColor: '#A9C6E8',   // Very light blue fill
              fillOpacity: 0.15       // More transparent fill
            },
            onEachFeature: (feature, layer) => {
              const props = feature.properties;
              const countyName = props.County_Name_Modified || props.County_Name;
              if (countyName) {
                layer.bindPopup(`<b>${countyName}</b>`);
                
                // Add hover effects
                layer.on({
                  mouseover: function() {
                    this.setStyle({
                      fillOpacity: 0.4,
                      weight: 2.5,
                      color: '#0056b3'
                    });
                    this.bringToFront();
                  },
                  mouseout: function() {
                    countyLayer.resetStyle(this);
                  },
                  click: function() {
                    map.fitBounds(this.getBounds());
                  }
                });
              }
            }
          }).addTo(map);
          map.fitBounds(countyLayer.getBounds(), {
            padding: [20, 20], //20px padding
            maxZoom: 8         
          });
      })
      
      .catch(err => {
        console.error("Failed to load counties:", err);
        setError(err.message);
        setLoading(false);
        
      });
      
    return () => {
    };
  }, [map]);
  
  return loading ? 
    <div className="map-loading">Loading counties...</div> : 
    error ? 
    <div className="map-error">Error: {error}</div> : 
    null;
}

function WVMap() {
  return (
    <div className="map-container">
      <MapContainer 
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        center={[39.0, -80.25]}
        zoom={7}
        scrollWheelZoom={true}
        minZoom={7}
        maxZoom={10}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <CountyLayer />
      </MapContainer>
    </div>
  );
}

export default WVMap;
export { WVMap };