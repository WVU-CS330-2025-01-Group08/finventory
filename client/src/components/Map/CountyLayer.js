import React, { useState, useEffect } from 'react';
import { GeoJSON, useMap } from 'react-leaflet';

function CountyLayer({ data }) {   
  const map = useMap();
  
  // Simple styling without hover effects, right now no county names displayed
  const countyStyle = {
    color: '#6B8EB9',
    weight: 1.5,
    fillColor: '#A9C6E8',
    fillOpacity: 0.1, 
  };
  
  return (
    <GeoJSON
      data={data}
      style={countyStyle}
      interactive={false}
    />
  );
}

export default CountyLayer;