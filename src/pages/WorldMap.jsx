// @ts-ignore
import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const WorldMap = ({selectedCountry}) => {
  const [score, setScore] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [answer, setAnswer] = useState('');
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const worldGeoJSONRef = useRef(null);
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

      fetch('https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json')
        .then(response => response.json())
        .then(data => {
          worldGeoJSONRef.current = L.geoJSON(data, {
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
          nextQuestion();
        });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const nextQuestion = () => {
    if (!worldGeoJSONRef.current) return;

    if (currentCountryRef.current) {
      currentCountryRef.current.setStyle({ fillColor: 'white' });
    }
    const countries = worldGeoJSONRef.current.getLayers();
    const selectedCountry = 'Poland';
    const countryData = countries.find(country => country.feature.properties.name === selectedCountry);
    currentCountryRef.current = countryData
    currentCountryRef.current.setStyle({ fillColor: 'red' });

    mapInstanceRef.current.fitBounds(currentCountryRef.current.getBounds(), { padding: [150, 150], maxZoom: 4 });

    setAnswer('');
    setFeedback('');
  };

  const checkAnswer = () => {
    if (!currentCountryRef.current) return;

    const userAnswer = answer.toLowerCase();
    const correctAnswer = currentCountryRef.current.feature.properties.name.toLowerCase();

    if (userAnswer === correctAnswer) {
      setScore(prevScore => prevScore + 1);
      setFeedback('Correct!');
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctAnswer}.`);
    }

    setTimeout(nextQuestion, 2000);
  };

  return (
    <div>
      <div ref={mapRef} style={{ height: '1000px', width: '1000px', backgroundColor: '#f0f0f0' }}></div>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Country name"
      />
      <button onClick={checkAnswer}>Submit</button>
      <div>{feedback}</div>
      <div>Score: {score}</div>
    </div>
  );
};

export default WorldMap;