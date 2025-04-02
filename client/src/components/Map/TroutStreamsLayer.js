import React, { useState, useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';
import * as L from 'leaflet';

function TroutStreamsLayer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const map = useMap();

  // Style by regulation type
  const getStyle = (feature) => {
    const regType = feature.properties.RegType;
    
    // Base style
    const style = {
      weight: 3,
      opacity: 0.8
    };
    
    // Color by regulation type
    switch(regType) {
      case 'Catch-and-Release':
        return { ...style, color: '#0070FF' };
      case 'Children and Class Q':
        return { ...style, color: '#FF9900' };
      case 'Fly Fishing Only':
        return { ...style, color: '#00FF00' };
      case 'Delayed Harvest':
        return { ...style, color: '#9900FF' };
      case 'General':
        return { ...style, color: '#FF3300' };
      default:
        return { ...style, color: '#0070FF' };
    }
  };

  useEffect(() => {
    fetch('http://localhost:3000/layers/trout-streams')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        console.log('Trout stream data received:', data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading trout streams...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return data ? (
    <GeoJSON
      data={data}
      style={getStyle}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;
        const name = props.Name || 'Unnamed stream';
        const regType = props.RegType || 'Unknown';
        const county = props.County_1 || '';
        const nearCity = props.NearCity || '';
        
        // Create rich popup with stream information
        layer.bindPopup(`
          <div class="stream-popup">
            <h3>${name}</h3>
            <p><strong>Regulation:</strong> ${regType}</p>
            ${county ? `<p><strong>County:</strong> ${county}</p>` : ''}
            ${nearCity ? `<p><strong>Near:</strong> ${nearCity}</p>` : ''}
            ${props.StockExtent ? `<p><strong>Stocking Area:</strong> ${props.StockExtent}</p>` : ''}
          </div>
        `);
        
        // Highlight on hover
        layer.on({
          mouseover: function() {
            this.setStyle({ weight: 5, opacity: 1.0 });
            this.bringToFront();
          },
          mouseout: function() {
            this.setStyle(getStyle(feature));
          }
        });
      }}
    />
  ) : null;
}

export default TroutStreamsLayer;