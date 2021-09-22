import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import * as R from "ramda";

function App() {
  const mapRef = React.useRef();

  const [points, setPoints] = React.useState([]);

  React.useEffect(() => {
    const sse = new EventSource("http://localhost:3002/points");

    sse.onmessage = (e) => {
      setPoints(JSON.parse(e.data));
    };

    sse.onerror = () => {
      sse.close();
    };
    return () => {
      sse.close();
    };
  }, []);

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
            ({ id, position }) => (
              <Marker position={position} key={id}>
                <Popup>My ID: {id}</Popup>
              </Marker>
            ),
            points
          )}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default App;
