import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import * as R from "ramda";

import SearchableListOfPoints from "./SearchableListOfPoints";
import useMovingPoints from "./useMovingPoints";
import useMediaQuery from "./useMediaQuery";

const styles = {
  container: (isXlDevice) => ({
    maxHeight: isXlDevice ? "440px" : "none",
  }),
};

function App() {
  const mapRef = React.useRef();

  const [points, setPoints] = React.useState([]);

  useMovingPoints(setPoints);

  const isXlDevice = useMediaQuery("(min-width: 1200px)");

  return (
    <div className="py-5 container">
      <h1>Vehicle tracking system</h1>
      <div
        className="d-flex flex-column flex-xl-row"
        style={styles.container(isXlDevice)}
      >
        <MapContainer
          center={[54.410819542025166, 18.574078308688073]}
          zoom={11}
          scrollWheelZoom
          style={{ width: "100%", height: "480px" }}
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
                  <Popup>ID: {id}</Popup>
                </Marker>
              ),
              points
            )}
          </MarkerClusterGroup>
        </MapContainer>

        <div className="mt-5 mt-xl-0 ms-xl-2 ">
          <SearchableListOfPoints
            points={points}
            onPointClick={(position) => mapRef.current.flyTo(position, 15)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
