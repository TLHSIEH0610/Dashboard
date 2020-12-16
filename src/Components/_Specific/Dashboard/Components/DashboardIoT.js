import { FcChargeBattery, FcIdea, FcGrid } from "react-icons/fc";
import DashboardIoTGuageC from "./DashboardIoT_guage";
import React, { useEffect, useState, useContext, Fragment } from "react";
import { Card, Select, Col, Row } from "antd";
import styles from "../dashboard.module.scss";
import Context from "../../../../Utility/Reduxx";
import axios from "axios";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

const { Option } = Select;

const DashboardIoTC = () => {
  const { state } = useContext(Context);
  const level = localStorage.getItem("authUser.level");
  const cid = localStorage.getItem("authUser.cid");
  const [loading, setLoading] = useState(false);
  const [deviceList, setDeviceList] = useState(null);
  // const [IoTData, setIoTData] = useState(null);
  const [currentDisplay, setCurrentDisplay] = useState(null);
  // const [expand, setExpand] = useState(false);

  useEffect(() => {
    setLoading(true);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"device_iot":{"filter":{${
          level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
        }}}}}`
      ),
    };
    axios(config)
      .then((res) => {
        const data = res.data.response.device_iot;

        const deviceList = data.filter((item) => {
          return item.obj.iot;
        });
        deviceList.forEach((item) => {
          item.obj.iot.forEach((iot) => {
            let timestamp = new Date(iot.timestamp * 1000);
            iot.timestamp = `${timestamp.getFullYear()}-${
              timestamp.getMonth() + 1
            }-${timestamp.getDate()}  ${timestamp.getHours()}:${timestamp.getMinutes()}`;
          });
        });
        setDeviceList(deviceList);
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (deviceList) {
      handleChange([deviceList[0].nodeInf.id, deviceList[0].obj.iot[0].id]);
    }
  }, [deviceList]);

  const handleChange = (value) => {
    console.log(value);
    let currentDisplay = deviceList.filter((item) => {
      return item.nodeInf.id === value[0] || item.nodeInf.name === value[0];
    });
    currentDisplay = currentDisplay[0].obj.iot.filter((item) => {
      return item.id === value[1];
    });
    setCurrentDisplay(currentDisplay[0]);
    console.log(currentDisplay[0]);
  };

  return (
    <Card bordered={false} loading={loading}>
      <Select
        defaultValue={
          deviceList && [deviceList[0].nodeInf.id, deviceList[0].obj.iot[0].id]
        }
        style={{ width: "100%" }}
        onChange={handleChange}
      >
        {deviceList &&
          deviceList.map((item, index) => {
            return item.obj.iot.map((iot, iotIndex) => {
              return (
                <Option
                  key={`${index}_${iotIndex}`}
                  value={[item.nodeInf.id, iot.id]}
                >{`${
                  item.nodeInf.name !== "" ? item.nodeInf.name : item.nodeInf.id
                }_${iot.id}_${iot.name}`}</Option>
              );
            });
          })}
      </Select>
      <div style={{ display: "flex", marginTop: "15px" }}>
        <FcChargeBattery style={{ marginLeft: "7px", fontSize: "1.3rem" }} />
        <p style={{ fontWeight:500 }}>Battery</p>
        <FcGrid style={{ marginLeft: "7px", fontSize: "1.3rem" }} />
        <p style={{ fontWeight:500 }}>Solar Pannel</p>
        <FcIdea style={{ marginLeft: "7px", fontSize: "1.3rem" }} />
        <p style={{ fontWeight:500 }}>Load</p>
        <p
          style={{ marginLeft: "2%", marginBottom: "0px", fontSize: "0.9rem", fontWeight:500 }}
        >
          {currentDisplay && currentDisplay.timestamp}
        </p>
        {/* <div
          className={styles.collapWrapper}
          onClick={() => setExpand(!expand)}
        >
          <p>collapse</p>
          {expand ? (
            <UpOutlined className={styles.collapIcon} />
          ) : (
            <DownOutlined className={styles.collapIcon} />
          )}
        </div> */}
      </div>
      {currentDisplay && (
        <Row gutter={24} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} md={8} lg={6} className={styles.col}>
            <DashboardIoTGuageC
              title={"Battery"}
              name={"Charge_Max_Wat"}
              value={currentDisplay.data.controller.today.charge.max_watt_w}
              unit={"W"}
            />
            
              <Fragment>
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"SOC"}
                  value={currentDisplay.data.controller.battery.soc_percentage}
                  unit={"%"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Full Charge Time"}
                  value={currentDisplay.data.controller.battery.soc_percentage}
                  unit={""}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Charge Max Current"}
                  value={
                    currentDisplay.data.controller.today.charge.max_current_a
                  }
                  unit={"A"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Discharge Max Current"}
                  value={
                    currentDisplay.data.controller.today.discharge.max_current_a
                  }
                  unit={"A"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Over Discharge Time"}
                  value={
                    currentDisplay.data.controller.battery.over_discharged_time
                  }
                  unit={""}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Temperature"}
                  value={currentDisplay.data.controller.battery.temperature_c}
                  unit={"C"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Min Voltage"}
                  value={
                    currentDisplay.data.controller.today.battery.min_voltage_v
                  }
                  unit={"V"}
                />
              </Fragment>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} className={styles.col}>
            <DashboardIoTGuageC
              title={"Battery"}
              name={"Discharge Max Wat"}
              value={currentDisplay.data.controller.today.discharge.max_watt_w}
              unit={"W"}
            />
            
              <Fragment>
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Charge Wat"}
                  value={currentDisplay.data.controller.today.charge.watt_w}
                  unit={"W"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Discharge Wat"}
                  value={currentDisplay.data.controller.today.discharge.watt_w}
                  unit={"W"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Voltage"}
                  value={currentDisplay.data.controller.load.voltage_v}
                  unit={"V"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Max Voltage"}
                  value={
                    currentDisplay.data.controller.today.battery.max_voltage_v
                  }
                  unit={"V"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Charge"}
                  value={
                    currentDisplay.data.controller.battery.charge_current_a
                  }
                  unit={"A"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Total DisCharge"}
                  value={
                    currentDisplay.data.controller.battery.total_discharge_ah
                  }
                  unit={"AH"}
                />
              </Fragment>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} className={styles.col}>
            <DashboardIoTGuageC
              title={"Battery"}
              name={"Charge AH"}
              value={currentDisplay.data.controller.today.charge.ampere_hour_ah}
              unit={"AH"}
            />
            
              <Fragment>
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Discharge AH"}
                  value={
                    currentDisplay.data.controller.today.discharge
                      .ampere_hour_ah
                  }
                  unit={"AH"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Charge Total Wat"}
                  value={
                    currentDisplay.data.controller.today.charge.total_watt_w
                  }
                  unit={"W"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Voltage"}
                  value={currentDisplay.data.controller.battery.voltage_v}
                  unit={"V"}
                />
                <DashboardIoTGuageC
                  title={"Battery"}
                  name={"Total Charge"}
                  value={currentDisplay.data.controller.battery.total_charge_ah}
                  unit={"AH"}
                />

                <DashboardIoTGuageC
                  title={"Pannel"}
                  name={"Wat"}
                  value={currentDisplay.data.controller.solar_pannel.watt_w}
                  unit={"W"}
                />
                <DashboardIoTGuageC
                  title={"Pannel"}
                  name={"Voltage"}
                  value={currentDisplay.data.controller.solar_pannel.voltage_v}
                  unit={"V"}
                />
              </Fragment>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} className={styles.col}>
            <DashboardIoTGuageC
              title={"Pannel"}
              name={"Current"}
              value={currentDisplay.data.controller.solar_pannel.current_a}
              unit={"A"}
            />
            
              <Fragment>
                <DashboardIoTGuageC
                  title={"Pannel"}
                  name={"Temperature"}
                  value={currentDisplay.data.controller.temperature_c}
                  unit={"C"}
                />
                <DashboardIoTGuageC
                  title={"Load"}
                  name={"ON-OFF"}
                  value={currentDisplay.data.controller.load_on_off}
                  unit={""}
                />
                <DashboardIoTGuageC
                  title={"Load"}
                  name={"Load-Light"}
                  value={currentDisplay.data.controller.load_light_percentage}
                  unit={"%"}
                />
                <DashboardIoTGuageC
                  title={"Load"}
                  name={"Current"}
                  value={currentDisplay.data.controller.load.current_a}
                  unit={"A"}
                />
                <DashboardIoTGuageC
                  title={"Load"}
                  name={"Temperature"}
                  value={currentDisplay.data.controller.temperature_c}
                  unit={"C"}
                />
                <DashboardIoTGuageC
                  title={"Load"}
                  name={"Wat"}
                  value={currentDisplay.data.controller.load.watt_w}
                  unit={"W"}
                />
              </Fragment>
          </Col>
        </Row>
      )}
    </Card>
  );
};
export default DashboardIoTC;
