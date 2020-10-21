import React, { useEffect, useRef, useState } from "react";
import styles from "./track_map.module.scss";
import useURLloader from "../../../hook/useURLloader";
import { Form, Card, Drawer, DatePicker, Button, Table } from "antd";
import OpenStreetMapC from "./OpenStreetMap";

const { RangePicker } = DatePicker;

const DashboardMap = () => {

  const TrackUrl = "/api/track.json";
  const [Trackloading, Trackresponse] = useURLloader(TrackUrl);

  const [currentZoom, setCurrentZoom] = useState(13);
  const [centerPosition, setCenterPosition] = useState([
    24.774222535724427,
    121.00916565583707,
  ]);
  const [coordinates, setCoordinates] = useState([]);
//   const [restoreCoordinates, setRestoreCoordinates] = useState([])
  const count = useRef(0)


  useEffect(() => {
    if (Trackresponse) {
      count.current++
      console.log(Trackresponse);
      let coordinates = [...Trackresponse.position];
      coordinates.forEach((item, index) => {
        item["key"] = index;
        let date = new Date(item.time * 1000);
        item["readableTime"] = `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}_${date.getHours()}:${date.getMinutes()}`;
      });
      console.log(coordinates);
      setCoordinates(coordinates);
    //   setCenterPosition([coordinates[coordinates.length-1].lat, coordinates[coordinates.length-1].lng])
    //   if(count.current===1){
    //     setRestoreCoordinates(coordinates)
    //   }
    }
  }, [Trackresponse]);




  const columns = [
    {
      title: "Time",
      dataIndex: "readableTime",
      key: "readableTime",
      render: (text) => <a>{text}</a>,
    },
    {
      title: "Health",
      dataIndex: "health",
      key: "health",
    },
    {
      title: "Strength",
      dataIndex: "strength",
      key: "strength",
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
    },
    {
      title: "Latitude",
      dataIndex: "lat",
      key: "lat",
    },
    {
      title: "Longitude",
      dataIndex: "lng",
      key: "lng",
    },
  ];

  return (
    <div>
      <Card loading={Trackloading} bordered={false} style={{padding:'0'}} bodyStyle={{padding:'0'}}>
        <OpenStreetMapC
          centerPosition={centerPosition}
          currentZoom={currentZoom}
          coordinates={coordinates}
        />
      </Card>
    </div>
  );
};

export default DashboardMap
