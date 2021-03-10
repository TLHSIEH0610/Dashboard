import React, { Fragment, useEffect, useState, useContext } from "react";
import styles from "./track_map.module.scss";
import {
  Spin,
  Modal,
  Form,
  DatePicker,
  Button,
  Drawer,
  Table,
  message,
  Tooltip,
  Row,
  Col,
} from "antd";
import axios from "axios";
import { Map, Marker, TileLayer, Popup, Polyline } from "react-leaflet";
import moment from "moment";
import Context from "../../../Utility/Reduxx";
import { useHistory } from "react-router-dom";
import { UserLogOut } from "../../../Utility/Fetch";
import { useTranslation } from "react-i18next";
import { Icon } from "leaflet";
import { FcSynchronize } from "react-icons/fc";
import { FaAutoprefixer } from "react-icons/fa";

const circleIcon = new Icon({
  iconUrl: require("../../../image/marker2.svg"),
  iconSize: [15, 15],
});

const markerIcon = new Icon({
  iconUrl: require("../../../image/marker2svg.svg"),
  iconSize: [50, 50],
  iconAnchor: [25, 50],
  popupAnchor: [0, -50]
});

const SelectedIcon = new Icon({
  iconUrl: require("../../../image/marker.svg"),
  iconSize: [30, 30],
});

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
  const { state, dispatch } = useContext(Context);
  const [count, setCount] = useState(0);
  const { t } = useTranslation();
  const [Index, setIndex] = useState(undefined);
  const [StateLocation, setStateLocation] = useState([[]]);
  const [AutoRefresh, setAutoRefresh] = useState(false);
  const [IsUpdate, setIsUpdate] = useState(false);


  useEffect(() => {
    if (!AutoRefresh) {
      return;
    }
    console.log('重新整理')
    
    const stateInterval = setInterval(() => {
      setIsUpdate(!IsUpdate);
      setCount((prevState) => prevState + 1);
    }, 20000);

    return () => clearInterval(stateInterval);
  }, [AutoRefresh, count]);

  useEffect(() => {
    if (record.id) {
      // if(count===0){
        // setCount((prevState) => prevState + 1)
        setUploading(true);
      // }
        
      

      //default 帶入過去12小時的資料
      let yesterday = new Date();
      yesterday.setTime(yesterday.getTime() - 12 * 60 * 60 * 1000);
      let today = new Date();
      today.setTime(today.getTime());
      yesterday = yesterday.getTime() / 1000;
      today = today.getTime() / 1000;

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
            const ResData = acct.data.response.device_status[0].obj.status.gps; //status裡的GPS data
            setStateLocation([
              [
                acct.data.response.device_status[0].nodeInf.lastUpdate,
                ResData?.latitude,
                ResData?.longitude,
                ResData?.altitude,
              ],
            ]);
            setCenterPosition([ResData?.latitude, ResData?.longitude]); //state裡的座標當作中心
            setNodeInfo(acct.data.response.device_status[0].nodeInf); //獲取status中node device name&lastupdate time
            setUploading(false);

            let coordinateArr = perms.data.response?.gps_track?.[0]?.gps.list || [];
   
            //判斷track記錄中, 最後一個點 有沒有跟status裡的GPS資料相符, 若沒有就push(有可能GPS很久沒報資料)
            if (coordinateArr?.length) {
              let lastPoint = coordinateArr?.[0].pop();

              if (
                lastPoint[1] !== ResData.latitude &&
                lastPoint[2] !== ResData.longitude
              ) {
                coordinateArr.push([
                  acct.data.response.device_status[0].nodeInf.lastUpdate,
                  ResData?.latitude,
                  ResData?.longitude,
                  ResData?.altitude,
                ]);
              }
            } else {
              coordinateArr.push([
                acct.data.response.device_status[0].nodeInf.lastUpdate,
                ResData?.latitude,
                ResData?.longitude,
                ResData?.altitude,
              ]);
            }

            //
            setRestoreCoordinates(coordinateArr);
            setCoordinate(coordinateArr); //default呈現 昨天-今天的track資訊
            setPolylineData(coordinateArr?.map((item) => [item[1], item[2]])); //track list的歷史座標
            setselectedDate(coordinateArr); //要呈現在table裡的data
          })
        )
        .catch((error) => {
          console.log(error);
          setUploading(false);
          if (error.response && error.response.status === 401) {
            dispatch({ type: "setLogin", payload: { IsLogin: false } });
            UserLogOut();
            history.push("/userlogin");
          }
        });
    }
  }, [record.id, IsUpdate]);

  const onFinish = (values) => {
    // setTrackMode(true);
    setAutoRefresh(false)
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
        24 * 60 * 60 * 1000 -
        1) /
      1000;

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
    console.log(config.data);
    axios(config)
      .then((res) => {
        console.log(res.data);
        const coordinateArr = res.data.response?.gps_track?.[0]?.gps.list || [];
        // const coordinateArr = [
        //   [1609745480, 24.801451, 120.987, 34.0],
        //   [1609745528, 24.800989, 120.987106, 38.0],
        //   [1609745578, 24.790989, 120.987106, 38.0],
        //   [1609745599, 24.770989, 120.987106, 38.0],
        //   [1609745480, 24.773621, 121.009239, 46],
        // ];

        if (coordinateArr.length) {
          setCoordinate(coordinateArr);
          setPolylineData(coordinateArr.map((item) => [item[1], item[2]])); //track list的歷史座標
        } else {
          setCoordinate(StateLocation);
          setPolylineData([]);
        }

        setselectedDate(coordinateArr);

        // if (coordinateArr?.length) {
        //   setRestoreCoordinates(coordinateArr);
        // }
        // console.log(coordinateArr);
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
        }-${time.getDate()} ${time.getHours()}:${time.getMinutes()}:${time.getSeconds()}`;
      },
    },
    // {
    //   title: "Latitude",
    //   dataIndex: "lat",
    //   responsive: ["md"],
    //   render: (_, record) => {
    //     return record[1];
    //   },
    // },
    // {
    //   title: "Longitude",
    //   dataIndex: "lng",
    //   responsive: ["md"],
    //   render: (_, record) => {
    //     return record[2];
    //   },
    // },
    {
      title: "height",
      dataIndex: "height",
      render: (_, record) => {
        return record[3];
      },
    },
  ];

  return (
  <Fragment>
    <Drawer
    placement={state.Global.innerWidth > 1040 ? "left" : "top"}
    className={drawerVisible ? styles.drawer  : `${styles.drawer} ${styles.hide}`}
    // style={drawerVisible? null : {transform:'translateX(-100%)'}}
    closable={true}
    onClose={() => {
      console.log(restoreCoordinates, StateLocation);
      setDrawerVisible(false);
      setIndex(undefined);
      // form.resetFields()
      setIsUpdate(!IsUpdate)
      setCenterPosition(
        restoreCoordinates.length
          ? [
              restoreCoordinates[restoreCoordinates.length - 1][1],
              restoreCoordinates[restoreCoordinates.length - 1][2],
            ]
          : StateLocation
      );
      // setPolylineData([]);
      // setCurrentZoom(12)
    }}
    visible={drawerVisible}
    destroyOnClose={true}
    mask={false}
    // maskClosable={true}
  >
    <Table
      columns={columns}
      dataSource={selectedDate}
      className={styles.drawertable}
      rowClassName={(record)=>record===Index ? styles.rowClass : null}
      pagination={false}
      rowKey={(index) => index}
      onRow={(record) => {
        return {
          onClick: () => {
            // console.log(record);
            setCenterPosition([record[1], record[2]]);
            // setCoordinate([record]);
            setIndex(record);
            setCurrentZoom(17);
          },
        };
      }}
    />
  </Drawer>


    <Modal
      visible={Mapvisible}
      onCancel={() => {
        setMapvisible(false);
        setRecord({ id: null });
        setDrawerVisible(false);
        setAutoRefresh(false)
        // setTrackMode(false);
        setPolylineData([]);
        setCoordinate([]);
        form.resetFields();
      }}
      maskClosable={false}
      centered={false}
      width={"80%"}
      title={t("ISMS.Location")}
      footer={null}
      // style={drawerVisible}
      className={`${styles.modal} ${drawerVisible ? styles.maptransfer : ""}`}
    >
      {/* <Fragment> */}

        <Row justify="space-between">
          <Col>
          <Form
            // name="SelectTime"
            onFinish={onFinish}
            form={form}
            style={{ display: "flex" }}
          >
            <Form.Item
              name="RangePicker"
              rules={[{ required: true, message: "required!" }]}
            >
              <RangePicker
                disabledDate={disabledDate}
                format="YYYY-MM-DD"
                showTime={false}
              />
            </Form.Item>
            <Form.Item name="DateSubmite" style={{ marginLeft: "3%" }}>
              <Button type="primary" htmlType="submit" loading={GPSuploading}>
                {t("ISMS.Submit")}
              </Button>
            </Form.Item>
          </Form>
          </Col>
          <Col>
          <div className={styles.IconWrapper}>
            <Tooltip title={t("ISMS.Refresh")}>
              <Button
              disabled={drawerVisible}
                icon={<FcSynchronize style={{ fontSize: "1.7rem" }} />}
                onClick={() => setIsUpdate(!IsUpdate)}
              />
            </Tooltip>

            <Tooltip title={t("ISMS.AutoRefresh")}>
              <Button
                disabled={drawerVisible}
                style={AutoRefresh ? { background: "#FFEFD5" } : null}
                onClick={() => setAutoRefresh(!AutoRefresh)}
                icon={
                  <div className={styles.autoRefresh}>
                    <FcSynchronize style={{ fontSize: "1.7rem" }} />
                    <FaAutoprefixer className={styles.alphet} />
                  </div>
                }
              />
            </Tooltip>
          </div>
          </Col>
        </Row>
        {uploading ? (
          <Spin>
            <Map
              center={centerPosition}
              zoom={currentZoom}
              className={styles.TrackerMap}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              />
              {/* <Marker position={centerPosition} icon={markerIcon}><Popup></Popup></Marker> */}
              
            </Map>
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
            {PolylineData && <Polyline positions={PolylineData} />}

            {coordinate?.map((item, index) => {
              const date = new Date(item[0] * 1000);
              const lastPoint = coordinate.length === index + 1;
              const clickPoint =
                Index?.[1] === item[1] && Index?.[2] === item[2];
              // console.log(clickPoint, Index, index)
              return (
                <Marker
                  key={index}
                  position={[item[1], item[2]]}
                  icon={
                    lastPoint
                      ? clickPoint
                        ? SelectedIcon
                        : markerIcon
                      : clickPoint
                      ? SelectedIcon
                      : circleIcon
                  }
                >
                  <Popup>
                    Date:{" "}
                    {date.getFullYear() +
                      "/" +
                      (date.getMonth() + 1) +
                      "/" +
                      date.getDate() +
                      " " +
                      date.getHours() +
                      ":" +
                      date.getMinutes() +
                      ":" +
                      date.getSeconds()}
                    <br />
                    Position: {`${item[1]}, ${item[2]}`}
                    <br />
                    Altitude: {item[3]}
                    <br />
                    Device:{" "}
                    {nodeInfo?.name !== "" ? nodeInfo?.name : nodeInfo?.id}
                  </Popup>
                </Marker>
              );
            })}
          </Map>
        )}
      {/* </Fragment> */}
    </Modal>
    </Fragment>
  );
};
export default TrackMap;
