import React, { useEffect, useState } from "react";
import styles from "./track_map.module.scss";
import useURLloader from "../../../hook/useURLloader";
import { Slider, Card,Select, Switch } from "antd";
import OpenStreetMapC from './OpenStreetMap'

const { Option } = Select;

const TrackMap = () => {
  const TrackUrl = '/api/track.json'
  const [Trackloading, Trackresponse] = useURLloader(TrackUrl);
  const [currentZoom, setCurrentZoom] = useState(8);
  const [centerPosition, setCenterPosition] = useState([23.901506, 121.031496]);
  const [coordinates, setCoordinates] = useState(null); //每日所有座標
  const [coordinate, setCoordinate] = useState([]); //當日單點座標
  const [selectedDayPoints, setSelectedDayPoints] = useState([]); //當日所有座標
  const [inputValue, setInpuValue] = useState(1);
  const [disabled, setDisabled] = useState(false);

  //滑動點位
  const onChange = (value) => {
    setInpuValue(value);
    console.log(selectedDayPoints, value, selectedDayPoints[`${value}`]);
    let singlePoint = selectedDayPoints[`${value}`];
    console.log(singlePoint);
    setCoordinate([singlePoint]);
    setCenterPosition([singlePoint.lat, singlePoint.lng]);
    setCurrentZoom(18);
  };

  //切換日期
  function handleDayChange(value) {
    // SetSelectedDate(value); //紀錄日期
    const points = coordinates[`${value}`].position;
    setSelectedDayPoints(points); //紀錄當日所有座標
    setCoordinate(points); //設定單點 為 當日全部座標
  }

  const handleDisabledChange = (disabled) => {
    setDisabled(disabled);
    setCoordinate(selectedDayPoints);
  };

  useEffect(() => {
    if (Trackresponse) {
      console.log(Trackresponse);
      setCoordinates(Trackresponse); //每日 所有座標
      setSelectedDayPoints( 
        Trackresponse[Object.keys(Trackresponse)[0]].position //下拉選擇 第一個日子 所有座標
      );
      setCoordinate(Trackresponse[Object.keys(Trackresponse)[0]].position);
      console.log(Trackresponse[Object.keys(Trackresponse)[0]].position)
    }
  }, [Trackresponse]);

  return (
    <div>
      <Card>
        <Select
          defaultValue="Day01"
          style={{ width: 120, marginLeft: '10px' }}
          onChange={handleDayChange}
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
            ShowAll:
            <Switch
              size="small"
              checked={disabled}
              onChange={handleDisabledChange}
            />
            </div>
            <Slider
              disabled={disabled}
              min={0}
              max={selectedDayPoints.length - 1}
              onChange={onChange}
              value={typeof inputValue === "number" ? inputValue : 0}
            />
          </div>


      </Card>
      <Card loading={Trackloading}>
        <OpenStreetMapC centerPosition={centerPosition} currentZoom={currentZoom} coordinate={coordinate}/>
      </Card>
    </div>
  );
};

export default TrackMap;
