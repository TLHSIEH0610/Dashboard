import React, { useContext, Fragment, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import styles from "../dashboard.module.scss";
import { Card  } from "antd";
import axios from 'axios'
import { FcChargeBattery, FcIdea, FcGrid } from 'react-icons/fc'
import { FaTemperatureHigh } from 'react-icons/fa'

const IoTStatisticC = () => {
  const [loading, setLoading] = useState(false);
  const { state } = useContext(Context);
  const level = localStorage.getItem("authUser.level");
  const cid = localStorage.getItem("authUser.cid");
  const history = useHistory()
  const [IoTAVG, setIoTAVG] = useState(null)
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
        const Rawdata = res.data.response.device_iot;
        let battery_soc = [], battery_voltage = [], battery_current = [], load_wat = [], load_voltage = [], load_current = [], pannel_wat = [], pannel_voltage = [], pannel_current = [], temperature = []
        let IoTData = Rawdata.filter(item => item.obj.iot)
        console.log(IoTData)
        IoTData.forEach(item=>{
          item.obj.iot.forEach(iot=>{
            battery_soc.push(iot.data.controller.battery.soc_percentage);
            battery_voltage.push(iot.data.controller.battery.voltage_v);
            battery_current.push(iot.data.controller.battery.charge_current_a);
            load_voltage.push(iot.data.controller.load.voltage_v);
            load_current.push(iot.data.controller.load.current_a);
            load_wat.push(iot.data.controller.load.watt_w);
            pannel_voltage.push(iot.data.controller.solar_pannel.voltage_v);
            pannel_current.push(iot.data.controller.solar_pannel.current_a);
            pannel_wat.push(iot.data.controller.solar_pannel.watt_w);
            temperature.push(iot.data.controller.temperature_c);
            
          })
        })

        let IoTAVG = [battery_soc, battery_voltage, battery_current, load_wat, load_voltage, load_current, pannel_wat, pannel_voltage, pannel_current, temperature, [battery_soc.length]]

        IoTAVG= IoTAVG.map(item=>{
          return (item.reduce(function (a, b) {
            return a + b;
          }, 0))/item.length
        })

        setIoTAVG(IoTAVG)
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  return (
    // <Fragment>
    <div className={styles.PieWrapper}>
      <Card
        className={styles.Card}
        loading = {loading}
        style={{ display: "relative", cursor:'pointer' }}
        onClick = {()=>history.push('./iotguage')}
      >
        {IoTAVG && <Fragment>
        <Card className={styles.subCard} type="inner">
            <div className={styles.IoTWrapper}>
                <div>
                    <FcChargeBattery className={styles.IoTIcon} />
                    <p>Battery</p>
                </div>
                <div style={{marginLeft:'12%'}}>
                    <h2>SOC : <span>{IoTAVG[0]} (%)</span></h2>
                    <h2>Voltage : <span>{IoTAVG[1]} (V)</span></h2>
                    <h2>Current : <span>{IoTAVG[2]} (A)</span></h2>
                </div>
            </div>
        </Card>
        <Card className={styles.subCard} type="inner">
            <div className={styles.IoTWrapper}>
                <div>
                    <FcIdea className={styles.IoTIcon} />
                    <p>Load</p>
                </div>
                <div style={{marginLeft:'12%'}}>
                    <h2>Voltage : <span>{IoTAVG[3]} (V)</span></h2>
                    <h2>Current : <span>{IoTAVG[4]} (A)</span></h2>
                    <h2>Wat : <span>{IoTAVG[5]} (W)</span></h2>
                </div>
            </div>
        </Card>
        <Card className={styles.subCard} type="inner">
            <div className={styles.IoTWrapper}>
                <div>
                    <FcGrid className={styles.IoTIcon} />
                    <p>Pannel</p>
                </div>
                <div style={{marginLeft:'12%'}}>
                    <h2>Voltage : <span>{IoTAVG[6]} (V)</span></h2>
                    <h2>Current : <span>{IoTAVG[7]} (A)</span></h2>
                    <h2>Wat : <span>{IoTAVG[8]} (W)</span></h2>
                </div>
            </div>
        </Card>
        <Card className={styles.subCard} type="inner">
            <div className={styles.IoTWrapper}>
                <div>
                    <FaTemperatureHigh className={styles.IoTIcon}  style={{color:'skyblue'}}/>
                    <p>Thermal</p>
                </div>
                <div style={{marginLeft:'12%'}}>
                    <h2>Temp. : <span>{IoTAVG[9]}  (C)</span></h2>
                </div>
            </div>
        </Card>
        <h2 className={styles.wording}>Average by {IoTAVG[10]} sets of IoT devices</h2>
        </Fragment>}
      </Card>
    </div>
    // </Fragment>
  );
}
export default IoTStatisticC
