
import React, { useEffect, useState, useContext, Fragment } from "react";
import {
  DashboardIoTGuageC,
  DashboardIoTOneShot,
  DashboardIoTExtreme,
} from "./DashboardIoT_guage";
import { Card, Select, Col, Row } from "antd";
import styles from "../dashboard.module.scss";
import Context from "../../../../Utility/Reduxx";
import axios from "axios";
import { UserLogOut } from '../../../../Utility/Fetch'
import { useHistory } from 'react-router-dom'

const { Option } = Select;

const DashboardIoTC = () => {
  const history = useHistory()
  const { state, dispatch } = useContext(Context);
  const level = localStorage.getItem("authUser.level");
  const cid = localStorage.getItem("authUser.cid");
  const [loading, setLoading] = useState(false);
  const [deviceList, setDeviceList] = useState<any | undefined>(undefined);
  const [currentDisplay, setCurrentDisplay] = useState<any | undefined>(
    undefined
  );

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
        if (res.data.response?.device_iot) {
          const data = res.data.response.device_iot;
          const deviceList = data.filter((item: any) => {
            return item.obj.iot?.[0]?.data;
          });
          deviceList.forEach((item: any) => {
            item.obj.iot.forEach((iot: any) => {
              let timestamp = new Date(iot.timestamp * 1000);
              iot.timestamp = `${timestamp.getFullYear()}-${
                timestamp.getMonth() + 1
              }-${timestamp.getDate()}  ${timestamp.getHours()}:${timestamp.getMinutes()}`;
            });
          });
          setDeviceList(deviceList);
        } else {
          setDeviceList(undefined);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");                                                                         
        } 
        console.log(error);
      });
          // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.Login.Cid]);

  useEffect(() => {
    if (deviceList?.[0]) {
      handleChange([deviceList[0].nodeInf.id, deviceList[0].obj.iot[0].id]);
    } else {
      setCurrentDisplay(undefined);
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deviceList]);

  const handleChange = (value: any) => {
    // console.log(value,value[0], deviceList);

    // console.log(value)
    let currentDisplay = deviceList.filter((item: any) => {
      return item.nodeInf.id === value[0] || item.nodeInf.name === value[0];
    });
    // console.log(currentDisplay)
    currentDisplay = currentDisplay[0].obj.iot.filter((item: any) => {
      return item.id === value[1];
    });
    setCurrentDisplay(currentDisplay[0]);
    // console.log(currentDisplay[0]);
  };
  // console.log(deviceList);
  return (
    <Card bordered={false} loading={loading}>
      <Select
        defaultValue={
          deviceList?.length && [
            deviceList[0].nodeInf.id,
            deviceList[0].obj.iot[0].id,
          ]
        }
        style={{ width: "100%" }}
        onChange={handleChange}
      >
        {deviceList?.length &&
          deviceList.map((item: any, index: number) => {
            return item.obj.iot.map((iot: any) => {
              return (
                <Option key={index} value={[item.nodeInf.id, iot.id]}>{`${
                  item.nodeInf.name !== "" ? item.nodeInf.name : item.nodeInf.id
                }_${iot.id}_${iot.name}`}</Option>
              );
            });
          })}
      </Select>
      <div style={{ display: "flex", marginTop: "15px" }}>
        <p
          style={{
            marginLeft: "2%",
            marginBottom: "0px",
            fontSize: "0.9rem",
            fontWeight: 800,
          }}
        >
          Last Update: {currentDisplay && currentDisplay.timestamp}
        </p>
      </div>
      {currentDisplay && (
        <Row gutter={24} style={{ marginBottom: 20 }}>
          <Col xs={24} sm={12} md={8} lg={6} className={styles.col}>
            <DashboardIoTExtreme
              max={1280}
              min={0}
              title={"Battery"}
              GuageName={"Charge_Max_Wat"}
              value={currentDisplay.data.controller.today.charge.max_watt_w}
              unit={"W"}
            />
            <Fragment>
              <DashboardIoTGuageC
                max={100}
                min={0}
                c1={0.2}
                c2={0.5}
                c3={0.7}
                c4={1}
                title={"Battery"}
                GuageName={"SOC"}
                value={currentDisplay.data.controller.battery.soc_percentage}
                unit={"%"}
              />
              <DashboardIoTGuageC
                max={10}
                min={0}
                c1={0.2}
                c2={0.5}
                c3={0.8}
                c4={1}
                title={"Battery"}
                GuageName={"Full Charge Time"}
                value={currentDisplay.data.controller.battery.full_charged_time}
                unit={"H"}
              />
              <DashboardIoTExtreme
                max={35}
                min={0}
                title={"Battery"}
                GuageName={"Charge Max Current"}
                value={
                  currentDisplay.data.controller.today.charge.max_current_a
                }
                unit={"A"}
              />
              <DashboardIoTExtreme
                max={100}
                min={0}
                title={"Battery"}
                GuageName={"Discharge Max Current"}
                value={
                  currentDisplay.data.controller.today.discharge.max_current_a
                }
                unit={"A"}
              />
              <DashboardIoTGuageC
                max={33}
                min={0}
                c1={0.193939394}
                c2={0.484848484848485}
                c3={0.775757575757576}
                c4={1}
                title={"Battery"}
                GuageName={"Over Discharge Time"}
                value={
                  currentDisplay.data.controller.battery.over_discharged_time
                }
                unit={"H"}
              />
              <DashboardIoTGuageC
                max={0}
                min={55}
                c1={0.181818181818182}
                c2={0.545454545454546}
                c3={0.727272727272728}
                c4={1}
                title={"Battery"}
                GuageName={"Temperature"}
                value={currentDisplay.data.controller.battery.temperature_c}
                unit={"C"}
              />
            </Fragment>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} className={styles.col}>
            <DashboardIoTExtreme
              max={5000}
              min={0}
              title={"Battery"}
              GuageName={"Discharge Max Wat"}
              value={currentDisplay.data.controller.today.discharge.max_watt_w}
              unit={"W"}
            />
            <Fragment>
              <DashboardIoTOneShot
                title={"Battery"}
                GuageName={"Charge Wat"}
                value={currentDisplay.data.controller.today.charge.watt_w}
                unit={"W"}
              />
              <DashboardIoTOneShot
                title={"Battery"}
                GuageName={"Discharge Wat"}
                value={currentDisplay.data.controller.today.discharge.watt_w}
                unit={"W"}
              />
              <DashboardIoTGuageC
                max={54}
                min={48}
                c1={0.25}
                c2={0.5}
                c3={0.75}
                c4={1}
                title={"Battery"}
                GuageName={"Voltage"}
                value={currentDisplay.data.controller.load.voltage_v}
                unit={"V"}
              />
              <DashboardIoTExtreme
                max={57.6}
                min={0}
                title={"Battery"}
                GuageName={"Max Voltage"}
                value={
                  currentDisplay.data.controller.today.battery.max_voltage_v
                }
                unit={"V"}
              />
              <DashboardIoTGuageC
                max={22}
                min={0}
                c1={0.227272727272727}
                c2={0.454545454545454}
                c3={0.681818181818181}
                c4={1}
                title={"Battery"}
                GuageName={"Charge"}
                value={currentDisplay.data.controller.battery.charge_current_a}
                unit={"A"}
              />
              <DashboardIoTGuageC
                max={200}
                min={0}
                c1={0.2}
                c2={0.5}
                c3={0.8}
                c4={1}
                title={"Battery"}
                GuageName={"Total DisCharge"}
                value={
                  currentDisplay.data.controller.battery.total_discharge_ah
                }
                unit={"AH"}
              />
            </Fragment>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} className={styles.col}>
            <DashboardIoTOneShot
              title={"Battery"}
              GuageName={"Charge AH"}
              value={currentDisplay.data.controller.today.charge.ampere_hour_ah}
              unit={"AH"}
            />

            <Fragment>
              <DashboardIoTOneShot
                title={"Battery"}
                GuageName={"Discharge AH"}
                value={
                  currentDisplay.data.controller.today.discharge.ampere_hour_ah
                }
                unit={"AH"}
              />
              <DashboardIoTOneShot
                title={"Battery"}
                GuageName={"Charge Total Wat"}
                value={currentDisplay.data.controller.today.charge.total_watt_w}
                unit={"W"}
              />
              <DashboardIoTGuageC
                max={56.8}
                min={48}
                c1={0.329545454545454}
                c2={0.465909090909091}
                c3={0.625}
                c4={1}
                title={"Battery"}
                GuageName={"Voltage"}
                value={currentDisplay.data.controller.battery.voltage_v}
                unit={"V"}
              />
              <DashboardIoTGuageC
                max={200}
                min={0}
                c1={0.2}
                c2={0.5}
                c3={0.8}
                c4={1}
                title={"Battery"}
                GuageName={"Total Charge"}
                value={currentDisplay.data.controller.battery.total_charge_ah}
                unit={"AH"}
              />

              <DashboardIoTGuageC
                max={1280}
                min={0}
                c1={0.25}
                c2={0.5}
                c3={0.75}
                c4={1}
                title={"Pannel"}
                GuageName={"Wat"}
                value={currentDisplay.data.controller.solar_pannel.watt_w}
                unit={"W"}
              />
              <DashboardIoTGuageC
                max={130}
                min={0}
                c1={0.846153846153846}
                c2={0.884615384615385}
                c3={0.923076923076923}
                c4={1}
                title={"Pannel"}
                GuageName={"Voltage"}
                value={currentDisplay.data.controller.solar_pannel.voltage_v}
                unit={"V"}
              />
            </Fragment>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6} className={styles.col}>
            <DashboardIoTGuageC
              max={20}
              min={0}
              c1={0.25}
              c2={0.5}
              c3={0.75}
              c4={1}
              title={"Pannel"}
              GuageName={"Current"}
              value={currentDisplay.data.controller.solar_pannel.current_a}
              unit={"A"}
            />

            <Fragment>
              <DashboardIoTGuageC
                max={0}
                min={55}
                c1={0.181818181818182}
                c2={0.545454545454546}
                c3={0.727272727272728}
                c4={1}
                title={"Pannel"}
                GuageName={"Temperature"}
                value={currentDisplay.data.controller.temperature_c}
                unit={"C"}
              />
              <DashboardIoTExtreme
                max={4}
                min={0}
                title={"Load"}
                GuageName={"ON-OFF"}
                value={currentDisplay.data.controller.load_on_off}
                unit={""}
              />
              <DashboardIoTOneShot
                title={"Load"}
                GuageName={"Load-Light"}
                value={currentDisplay.data.controller.load_light_percentage}
                unit={"%"}
              />
              <DashboardIoTGuageC
                max={6.4}
                min={0}
                c1={0.25}
                c2={0.5}
                c3={0.75}
                c4={1}
                title={"Load"}
                GuageName={"Current"}
                value={currentDisplay.data.controller.load.current_a}
                unit={"A"}
              />
              <DashboardIoTGuageC
                max={320}
                min={0}
                c1={0.25}
                c2={0.5}
                c3={0.75}
                c4={1}
                title={"Load"}
                GuageName={"Wat"}
                value={currentDisplay.data.controller.load.watt_w}
                unit={"W"}
              />
              <DashboardIoTExtreme
                max={100}
                min={48}
                title={"Battery"}
                GuageName={"Min Voltage"}
                value={
                  currentDisplay.data.controller.today.battery.min_voltage_v
                }
                unit={"V"}
              />
            </Fragment>
          </Col>
        </Row>
      )}
    </Card>
  );
};
export default DashboardIoTC;
