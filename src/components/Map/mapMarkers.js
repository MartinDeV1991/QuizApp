import L from 'leaflet';
import { calculateZoomLevel } from './countryProperties';

export const initializeMap = (mapElement) => {
    return L.map(mapElement, {
      touchZoom: false,
      doubleClickZoom: false,
      boxZoom: false,
      keyboard: false,
    }).setView([0, 0], 1);
  };

export const markOcean = (mapInstance) => {
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

    L.geoJSON(oceanGeoJSON, { style: oceanStyle }).addTo(mapInstance);
}

export const fetchAndAddCountries = (mapInstance, setWorldGeoJSON, handleMouseEnter, handleMouseLeave) => {
    const countryStyle = () => {
      const randomColor = `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 100)}, 0.5)`;
      return {
        fillColor: randomColor,
        fillOpacity: 1,
        color: 'white',
        weight: 1
      };
    };
  
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(response => response.json())
      .then(data => {
        console.log(new Date())
        console.log(data)
        const geoJSONLayer = L.geoJSON(data, {
          style: countryStyle,
          onEachFeature: (feature, layer) => {
            layer.on({
              mouseover: handleMouseEnter,
              mouseout: handleMouseLeave,
            });
          }
        }).addTo(mapInstance);
        console.log(geoJSONLayer)
        setWorldGeoJSON(geoJSONLayer);
      })
      .catch(error => console.error('Error fetching country data:', error));
  };

export const markCountry = (selectedCountry, worldGeoJSON, currentCountryRef, mapInstanceRef, showArrow, arrowMarkerRef) => {
    if (!worldGeoJSON) return;

    if (currentCountryRef.current) {
        currentCountryRef.current.setStyle({ fillColor: `rgba(${Math.floor(Math.random() * 100)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 100)}, 0.5)` });
    }

    const countries = worldGeoJSON.getLayers();
    const foundCountry = countries.find(country =>
        country.feature.properties.ADMIN.toLowerCase() === selectedCountry.toLowerCase()
    );

    if (foundCountry) {
        currentCountryRef.current = foundCountry;
        currentCountryRef.current.setStyle({ fillColor: 'red' });
        mapInstanceRef.current.fitBounds(currentCountryRef.current.getBounds(), { padding: [50, 50], maxZoom: calculateZoomLevel(currentCountryRef.current), animate: false });

        if (showArrow) {
            addArrowMarker(foundCountry, mapInstanceRef.current, arrowMarkerRef);
        }
    } else {
        console.warn(`Country not found: ${selectedCountry}`);
        mapInstanceRef.current.setView([0, 0], 1);
    }
};


export const addArrowMarker = (foundCountry, mapInstance, arrowMarkerRef) => {
    const countryBounds = foundCountry.getBounds();
    const countryCenter = countryBounds.getCenter();
    const arrowIcon = L.divIcon({
        className: 'custom-arrow-icon',
        iconSize: [50, 50],
        iconAnchor: [25, 50],
    });
    arrowMarkerRef.current = L.marker(countryCenter, { icon: arrowIcon }).addTo(mapInstance);
};

export const removeArrowMarker = (arrowMarkerRef) => {
    if (arrowMarkerRef.current) {
        arrowMarkerRef.current.remove();
        arrowMarkerRef.current = null;
    }
};