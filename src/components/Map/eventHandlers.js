import { findClickedCountry } from './countryProperties';
export const handleMouseEnter = (e) => {
    const layer = e.target;
    layer.setStyle({
        weight: 3,
        color: 'rgba(255, 0, 0, 0.8)',
        fillOpacity: 0.3,
        dashArray: '5, 5',
    });
};

export const handleMouseLeave = (e) => {
    const layer = e.target;
    layer.setStyle({
        weight: 1,
        color: 'white',
        fillOpacity: 1,
        dashArray: null,
    });
};

export const handleMapClick = (e, worldGeoJSON, mapClick, checkAnswer) => {
    if (!mapClick) return;

    const { lat, lng } = e.latlng;
    console.log(`Clicked at latitude: ${lat}, longitude: ${lng}`);

    if (worldGeoJSON) {
        const clickedCountry = findClickedCountry(lat, lng, worldGeoJSON);
        if (clickedCountry) {
            console.log('Clicked country:', clickedCountry.properties.ADMIN);
            checkAnswer(clickedCountry.properties.ADMIN);
        } else {
            console.log('No country found at this location');
        }
    }
};