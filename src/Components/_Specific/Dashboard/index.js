import React, { Fragment, useState, useEffect, useContext } from "react";
import useURLloader from "../../../hook/useURLloader";
import PieChartC from "./Components/PieChart";
import Context from "../../../Utility/Reduxx";
import DashboardMapC from "./Components/DashboardMap";
import { Row, Col } from "antd";
import IoTStatisticC from './Components/DashboardIoTStatistic'

const DashboardC = () => {
  const { state } = useContext(Context);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");

  const StatisticUrl = "/cmd";
  const Urldata = `{"get":{"statistic":{"filter":{${
    level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
  }}}}}`;

  // const StatisticUrl =
  //   level === "super_super"
  //     ? `/cmd?get={"statistic":{"filter":{${state.Login.Cid}}}}`
  //     : `/cmd?get={"statistic":{"filter":{"cid":"${cid}"}}}`;
  const [StatisticLoading, StatisticResponse] = useURLloader(
    StatisticUrl,
    Urldata
  );

  // const IoTUrl = `/cmd?get={"device_iot":{"filter":{${
  //   level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
  // }}}}`;

  // const [IoTLisrLoading, IoTLisrResponse] = useURLloader(IoTUrl);
  // const [soc_percentage, setSoc_percentage] = useState(null);
  // const [temperature_c, setTemperature_c] = useState(null);

  const [PieData, setPieData] = useState([]);

  useEffect(() => {
    if (StatisticResponse?.response) {
      setPieData(StatisticResponse.response.statistic.obj);
    }
  }, [StatisticResponse]);

  return (
    <Fragment>
      <Row gutter={24} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={24} md={24} lg={12}>
          <PieChartC StatisticLoading={StatisticLoading} PieData={PieData} />
        </Col>
        <Col xs={24} sm={24} md={24} lg={12}>
          <IoTStatisticC />
        </Col>

      </Row>
      <Row gutter={24}>
        {/* <Col xs={24} sm={24} md={24} lg={24}>
          <DashboardIoTC />
        </Col> */}
        <Col xs={24} sm={24} md={24} lg={24}>
          <DashboardMapC />
        </Col>
      </Row>
    </Fragment>
  );
};

export default DashboardC;
