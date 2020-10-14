import React from "react";
import PieChart from "../../Components/_Specific/Pie_Chart";
import OpenStreetMapC from "../../Components/_Specific/Track_Map/OpenStreetMap";
import IoTDashboard from "../../Components/_Specific/IoT/IoTDashboard";
import styles from './index.module.scss'

const Dashboard = () => {
  return (
    <div>
      <PieChart />
      <div className={styles.IoTOPSWrapper}>
        <IoTDashboard />
        <OpenStreetMapC
          centerPosition={[24.763963, 121.000095]}
          currentZoom={12}
        />
      </div>
    </div>
  );
};

export default Dashboard;
