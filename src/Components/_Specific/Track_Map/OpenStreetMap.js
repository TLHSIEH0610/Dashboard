import React, { useEffect } from "react";
import { Map, Marker, Popup, TileLayer, Polyline } from "react-leaflet";
import styles from "./track_map.module.scss";
import MarkerClusterGroup from "react-leaflet-markercluster";
// import { Card } from "antd";
import useURLloader from "../../../hook/useURLloader";
import { Icon } from "leaflet";
import { Tag } from 'antd'

const alarm = new Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [35, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const normal = new Icon({
  iconUrl:
    "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
  iconSize: [35, 50],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const OpenStreetMapC = ({ centerPosition, currentZoom, coordinates, PolylineData }) => {
  const TrackUrl = "/api/track.json";
  const [Trackloading, Trackresponse] = useURLloader(TrackUrl);
  // const [coordinate, setCoordinate] = useState(null); //當日單點座標




  useEffect(() => {
    if (Trackresponse) {
      console.log(Trackresponse);
      // setCoordinate(Trackresponse[Object.keys(Trackresponse)[0]].position);
      console.log(Trackresponse[Object.keys(Trackresponse)[0]].position);
    }
  }, [Trackresponse]);



  return (
    
      <Map
        // ref={mapRef}
        center={centerPosition}
        zoom={currentZoom}
        className={styles.leafletContainer}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />

      {PolylineData && <Polyline positions={PolylineData}/> } 

        <MarkerClusterGroup
          disableClusteringAtZoom={18}
          removeOutsideVisibleBounds={true}
        >
          {coordinates && coordinates.map((item, index) => (
              <Marker key={index} position={[item.lat, item.lng]} icon={item.health==='up'? normal : alarm}>
                <Popup
                >
                   <Tag color={item.health==='up'? 'green' : 'red' }>Health: {item.health}</Tag>
                  <br />
                  <br />
                  <Tag color={item.strength==='up'? 'green' : 'red' }>Singnal:  {item.strength}</Tag>
                </Popup>
              </Marker>
            ))}
        </MarkerClusterGroup>
      </Map>
   
  );
};

export default OpenStreetMapC;
