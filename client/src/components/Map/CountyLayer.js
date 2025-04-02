import React, { useState, useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';

function CountyLayer() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const map = useMap();
  
  // Simple styling without hover effects
  const countyStyle = {
    color: '#6B8EB9',
    weight: 1.5,
    fillColor: '#A9C6E8',
    fillOpacity: 0.1, 
  };
  
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
        setLoading(false);
      })
      .catch((err) => {
        setError(err);
        setLoading(false);
      });
  }, []);

  if (loading) return null; 
  if (error) return null;

  return data ? (
    <GeoJSON
      data={data}
      style={countyStyle}
      interactive={false} // County layer is now NOT interactive
    />
  ) : null;
}

export default CountyLayer;