import React, { useContext, Fragment, useEffect, useState, useCallback } from "react";
import "echarts/lib/chart/pie";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import styles from "../dashboard.module.scss";
import { Card, Spin, Tooltip } from "antd";
import { BsFillSquareFill } from "react-icons/bs";
// import axios from "axios";
// import { UserLogOut } from "../../../../Utility/Fetch";
import { PieChartPeriod } from './PieChart_Period'
import { useTranslation } from "react-i18next";

const PieChart_ = ({
  PieData,
  StatisticLoading,
  Cate,
  IsUpdate
}: {
  PieData?: any;
  StatisticLoading?: boolean;
  Cate: string;
  IsUpdate: boolean;
}) => {
  const history = useHistory();
  const { state, dispatch } = useContext(Context);
  const [HealthSum, setHealthSum] = useState();
  const [SignalSum, setSignalSum] = useState();
  const { t } = useTranslation();

  // console.log(PieData)
  useEffect(() => {

    if (PieData?.health) {
      
      const HealthSum = (() =>
        [
          PieData.health.up,
          PieData.health.warning,
          PieData.health.critical,
          PieData.health.offline,
        ].reduce(function (a, b) {
          return a + b;
        }, 0))();
      setHealthSum(HealthSum);

      const SimSum = (() =>
        [
          PieData.sim.excellent,
          PieData.sim.good,
          PieData.sim.fair,
          PieData.sim.poor,
        ].reduce(function (a, b) {
          return a + b;
        }, 0))();
      setSignalSum(SimSum);
    } else {
      setHealthSum(undefined);
      setSignalSum(undefined);
    }

    dispatch({
      type: "setIsUpdate",
      payload: { IsUpdate: !state.Global.IsUpdate },
    });
  }, [PieData]);

  const getOption = useCallback((dataSource: number[], data: string[]) => {
    const option = {
      color: ["#28a745", "#ffc107", "#dc3545", "#343a40"],
      series: [
        {
          name: "Counts",
          type: "pie",
          radius: ["50%", "80%"],
          label: {
            show: false,
            position: "inside",
            fontSize: 0,
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "20",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: dataSource ? dataSource[0] : null,
              name: data[0],
            },
            {
              value: dataSource ? dataSource[1] : null,
              name: data[1],
            },
            {
              value: dataSource ? dataSource[2] : null,
              name: data[2],
            },
            {
              value: dataSource ? dataSource[3] : null,
              name: data[3],
            },
          ],
        },
      ],
    };
    return option;
  },[]);
  
  type ParamName =
    | "excellent"
    | "good"
    | "fair"
    | "poor"
    | "up"
    | "warning"
    | "critical"
    | "offline";
  interface Iparams {
    data: {
      name: ParamName;
    };
  }
  //Click事件
  const onChartClick = (params: Iparams) => {
    let paramsName = params.data.name.toLowerCase();
    const strengthCate = ["excellent", "good", "fair", "poor"];

    if (strengthCate.includes(paramsName)) {
      dispatch({
        type: "setPietoTopo",
        payload: { strength: `${paramsName}` },
      });
    } else {
      dispatch({
        type: "setPietoTopo",
        payload: { health: `${paramsName}` },
      });
    }
    history.push("./topology");
  };
  const onEvents = {
    click: onChartClick,
  };

  return (
    // <Fragment>
    <div className={styles.PieWrapper}>
      {Cate === "health" && (
        <Card
          title={t("ISMS.DevicesHealth")}
          className={styles.Card}
          headStyle={{
            padding: 0,
            backgroundColor: "#002FA7",
            color: "white",
            fontFamily: "Open Sans",
            textAlign: "center",
          }}
          bodyStyle={{ padding: 0, border: "2px solid #002FA7" }}
        >
          {StatisticLoading ? (
            <Spin>
              <ReactEchartsCore
                className={styles.PieChart}
                echarts={echarts}
                //@ts-ignore
                option={getOption(
                  [100, 0, 0, 0],
                  ["up", "warning", "critical", "offline"]
                )}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
                onEvents={onEvents}
              />
            </Spin>
          ) : (
              <Fragment>
                <p className={styles.PieSum}>{HealthSum}</p>
                <div className={styles.legendWrapper}>
                  <div className={styles.legend} style={{ color: "#28a745" }}>
                    <BsFillSquareFill />
                    <Tooltip title={t("ISMS.Up")}>
                    <p>
                    Up:
                    {PieData.health && PieData.health.up}
                    </p>
                    </Tooltip>
                  </div>
                  <div className={styles.legend} style={{ color: "#ffc107" }}>
                    
                    <BsFillSquareFill />
                    <Tooltip title={t("ISMS.Warning")}>
                    <p>
                    Warning:
                    {PieData.health && PieData.health.warning}
                    </p>
                    </Tooltip>
                  </div>
                  <div className={styles.legend} style={{ color: "#dc3545" }}>
                    
                    <BsFillSquareFill />
                    <Tooltip title={t("ISMS.FatalError")}>
                    <p>
                    Critical:
                    {PieData.health && PieData.health.critical}
                    </p>
                    </Tooltip>
                  </div>
                  <div className={styles.legend} style={{ color: "#343a40" }}>
                    
                    <BsFillSquareFill />
                    <Tooltip title={t("ISMS.Offline")}>
                    <p>
                    Offline:
                    {PieData.health && PieData.health.offline}
                    </p>
                    </Tooltip>
                  </div>
                </div>
                <ReactEchartsCore
                  className={styles.PieChart}
                  echarts={echarts}
                  //@ts-ignore
                  option={getOption(
                    PieData.health && [
                      PieData.health.up,
                      PieData.health.warning,
                      PieData.health.critical,
                      PieData.health.offline,
                    ],
                    ["up", "warning", "critical", "offline"]
                  )}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={"theme_name"}
                  onEvents={onEvents}
                />
              </Fragment>
            )}
        </Card>
      )}
      {Cate === "signal" && (
        <Card
          title={t("ISMS.DevicesStrength")}
          className={styles.Card}
          headStyle={{
            padding: 0,
            backgroundColor: "#002FA7",
            color: "white",
            fontFamily: "Open Sans",
            textAlign: "center",
          }}
          bodyStyle={{ padding: 0, border: "2px solid #002FA7" }}
        >
          {StatisticLoading ? (
            <Spin>
              <ReactEchartsCore
                className={styles.PieChart}
                echarts={echarts}
                //@ts-ignore
                option={getOption(
                  [100, 0, 0, 0],
                  [
                   "Excellent",
                    "Good",
                   "Fair",
                    "Poor",
                  ]
                )}
                notMerge={true}
                lazyUpdate={true}
                theme={"theme_name"}
                onEvents={onEvents}
              />
            </Spin>
          ) : (
              <Fragment>
                <p className={styles.PieSum}>{SignalSum}</p>
                <div className={styles.legendWrapper}>
                  <div className={styles.legend} style={{ color: "#28a745" }}>
                    <BsFillSquareFill />
                    <Tooltip title={'rssi > -65 dbm'}>
                    <p>
                    Excellent: {PieData.sim && PieData.sim.excellent}
                    </p>
                    </Tooltip>
                  </div>
                  <div className={styles.legend} style={{ color: "#ffc107" }}>
                    
                    <BsFillSquareFill />
                    <Tooltip title={'-75 dbm< rssi <= -65 dbm'}>
                    <p>
                    Good: {PieData.sim && PieData.sim.good}
                    </p>
                    </Tooltip>
                  </div>
                  <div className={styles.legend} style={{ color: "#dc3545" }}>
                    
                    <BsFillSquareFill />
                    <Tooltip title={'-85 dbm< rssi <= -75 dbm'}>
                    <p>
                    Fair: {PieData.sim && PieData.sim.fair}
                    </p>
                    </Tooltip>
                  </div>
                  <div className={styles.legend} style={{ color: "#343a40" }}>
                    
                    <BsFillSquareFill />
                    <Tooltip title={' rssi <= -85 dbm'}>
                    <p>
                    Poor: {PieData.sim && PieData.sim.poor}
                    </p>
                    </Tooltip>
                  </div>
                </div>
                <ReactEchartsCore
                  className={styles.PieChart}
                  echarts={echarts}
                  //@ts-ignore
                  option={getOption(
                    PieData.sim && [
                      PieData.sim.excellent,
                      PieData.sim.good,
                      PieData.sim.fair,
                      PieData.sim.poor,
                    ],
                    [
                      "Excellent",
                      "Good",
                     "Fair",
                      "Poor",
                    ]
                  )}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={"theme_name"}
                  onEvents={onEvents}
                />
              </Fragment>
            )}
        </Card>
      )}

     {Cate ==='periodupdate' || Cate ==='period'  &&<PieChartPeriod Cate={Cate} IsUpdate={IsUpdate} />}



    </div>
    // </Fragment>
  );
};

export const PieChartC =   React.memo(PieChart_);