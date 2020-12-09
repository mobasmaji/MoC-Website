
import L, { MarkerOptions, Marker } from "leaflet";

export interface CustomMarkerOptions extends MarkerOptions {
    customId?: string;
    type?: string;
    description?: string;
    owner?: string;
}
export class CustomMarker extends Marker {
    constructor(latlng: L.LatLngExpression, options?: CustomMarkerOptions) {
        super(latlng, options);
    }
    getCustomId() {
        return (this.options as CustomMarkerOptions).customId;
    }
}