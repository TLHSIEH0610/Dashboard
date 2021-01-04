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
  const [StatisticLoading, StatisticResponse] = useURLloader(
    StatisticUrl,
    Urldata
  );
  const [PieData, setPieData] = useState([]);

  useEffect(() => {
    if (StatisticResponse?.response?.statistic) {
      setPieData(StatisticResponse.response.statistic.obj);
    }else{
      setPieData([]);
    }
  }, [StatisticResponse, state.Login.Cid]);

  return (
    <Fragment>
      <Row gutter={24} style={{ marginBottom: 20 }}>
        <Col xs={24} sm={24} md={24} lg={6}>
          <PieChartC StatisticLoading={StatisticLoading} PieData={PieData} Cate={'health'}/>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          <PieChartC StatisticLoading={StatisticLoading} PieData={PieData} Cate={'signal'}/>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          <IoTStatisticC Cate='Router'/>
        </Col>
        <Col xs={24} sm={24} md={24} lg={6}>
          <IoTStatisticC Cate='IoT'/>
        </Col>

      </Row>
      <Row gutter={24}>
        <Col xs={24} sm={24} md={24} lg={24}>
          <DashboardMapC />
        </Col>
      </Row>
    </Fragment>
  );
};

export default DashboardC;
