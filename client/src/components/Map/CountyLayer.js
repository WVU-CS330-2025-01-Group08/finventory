import React, { useState, useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';

function CountyLayer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const map = useMap();
  const originalStyle = {
    color: '#6B8EB9',
    weight: 1.5,
    fillColor: '#A9C6E8',
    fillOpacity: 0.15,
  }
  useEffect(() => {
    fetch('http://localhost:3000/layers/counties')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        setData(data);
        console.log('County data received:', data); // Add this line
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading counties...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return data ? (
    <GeoJSON
      data={data}
      style={originalStyle}
      onEachFeature={(feature, layer) => {
        const props = feature.properties;
        const countyName = props.County_Name_Modified || props.County_Name;
        if (countyName) {
          layer.bindPopup(`<b>${countyName}</b>`);
          layer.on({
            mouseover: function () {
              this.setStyle({ fillOpacity: 0.4, weight: 2.5, color: '#0056b3' });
              this.bringToFront();
            },
            mouseout: () => {
              console.log('Layer object:', layer);
              layer.setStyle(originalStyle); // Pass layer as argument
            },
            click: function () {
              map.fitBounds(this.getBounds());
            },
          });
        }
      }}
    />
  ) : null;
}

export default CountyLayer;