import React from "react";
import PieChart from "../../Components/_Specific/Pie_Chart";
import DashboardMap from "../../Components/_Specific/Track_Map/DashboardMap";
// import IoTDashboard from "../../Components/_Specific/IoT/IoTDashboard";
// import styles from './index.module.scss'
// import { Card } from 'antd'

const Dashboard = () => {
  return (
    <div>
      <PieChart />
      {/* <div className={styles.IoTOPSWrapper}> */}
        {/* <IoTDashboard /> */}
        {/* <Card style={{width:'50%'}}> */}
        <DashboardMap
          // centerPosition={[24.763963, 121.000095]}
          // currentZoom={12}
        />
        {/* </Card> */}
      {/* </div> */}
    </div>
  );
};

export default Dashboard;
