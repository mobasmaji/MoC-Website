import L from "leaflet";

export interface CustomMarkerOptions extends L.MarkerOptions {
    customId?: string;
    type?: string;
    description?: string;
    owner?: string;
}
export class CustomMarker extends L.Marker {
    constructor(latlng: L.LatLngExpression, options?: CustomMarkerOptions) {
        super(latlng, options);
    }
}