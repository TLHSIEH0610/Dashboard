import React from "react";
import PieChart from "../../Components/_Specific/Pie_Chart";
import DashboardMap from "../../Components/_Specific/Track_Map/DashboardMap";

const Dashboard = () => {
  return (
    <div>
      <PieChart />
      <DashboardMap
      // centerPosition={[24.763963, 121.000095]}
      // currentZoom={12}
      />
    </div>
  );
};

export default Dashboard;
