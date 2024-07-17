export const getCountrySize = (countryPolygon) => {
    const bounds = countryPolygon.getBounds();
    const southWest = bounds.getSouthWest();
    const northEast = bounds.getNorthEast();

    const latDiff = Math.abs(southWest.lat - northEast.lat);
    const lngDiff = Math.abs(southWest.lng - northEast.lng);
    const areaKm2 = latDiff * lngDiff * 111.32 * 111.32;

    return areaKm2;
};

export const calculateZoomLevel = (countryPolygon) => {
    const countrySize = getCountrySize(countryPolygon);
    let zoomLevel = 2;
    if (countrySize > 1500000) {
        zoomLevel = 2;
    } else if (countrySize > 500000) {
        zoomLevel = 3;
    } else {
        zoomLevel = 4;
    }
    return zoomLevel;
};

export const findClickedCountry = (lat, lng, currentWorldGeoJSON) => {
    console.log("WorldGeoJSON", currentWorldGeoJSON);
    let clickedCountry = null;
    currentWorldGeoJSON.eachLayer((layer) => {
        if (clickedCountry) return;
        if (layer.feature && layer.feature.geometry) {
            const { geometry } = layer.feature;
            if (geometry.type === 'Polygon') {
                if (isPointInPolygon([lng, lat], geometry.coordinates[0])) {
                    clickedCountry = layer.feature;
                }
            } else if (geometry.type === 'MultiPolygon') {
                geometry.coordinates.forEach(polygon => {
                    if (isPointInPolygon([lng, lat], polygon[0])) {
                        clickedCountry = layer.feature;
                    }
                });
            }
        }
    });
    return clickedCountry;
};

const isPointInPolygon = (point, vs) => {
    const x = point[0], y = point[1];
    let inside = false;
    for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const xi = vs[i][0], yi = vs[i][1];
        const xj = vs[j][0], yj = vs[j][1];
        const intersect = ((yi > y) !== (yj > y))
            && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
        if (intersect) inside = !inside;
    }
    return inside;
};

