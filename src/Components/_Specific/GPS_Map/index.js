import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import styles from "./Map.module.scss";
import GoogleMapReact from "google-map-react";
import MarkerClusterer from "@google/markerclusterer";
import { Card } from "antd";

const Map = () => {
  let center = {
    lat: 24.77393981790647,
    lng: 121.0090720653534,
  };
  let zoom = 8;
  const [locations, setLocation] = useState([
    {
      lat: "",
      lng: "",
    },
  ]);

  useEffect(() => {
    axios.get("/api/location.json").then((res) => {
      setLocation(res.data);
    });
    const script = document.createElement("script");
    script.src =
      "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js";
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const setGoogleMapRef = (map, maps) => {
    let markers = locations.map((item) => {
      return new maps.Marker({ position: item, label: "", map: map });
    });

    new MarkerClusterer(map, markers, {
      imagePath:
        "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m",
      gridSize: 10,
      minimumClusterSize: 2,
    });

    let geodesicPolyline = new maps.Polyline({
      path: locations,
      geodesic: true,
      strokeColor: "#FF0000",
      strokeOpacity: 1.0,
      strokeWeight: 2,
    });
    geodesicPolyline.setMap(map);
  };

  return (
    <Fragment>
      <Card className={styles.Card}>
        <GoogleMapReact
          style={{ height: "50vh", width: "50%" }}
          bootstrapURLKeys={{
            key: `https://maps.google.com/maps/api/js?key=AIzaSyAM0qzn6FVfsv0hvMOEn6ciTMK8at2n9fw`,
            libraries: ["Polyline", "Marker"],
          }}
          defaultCenter={center}
          defaultZoom={zoom}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => setGoogleMapRef(map, maps)}
          options={{ gestureHandling: "greedy", streetViewControl: true }}
        ></GoogleMapReact>
      </Card>
    </Fragment>
  );
};

export default Map;
