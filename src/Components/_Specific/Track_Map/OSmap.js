import React, { useEffect, useState } from "react";
import { Map, Marker, Popup, TileLayer } from "react-leaflet";
// import axios from "axios";
import styles from "./track_map.module.scss";
import useURLloader from "../../../hook/useURLloader";
import { Slider, Card, Select, Switch, Tag } from "antd";
import MarkerClusterGroup from "react-leaflet-markercluster";

// const position = [24.773963, 121.009095];
const { Option } = Select;

const OSMap = () => {
  // const [options, setOptions] = useState([]);
  const TrackUrl = '/api/track.json'
  const [Trackloading, Trackresponse] = useURLloader(TrackUrl);
  const DeviceUrl = '/cmd?get={"device_status":{}}';
  const [Deviceloading, Deviceresponse] = useURLloader(DeviceUrl);
  const [DeviceData, setDeviceData] = useState([]);
  const [currentZoom, setCurrentZoom] = useState(18);
  const [centerPosition, setCenterPosition] = useState([24.773963, 121.009095]);
  const [coordinates, setCoordinates] = useState(null); //所有座標
  const [coordinate, setCoordinate] = useState(null); //當日單點座標
  const [coordinatePoints, setCoordinatePoints] = useState([]); //當日所有座標
  const [inputValue, setInpuValue] = useState(1);
  const [selectedDate, SetSelectedDate] = useState("Day01");
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    if (Deviceresponse) {
      let rawdata=[]
      Deviceresponse.response['device_status'].forEach((item) => {
        rawdata.push({
          key: item.nodeInf.id,
          id: item.nodeInf.id,
          model: item.nodeInf.model,
        });
      });
      setDeviceData(rawdata);
      console.log(rawdata)
    }
  }, [Deviceresponse])


  //滑動點位
  const onChange = (value) => {
    setInpuValue(value);
    console.log(coordinatePoints, value, coordinatePoints[`${value}`]);
    let singlePoint = coordinatePoints[`${value}`];
    console.log(singlePoint);
    setCoordinate([singlePoint]);
    // setCoordinate([singlePoint.lat, singlePoint.lng]) //設定單點座標
    setCenterPosition([singlePoint.lat, singlePoint.lng]);
    setCurrentZoom(18);
  };
  //切換日期
  function handleChange(value) {
    console.log(`selected ${value}`);
    SetSelectedDate(value); //紀錄日期
    const points = coordinates[`${value}`].position;
    // console.log(value,coordinates,points)
    setCoordinatePoints(points); //紀錄當日所有座標
    setCoordinate(points); //設定單點 為 當日全部座標
  }

  const handleDisabledChange = (disabled) => {
    setDisabled(disabled);
    setCoordinate(coordinatePoints);
    console.log(disabled)
    if(!disabled){
        setCoordinate([coordinatePoints[0]])
    }
  };

  useEffect(() => {
    console.log(Trackresponse)
    // setCoordinates(response);
    if (Trackresponse) {
      console.log(Trackresponse);
      setCoordinates(Trackresponse);
      console.log(Object.keys(Trackresponse));
      // console.log(Trackresponse[Object.keys(Trackresponse)[0]])
      setCoordinatePoints(
        Trackresponse[Object.keys(Trackresponse)[0]].position
      );
      setCoordinate(Trackresponse[Object.keys(Trackresponse)[0]].position);
    }
  }, [Trackresponse]);

  return (
    <div>
      <Card>
        <Select
          defaultValue="Day01"
          style={{ width: 120, marginLeft: '10px' }}
          onChange={handleChange}
        >
          <Option value="Day01">Day01</Option>
          <Option value="Day02">Day02</Option>
          <Option value="Day03">Day03</Option>
          <Option value="Day04">Day04</Option>
          <Option value="Day05">Day05</Option>
          <Option value="Day06">Day06</Option>
          <Option value="Day07">Day07</Option>
        </Select>

          <div className={styles.SlideBar}>
            <div>
            ShowAll:{" "}
            <Switch
              size="small"
              checked={disabled}
              onChange={handleDisabledChange}
            />
            </div>
            <Slider
              disabled={disabled}
              min={0}
              max={coordinatePoints.length - 1}
              onChange={onChange}
              value={typeof inputValue === "number" ? inputValue : 0}
            />
          </div>


      </Card>
      <Card>
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
            {/* {coordinates &&
          coordinates[`${selectedDate}`].position.map((item, index) => ( */}
            {coordinate &&
              coordinate.map((item, index) => (
                <Marker key={index} position={[item.lat, item.lng]}>
                  <Popup>
                    {item.health}
                    <br />
                    {item.strength}
                  </Popup>
                </Marker>
              ))}
          </MarkerClusterGroup>
          {/* <Marker position={position}>
          <Popup>
            A pretty CSS3 popup.
            <br />
            Easily customizable.
          </Popup>
        </Marker> */}
        </Map>
      </Card>
    </div>
  );
};

export default OSMap;
