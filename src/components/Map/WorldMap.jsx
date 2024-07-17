import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { initializeMap, markOcean, fetchAndAddCountries, markCountry, removeArrowMarker } from './mapMarkers';
import { handleMouseEnter, handleMouseLeave, handleMapClick } from './eventHandlers';

import './worldMap.css';

const WorldMap = ({ selectedCountry, showArrow, checkAnswer, mapClick }) => {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [worldGeoJSON, setWorldGeoJSON] = useState(null);
  const currentCountryRef = useRef(null);
  const arrowMarkerRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = initializeMap(mapRef.current);
      markOcean(mapInstanceRef.current);
      fetchAndAddCountries(mapInstanceRef.current, setWorldGeoJSON, handleMouseEnter, handleMouseLeave);
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapInstanceRef.current || !worldGeoJSON) return;

    if (selectedCountry && !mapClick) {
      removeArrowMarker(arrowMarkerRef);
      markCountry(selectedCountry, worldGeoJSON, currentCountryRef, mapInstanceRef, showArrow, arrowMarkerRef);
    }

    const clickHandler = (e) => handleMapClick(e, worldGeoJSON, mapClick, checkAnswer);
    mapInstanceRef.current.on('click', clickHandler);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.off('click', clickHandler);
      }
    };
  }, [selectedCountry, worldGeoJSON, mapClick, showArrow, checkAnswer]);

  return (
    <div
      ref={mapRef}
      className="world-map"
    />
  );
};

export default WorldMap;