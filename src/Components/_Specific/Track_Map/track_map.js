import React, { useEffect, useRef, useState } from "react";
import styles from "./track_map.module.scss";
import useURLloader from "../../../hook/useURLloader";
import { Form, Card, Drawer, DatePicker, Button, Table, Tag } from "antd";
import OpenStreetMapC from "./OpenStreetMap";

const { RangePicker } = DatePicker;

const TrackMap = ({drawerVisible, setDrawerVisible}) => {
  const [form] = Form.useForm();
  const TrackUrl = "/api/track.json";
  const [Trackloading, Trackresponse] = useURLloader(TrackUrl);
  const [selectedDate, setselectedDate] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(17);
  const [centerPosition, setCenterPosition] = useState([
    24.774222535724427,
    121.00916565583707,
  ]);
  const [coordinates, setCoordinates] = useState([]);
  const [restoreCoordinates, setRestoreCoordinates] = useState([])
  // const [drawerVisible, setDrawerVisible] = useState(false);
  const [PolylineData, setPolylineData] =useState([])
  const count = useRef(0)

  const onFinish = (values) => {
    console.log(values);
    const from_time = values.RangePicker[0]._d;
    const To_time = values.RangePicker[1]._d;
    const selectedDate = restoreCoordinates.filter((item) => {
      return (
        from_time.getTime() < parseInt(item.time * 1000) &&
        parseInt(item.time * 1000) < To_time.getTime()
      );
    });
    setselectedDate(selectedDate);
    console.log(selectedDate);
    setDrawerVisible(true);
  };

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
        }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
      });
      console.log(coordinates);
      setCoordinates([coordinates[coordinates.length-1]]);
      setCenterPosition([coordinates[coordinates.length-1].lat, coordinates[coordinates.length-1].lng])
      if(count.current===1){
        setRestoreCoordinates(coordinates)
      }
    }
  }, [Trackresponse]);


  useEffect(() => {
    if (selectedDate) {
      let coordinateArr = [];
      selectedDate.forEach((item) => {
        coordinateArr.push([item.lat, item.lng]);
      });
      setPolylineData(coordinateArr);

      console.log(coordinateArr);    }
  }, [selectedDate]);

  function ColorSorter(label){
    if(label==='up'|| label==='excellent'){
      return "#28a745"
    }
    if(label==='critical'|| label==='good'){
      return "#ffc107"
    }
    if(label==='warning'|| label==='fair'){
      return  "#dc3545"
    }
    if(label==='offline'|| label==='poor'){
      return "#343a40"
    }else{
      return "gray"
    }
  }


  const columns = [
    {
      title: "Time",
      dataIndex: "readableTime",
      key: "readableTime",
      render: (text) => <a>{(text)}</a>,
    },
    {
      title: "Health",
      dataIndex: "health",
      key: "health",
      render: (text) => <Tag color={ColorSorter(text)}>{text}</Tag>
    },
    {
      title: "Signal",
      dataIndex: "strength",
      key: "strength",
      render: (text) => <Tag color={ColorSorter(text)}>{text}</Tag>
    },
    {
      title: "Height",
      dataIndex: "height",
      key: "height",
      responsive: ['sm'],
    },
    {
      title: "Latitude",
      dataIndex: "lat",
      key: "lat",
      responsive: ['md'],
    },
    {
      title: "Longitude",
      dataIndex: "lng",
      key: "lng",
      responsive: ['md'],
    },
  ];

  return (
    <div>
      <Card bordered={false} style={{padding:'0'}} bodyStyle={{padding:'0'}}>
        <Drawer
          // title="History"
          // bodyStyle={{overflowY:'hidden'}}
          placement={"top"}
          closable={true}
          onClose={() => {
            setDrawerVisible(false)
            setCoordinates([restoreCoordinates[restoreCoordinates.length-1]])
            setCenterPosition([restoreCoordinates[restoreCoordinates.length-1].lat, restoreCoordinates[restoreCoordinates.length-1].lng])
            setPolylineData([])
            // setCurrentZoom(12)
          }}
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
                onClick: (event) => { // 点击行
                  console.log(event, record)
                  setCenterPosition([record.lat, record.lng])
                  setCoordinates([{lat:record.lat, lng:record.lng, health: record.health, strength: record.strength}])
                  setCurrentZoom(17)
                }, 
              };
            }}
          />
        </Drawer>
        <Form name="SelectTime" onFinish={onFinish} form={form} style={{display:'flex'}}>
          {/* <div style={{disply:'flex'}}> */}
          <Form.Item name="RangePicker">
            <RangePicker />
          </Form.Item>
          <Form.Item name="DateSubmite" style={{marginLeft:'3%'}}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
          {/* </div> */}
        </Form>
      </Card>
      <Card loading={Trackloading} bordered={false} style={{padding:'0'}} bodyStyle={{padding:'0'}}>
        <OpenStreetMapC
          centerPosition={centerPosition}
          currentZoom={currentZoom}
          coordinates={coordinates}
          // selectedDate={selectedDate} 
          PolylineData={PolylineData}
          // setPolylineData={setPolylineData} 
        />
      </Card>
    </div>
  );
};

export default TrackMap;
