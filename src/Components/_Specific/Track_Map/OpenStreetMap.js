import React, { useEffect, useState }  from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import styles from "./track_map.module.scss";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Card } from 'antd'
import useURLloader from "../../../hook/useURLloader";

const OpenStreetMapC = ({ centerPosition, currentZoom } ) => {
  const TrackUrl = '/api/track.json'
  const [Trackloading, Trackresponse] = useURLloader(TrackUrl);
  const [coordinate, setCoordinate] = useState(null); //當日單點座標


  useEffect(() => {
    if (Trackresponse) {
      console.log(Trackresponse);
      setCoordinate(Trackresponse[Object.keys(Trackresponse)[0]].position);
      console.log(Trackresponse[Object.keys(Trackresponse)[0]].position)
    }
  }, [Trackresponse]);
  
  return (
    <Card loading={Trackloading} style={{width:'50%'}}>
    <Map
      center={centerPosition}
      zoom={currentZoom}
      className={styles.leafletContainer}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup
        disableClusteringAtZoom={18}
        removeOutsideVisibleBounds={true}
      >
        {coordinate && coordinate.map((item, index) => (
          <Marker key={index} position={[item.lat, item.lng]}>
            <Popup>
              {item.health}
              <br />
              {item.strength}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </Map>
    </Card>
  );
};

export default OpenStreetMapC;
