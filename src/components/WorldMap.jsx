// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WorldMap = ({ selectedCountry }) => {
  // selectedCountry = 'Solomon Islands';
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [worldGeoJSON, setWorldGeoJSON] = useState(null);
  const currentCountryRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        zoomControl: false,
        dragging: false,
        touchZoom: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        boxZoom: false,
        keyboard: false,
      }).setView([0, 0], 1);

      const oceanStyle = {
        fillColor: '#A8E1FF',
        fillOpacity: 1,
        color: '#A8E1FF',
        weight: 1
      };

      const oceanGeoJSON = {
        type: 'FeatureCollection',
        features: [{
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'Polygon',
            coordinates: [[
              [-180, -90],
              [180, -90],
              [180, 90],
              [-180, 90],
              [-180, -90]
            ]]
          }
        }]
      };

      L.geoJSON(oceanGeoJSON, { style: oceanStyle }).addTo(mapInstanceRef.current);

      fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
        .then(response => response.json())
        .then(data => {
          const geoJSONLayer = L.geoJSON(data, {
            style: feature => {
              const randomColor = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 100)}, 0.5)`;

              return {
                fillColor: randomColor,
                fillOpacity: 1,
                color: 'white',
                weight: 1
              };
            }
          }).addTo(mapInstanceRef.current);
          setWorldGeoJSON(geoJSONLayer);
        });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (selectedCountry && worldGeoJSON) {
      markCountry();
    }
  }, [selectedCountry, worldGeoJSON]);

  const markCountry = () => {
    if (!worldGeoJSON) return;

    if (currentCountryRef.current) {
      currentCountryRef.current.setStyle({ fillColor: 'white' });
    }

    const countries = worldGeoJSON.getLayers();
    const foundCountry = countries.find(country =>
      country.feature.properties.ADMIN.toLowerCase() === selectedCountry.toLowerCase()
    );

    console.log(foundCountry);
    if (foundCountry) {
      currentCountryRef.current = foundCountry;
      currentCountryRef.current.setStyle({ fillColor: 'red' });
      mapInstanceRef.current.fitBounds(currentCountryRef.current.getBounds(), { padding: [15, 15], maxZoom: 4 });
    } else {
      console.warn(`Country not found: ${selectedCountry}`);
      mapInstanceRef.current.setView([0, 0], 1);
    }
  };

  return (
    <div
      ref={mapRef}
      style={{ height: '500px', width: '500px', backgroundColor: '#f0f0f0' }}>
    </div>
  );
};

export default WorldMap;