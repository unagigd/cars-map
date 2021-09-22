import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import * as R from "ramda";
import faker from "faker";
import ShortUniqueId from "short-unique-id";

const uid = new ShortUniqueId({ length: 6 });

const fakeData = R.map(
  () => ({
    id: uid(),
    coordinate: [
      faker.address.latitude(54.5394, 54.4024),
      faker.address.longitude(18.5432, 18.4783),
    ],
  }),
  R.range(0, 100)
);

function App() {
  const mapRef = React.useRef();

  return (
    <div className="App">
      <MapContainer
        center={[54.410819542025166, 18.574078308688073]}
        zoom={11}
        scrollWheelZoom={false}
        style={{ width: "640px", height: "480px" }}
        whenCreated={(map) => (mapRef.current = map)}
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
          url="https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
        />
        <MarkerClusterGroup>
          {R.map(
            ({ id, coordinate }) => (
              <Marker position={coordinate} key={id}>
                <Popup>My ID: {id}</Popup>
              </Marker>
            ),
            fakeData
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default App;
