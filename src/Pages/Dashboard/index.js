import React, { Component, Fragment } from "react";
import PieChart from "../../Components/_Specific/Pie_Chart";
import Map from "../../Components/_Specific/GPS_Map";
import IoTC from "../../Components/_Specific/IoT/Iot";
import styles from "./index.module.scss";
import SolarIoTC from "../../Components/_Specific/IoT/solarIoT";

const Dashboard = () => {
  return (
    <div >
      <PieChart />
      {/* <div className={styles.MapIoCWrapper}> */}
        {/* <IoTC /> */}
        {/* <Map /> */}
        
      {/* </div> */}
      {/* <SolarIoTC /> */}
    </div>
  );
};

export default Dashboard;
