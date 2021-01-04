import React, { Fragment, useEffect, useState, useContext } from "react";
import styles from "./track_map.module.scss";
import {
  Spin,
  Alert,
  Modal,
  Form,
  DatePicker,
  Button,
  Drawer,
  Table,
  message,
} from "antd";
import axios from "axios";
import { Map, Marker, TileLayer, Popup, Polyline } from "react-leaflet";
import moment from "moment";
import Context from "../../../Utility/Reduxx";
import { useHistory } from "react-router-dom";
import { UserLogOut } from "../../../Utility/Fetch";

const { RangePicker } = DatePicker;

const TrackMap = ({ record, Mapvisible, setMapvisible, setRecord }) => {
  const [PolylineData, setPolylineData] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(17);
  const [form] = Form.useForm();
  const [centerPosition, setCenterPosition] = useState([
    24.774222535724427,
    121.00916565583707,
  ]);
  const [coordinate, setCoordinate] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [GPSuploading, setGPSUploading] = useState(false);
  const [nodeInfo, setNodeInfo] = useState(null);
  const [selectedDate, setselectedDate] = useState([]);
  const [restoreCoordinates, setRestoreCoordinates] = useState([]);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const history = useHistory();
  const { dispatch } = useContext(Context);
  const [count, setCount] = useState(0);

  // console.log(coordinate)

  useEffect(() => {
    if (record.id) {

      if (drawerVisible) {
        return;
      }
      
      if (count === 0) {
        setUploading(true);
      }


      console.log("refresh");
      let yesterday = new Date();
      yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
      let today = new Date();
      today.setTime(today.getTime());
      yesterday = yesterday.getTime() / 1000;
      today = today.getTime() / 1000;

      // const StatusUrl = `/cmd?get={"device_status":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{}}}`;
      const config1 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/cmd",
        data: JSON.parse(
          `{"get":{"device_status":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{}}}}`
        ),
      };

      const config2 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/cmd",
        data: JSON.parse(
          `{"get":{"gps_track":{"filter":{"id":"${
            record.id
          }"},"utc_range":{"start":${parseInt(yesterday)},"end":${parseInt(
            today
          )}},"nodeInf":{},"obj":{}}}}`
        ),
      };

      function DeviceStatusUrl() {
        return axios(config1);
      }
      function GPSTrackUrl() {
        return axios(config2);
      }

      axios
        .all([DeviceStatusUrl(), GPSTrackUrl()])
        .then(
          axios.spread((acct, perms) => {
            const ResData = acct.data.response.device_status[0].obj.status.gps;
            setCoordinate([ResData?.latitude, ResData?.longitude]);
            setCenterPosition([ResData?.latitude, ResData?.longitude]);
            acct.data.response.device_status[0].nodeInf.lastUpdate = new Date(
              acct.data.response.device_status[0].nodeInf.lastUpdate * 1000
            );
            setNodeInfo(acct.data.response.device_status[0].nodeInf);
            setUploading(false);

            const coordinateArr = perms.data.response?.gps_track?.[0]?.gps.list;
            setPolylineData(coordinateArr?.map((item) => [item[1], item[2]]));
            setselectedDate(coordinateArr);
          })
        )
        .catch((error) => {
          console.log(error);
          setUploading(false);
        });

      const stateInterval = setInterval(() => {
        setCount((prevState) => prevState + 1);
      }, 20000);

      return () => clearInterval(stateInterval);
    }
  }, [record.id, count, drawerVisible]);

  const onFinish = (values) => {
    setGPSUploading(true);
    // console.log(values);
    // let from_time = values?.RangePicker[0]._d.getTime()/1000 ;
    let from_time = values?.RangePicker[0]._d;
    from_time = new Date(
      from_time.getFullYear(),
      from_time.getMonth(),
      from_time.getDate()
    ); //轉為當天00:00
    from_time = from_time.getTime() / 1000; //轉為TimeStamp
    // const To_time = values?.RangePicker[1]._d.getTime()/1000;
    let To_time = values?.RangePicker[1]._d;

    To_time =
      (new Date(To_time.toLocaleDateString()).getTime() +
      24 * 60 * 60 * 1000 - 1)/1000;

    console.log(To_time);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"gps_track":{"filter":{"id":"${
          record.id
        }"},"utc_range":{"start":${parseInt(from_time)},"end":${parseInt(
          To_time
        )}},"nodeInf":{},"obj":{}}}}`
      ),
    };
    console.log(config.data)
    axios(config)
      .then((res) => {
        console.log(res.data);
        const coordinateArr = res.data.response.gps_track[0].gps.list;
        // console.log(coordinateArr)
        setPolylineData(coordinateArr.map((item) => [item[1], item[2]]));
        setselectedDate(coordinateArr);
        console.log(selectedDate)
        if (coordinateArr?.length) {
          setRestoreCoordinates(coordinateArr);
        }
        console.log(coordinateArr)
        setDrawerVisible(true);
        setGPSUploading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
        setGPSUploading(false);
        message.error("no data");
      });
  };

  function disabledDate(current) {
    return (
      current &&
      (current < moment().subtract(7, "days") ||
        current > moment().add(0, "days"))
    );
  }

  const columns = [
    {
      title: "Time",
      dataIndex: "readableTime",
      render: (_, record) => {
        const time = new Date(record[0] * 1000);
        return `${time.getFullYear()}-${
          time.getMonth() + 1
        }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}`;
      },
    },
    {
      title: "Latitude",
      dataIndex: "lat",
      responsive: ["md"],
      render: (_, record) => {
        return record[1];
      },
    },
    {
      title: "Longitude",
      dataIndex: "lng",
      responsive: ["md"],
      render: (_, record) => {
        return record[2];
      },
    },
    {
      title: "height",
      dataIndex: "height",
      render: (_, record) => {
        return record[3];
      },
    },
  ];

  return (
    <Modal
      visible={Mapvisible}
      onCancel={() => {
        setMapvisible(false);
        setRecord({ id: null });
        setDrawerVisible(false);
        form.resetFields();
      }}
      maskClosable={false}
      centered={false}
      width={"80%"}
      title="Location"
      footer={null}
      style={drawerVisible && { marginTop: "2%" }}
      className={styles.modal}
    >
      {uploading ? (
        <Spin>
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
      ) : (
        <Fragment>
          <Drawer
            placement={"top"}
            closable={true}
            onClose={() => {
              setDrawerVisible(false);
              setCoordinate(
                restoreCoordinates.length
                  ? [restoreCoordinates.pop()[1], restoreCoordinates.pop()[2]]
                  : coordinate
              );
              setCenterPosition(
                restoreCoordinates.length
                  ? [
                      restoreCoordinates[restoreCoordinates.length - 1][1],
                      restoreCoordinates[restoreCoordinates.length - 1][2],
                    ]
                  : coordinate
              );
              // setPolylineData([]);
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
              rowKey={(index) => index}
              onRow={(record) => {
                return {
                  onClick: () => {
                    setCenterPosition([record[1], record[2]]);
                    setCoordinate([record[1], record[2]]);
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
              <RangePicker
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                showTime={false}
              />
            </Form.Item>
            <Form.Item name="DateSubmite" style={{ marginLeft: "3%" }}>
              <Button type="primary" htmlType="submit" loading={GPSuploading}>
                Submit
              </Button>
            </Form.Item>
          </Form>
          <Map
            center={centerPosition}
            zoom={currentZoom}
            className={styles.TrackerMap}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            />
            {PolylineData && <Polyline positions={PolylineData} />}
            {coordinate && (
              <Marker position={coordinate}>
                {nodeInfo && (
                  <Popup>
                    position: {`${coordinate[0]}, ${coordinate[1]}`}
                    <br />
                    Device: {nodeInfo.name !== "" ? nodeInfo.name : nodeInfo.id}
                  </Popup>
                )}
              </Marker>
            )}
          </Map>
        </Fragment>
      )}
    </Modal>
  );
};
export default TrackMap;

// const [selectedDate, setselectedDate] = useState([]);
// const [restoreCoordinates, setRestoreCoordinates] = useState([]);
// const [drawerVisible, setDrawerVisible] = useState(false);

// const [coordinates, setCoordinates] = useState([]);

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
