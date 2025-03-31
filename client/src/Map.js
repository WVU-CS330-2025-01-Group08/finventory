import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import 'leaflet/dist/leaflet.css';

// Fix the Leaflet icon issue in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// ArcGIS feature layer component
function FeatureLayer() {
  const map = useMap();
  
  useEffect(() => {
    // WV County Boundaries Feature Service URL
    const countyLayer = esri.featureLayer({
      url: 'https://services.arcgis.com/BG6nSlhZSAWtExvp/arcgis/rest/services/WV_County_Boundaries/FeatureServer/0',
      style: function() {
        return {
          color: '#3388ff',
          weight: 2,
          fillOpacity: 0.1
        };
      }
    }).addTo(map);

    // Add popup with county name
    countyLayer.bindPopup(function(layer) {
      return `<b>${layer.feature.properties.NAME} County</b>`;
    });

    // Fit bounds to WV
    map.setView([38.9, -80.5], 7);
    
    return () => {
      map.removeLayer(countyLayer);
    };
  }, [map]);
  
  return null;
}

function WVMap() {
  return (
    <div className="map-container">
      <MapContainer 
        style={{ height: '400px', width: '100%', borderRadius: '8px' }}
        center={[38.9, -80.5]} 
        zoom={7} 
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FeatureLayer />
      </MapContainer>
    </div>
  );
}

export default WVMap;