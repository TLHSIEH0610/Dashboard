import React, { useEffect, useState } from "react";
import styles from "./track_map.module.scss";
import { Spin, Alert } from "antd";
import axios from "axios";
import { Map, Marker, TileLayer, Popup } from "react-leaflet";

const TrackMap = ({ record }) => {
  // const [currentZoom, setCurrentZoom] = useState(17);
  const currentZoom = 17;
  const [centerPosition, setCenterPosition] = useState([
    24.774222535724427,
    121.00916565583707,
  ]);
  const [coordinate, setCoordinate] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [nodeInfo, setNodeInfo] = useState(null);


  useEffect(() => {
    if (record.id) {
      setUploading(true);
      const StatusUrl = `/cmd?get={"device_status":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{}}}`;
      axios
        .get(StatusUrl)
        .then((res) => {
          const ResData = res.data.response.device_status[0].obj.status.gps;
          console.log([ResData.latitude, ResData.longitude]);
          setCoordinate([ResData.latitude, ResData.longitude]);
          setCenterPosition([ResData.latitude, ResData.longitude]);
          res.data.response.device_status[0].nodeInf.lastUpdate = new Date(res.data.response.device_status[0].nodeInf.lastUpdate);
          setNodeInfo(res.data.response.device_status[0].nodeInf);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          setUploading(false);
        });
    }
  }, [record.id]);


  return uploading ? (
    <Spin>
      <Alert
        message="Getting Data"
        description="We are now getting data from server, please wait for a few seconds"
      />
    </Spin>
  ) : (
    <Map
      center={centerPosition}
      zoom={currentZoom}
      className={styles.TrackerMap}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {coordinate && <Marker position={coordinate}>
      {nodeInfo && <Popup>
        Device: {nodeInfo.name !== "" ? nodeInfo.name : nodeInfo.id}
        <br />
        Status: {nodeInfo.health}
        <br />
        Signal: {nodeInfo.sim}
        <br />
        LastUpdate: {`${nodeInfo.lastUpdate.getFullYear()}-${
          nodeInfo.lastUpdate.getMonth() + 1
        }-${nodeInfo.lastUpdate.getDate()} ${nodeInfo.lastUpdate.getHours()}:${nodeInfo.lastUpdate.getMinutes()}`}
        <br />
      </Popup>}
        
        </Marker>}

    </Map>
  );
};

export default TrackMap;

// const [selectedDate, setselectedDate] = useState([]);

// const [coordinates, setCoordinates] = useState([]);
// const [restoreCoordinates, setRestoreCoordinates] = useState([]);
// const [drawerVisible, setDrawerVisible] = useState(false);
// const [PolylineData, setPolylineData] = useState([]);

// const onFinish = (values) => {
//   console.log(values);
//   const from_time = values.RangePicker[0]._d;
//   const To_time = values.RangePicker[1]._d;
//   const selectedDate = restoreCoordinates.filter((item) => {
//     return (
//       from_time.getTime() < parseInt(item.time * 1000) &&
//       parseInt(item.time * 1000) < To_time.getTime()
//     );
//   });
//   setselectedDate(selectedDate);
//   console.log(selectedDate);
//   setDrawerVisible(true);
// };

// useEffect(() => {
//   if (Trackresponse) {
//     count.current++;
//     console.log(Trackresponse);
//     let coordinates = [...Trackresponse.position];
//     coordinates.forEach((item, index) => {
//       item["key"] = index;
//       let date = new Date(item.time * 1000);
//       item["readableTime"] = `${date.getFullYear()}-${
//         date.getMonth() + 1
//       }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
//     });
//     console.log(coordinates);
//     setCoordinates([coordinates[coordinates.length - 1]]);
//     setCenterPosition([
//       coordinates[coordinates.length - 1].lat,
//       coordinates[coordinates.length - 1].lng,
//     ]);
//     if (count.current === 1) {
//       setRestoreCoordinates(coordinates);
//     }
//   }
// }, [Trackresponse]);

// useEffect(() => {
//   if (selectedDate) {
//     let coordinateArr = [];
//     selectedDate.forEach((item) => {
//       coordinateArr.push([item.lat, item.lng]);
//     });
//     setPolylineData(coordinateArr);

//     console.log(coordinateArr);
//   }
// }, [selectedDate]);

// function ColorSorter(label) {
//   if (label === "up" || label === "excellent") {
//     return "#28a745";
//   }
//   if (label === "critical" || label === "good") {
//     return "#ffc107";
//   }
//   if (label === "warning" || label === "fair") {
//     return "#dc3545";
//   }
//   if (label === "offline" || label === "poor") {
//     return "#343a40";
//   } else {
//     return "gray";
//   }
// }

// const columns = [
//   {
//     title: "Time",
//     dataIndex: "readableTime",
//     key: "readableTime",
//     render: (text) => <a>{text}</a>,
//   },
//   {
//     title: "Health",
//     dataIndex: "health",
//     key: "health",
//     render: (text) => <Tag color={ColorSorter(text)}>{text}</Tag>,
//   },
//   {
//     title: "Signal",
//     dataIndex: "strength",
//     key: "strength",
//     render: (text) => <Tag color={ColorSorter(text)}>{text}</Tag>,
//   },
//   {
//     title: "Height",
//     dataIndex: "height",
//     key: "height",
//     responsive: ["sm"],
//   },
//   {
//     title: "Latitude",
//     dataIndex: "lat",
//     key: "lat",
//     responsive: ["md"],
//   },
//   {
//     title: "Longitude",
//     dataIndex: "lng",
//     key: "lng",
//     responsive: ["md"],
//   },
// ];
// <div>

{
  /* <Card
        
        bordered={false}
        style={{ padding: "0" }}
        bodyStyle={{ padding: "0" }}
      >
        <Drawer
          placement={"top"}
          closable={true}
          onClose={() => {
            setDrawerVisible(false);
            setCoordinates([restoreCoordinates[restoreCoordinates.length - 1]]);
            setCenterPosition([
              restoreCoordinates[restoreCoordinates.length - 1].lat,
              restoreCoordinates[restoreCoordinates.length - 1].lng,
            ]);
            setPolylineData([]);
            // setCurrentZoom(12)
          }}
          bodyStyle={{ paddingTop: "2px" }}
          visible={drawerVisible}
          destroyOnClose={true}
          mask={false}
          maskClosable={false}
        >
          <Table
            columns={columns}
            dataSource={selectedDate}
            className={styles.drawertable}
            pagination={false}
            onRow={(record) => {
              return {
                onClick: (event) => {
                  // 点击行
                  console.log(event, record);
                  setCenterPosition([record.lat, record.lng]);
                  setCoordinates([
                    {
                      lat: record.lat,
                      lng: record.lng,
                      health: record.health,
                      strength: record.strength,
                    },
                  ]);
                  setCurrentZoom(17);
                },
              };
            }}
          />
        </Drawer>
        <Form
          name="SelectTime"
          onFinish={onFinish}
          form={form}
          style={{ display: "flex" }}
        >
          <Form.Item name="RangePicker">
            <RangePicker />
          </Form.Item>
          <Form.Item name="DateSubmite" style={{ marginLeft: "3%" }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Card> */
}

// {Trackloading ? (
//   <Spin tip="Loading...">
//     <Alert
//       message="Getting Data"
//       description="We are now getting data from server, please wait for a few seconds"
//     />
//   </Spin>
// ) : (
//   <OpenStreetMapC
//     centerPosition={centerPosition}
//     currentZoom={currentZoom}
//     coordinates={coordinates}
//     PolylineData={PolylineData}
//     className={styles.leafletContainer}
//   />
// )}
// </div>
