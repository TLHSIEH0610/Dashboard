import React, { useEffect, useState, useContext, Fragment } from "react";
import styles from "../dashboard.module.scss";
import useURLloader from "../../../../hook/useURLloader";
import { Card, Spin } from "antd";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
import { Icon } from "leaflet";
import Context from "../../../../Utility/Reduxx";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

interface Igpslist{
    latitude: number;
    longitude: number;
    id: string;
    name: string;
    health: string;
    sim: string;
    lastUpdate: number;
}

export const MapIcon = (status:string) => {
  return(
    new Icon({
      iconUrl:
      status === 'alarm' ? "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png" : "https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
      shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png",
      iconSize: [35, 50],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41],
    })
  )
}

const DashboardMapC = () => {
  const { state, dispatch } = useContext(Context);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const history = useHistory();
  const { t } = useTranslation();
  // const StatusUrl = `/cmd?get={"device_status":{"filter":{${
  //   level === "super_super"
  //     ? state.Login.Cid
  //     : `"cid":"${cid}"`
  // }},"nodeInf":{},"obj":{}}}`;


    const StatusUrl= '/cmd'
    const Urldata= `{"get":{"device_status":{"filter":{${
      level === "super_super"
        ? state.Login.Cid
        : `"cid":"${cid}"`
    }},"nodeInf":{},"obj":{}}}}`
  

  const [Statusloading, StatusResponse] = useURLloader(StatusUrl, Urldata);
  const currentZoom = 8
  const centerPosition:[number, number] = [24.793256, 121.013987]
  const [GPSList, setGPSList] = useState<Igpslist[] | undefined>(undefined);

  useEffect(() => {
    if (StatusResponse?.response) {
      let GPSList :Igpslist[] = [];
      StatusResponse.response.device_status.forEach((item:any) => {
        GPSList.push({
          latitude: item.obj?.status?.gps?.latitude || 0,
          longitude: item.obj?.status?.gps?.longitude || 0,
          id: item.nodeInf.id,
          name: item.nodeInf.name,
          health: item.nodeInf.health,
          sim: item.nodeInf.sim,
          lastUpdate: item.nodeInf.lastUpdate,
        });
      });
      setGPSList(GPSList);
    }
  }, [StatusResponse]);

  const onPopCkick = (item:Igpslist) => {
    // console.log(item);
    dispatch({
      type: "setMaptoTopo",
      payload: { device: `${item.name === "" ? item.id : item.name}` },
    });
    history.push("./topology");
  };

  return (
    <Card bodyStyle={{ padding: "6px" }} className={`${styles.Card} ${styles.MapCard}`} >
      {Statusloading ? (
        <Spin>
          <Map
            center={centerPosition}
            zoom={currentZoom}
            className={styles.DashboardMap}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
          </Map>
          <div className={styles.markerWrapper}>
              <img className={styles.markerIcon} src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt=""/><p>{t("ISMS.Up")}</p>
              <img className={styles.markerIcon} src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" alt=""/>  <p>{t("ISMS.Alarm")}</p>
            </div>
        </Spin>
      ) : (
        <Fragment>
        <Map
          center={centerPosition}
          zoom={currentZoom}
          className={styles.DashboardMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          />

          <MarkerClusterGroup
            disableClusteringAtZoom={18}
            removeOutsideVisibleBounds={true}
          >
            {GPSList &&
              GPSList.map((item, index) => {
                let lastUpdate = new Date(item.lastUpdate*1000);
                return (
                  <Marker
                    key={index}
                    position={[item.latitude, item.longitude]}
                    icon={item.health === "up" ? MapIcon('normal') : (MapIcon('alarm'))}
                  >
                    <Popup>
                      Device: {item.name !== "" ? item.name : item.id}
                      <br />
                      Status: {item.health}
                      <br />
                      Signal: {item.sim}
                      <br />
                      LastUpdate:
                      {`${lastUpdate.getFullYear()}-${
                        lastUpdate.getMonth() + 1
                      }-${lastUpdate.getDate()} ${lastUpdate.getHours()}:${lastUpdate.getMinutes()}`}
                      <br />
                      <a
                        href="/#"
                        onClick={(e) => {
                          e.preventDefault();
                          onPopCkick(item);
                        }}
                      >
                        see detail
                      </a>
                    </Popup>
                  </Marker>
                );
              })}
          </MarkerClusterGroup>
        </Map>
            <div className={styles.markerWrapper}>
              <img className={styles.markerIcon} src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png" alt=""/><p>{t("ISMS.Up")}</p>
              <img className={styles.markerIcon} src="https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png" alt=""/>  <p>{t("ISMS.Alarm")}</p>
            </div>
        </Fragment>
      )}
    </Card>
  );
};

export default DashboardMapC;
