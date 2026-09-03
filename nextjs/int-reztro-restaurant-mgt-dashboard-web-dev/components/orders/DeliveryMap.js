"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function DeliveryMap({ mapPosition }) {
    return (
        <MapContainer
            center={mapPosition}
            zoom={15}
            scrollWheelZoom={true}
            style={{ height: "100%", width: "100%" }}
            key={`${mapPosition[0]}-${mapPosition[1]}`}
        >
            <TileLayer
                attribution='&copy; OpenStreetMap'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Marker position={mapPosition}>
                <Popup>Delivery Location</Popup>
            </Marker>
        </MapContainer>
    );
}