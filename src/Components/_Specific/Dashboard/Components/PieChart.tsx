import React, { useContext, Fragment, useEffect, useState } from "react";
import "echarts/lib/chart/pie";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { Translator } from "../../../../i18n/index";
import styles from "../dashboard.module.scss";
import { Card, Spin } from "antd";
import { BsFillSquareFill } from 'react-icons/bs'
const PieChartC = ({
  PieData,
  StatisticLoading,
  Cate,
}: {
  PieData: any;
  StatisticLoading: boolean;
  Cate: string;
}) => {
  const history = useHistory();
  const { state, dispatch } = useContext(Context);
  const [HealthSum, setHealthSum] = useState();
  const [SignalSum, setSignalSum] = useState();

  useEffect(() => {
    if (PieData.health) {
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

      // dispatch({
      //   type: "setPieNum",
      //   payload: {PieNum:{ SimNum:[PieData.sim.excellent, SimSum], HealthNum:[PieData.health.up, HealthSum] }},
      // });
    } else {
      setHealthSum(undefined);
      setSignalSum(undefined);
    }

    dispatch({
      type: "setIsUpdate",
      payload: { IsUpdate: !state.Global.IsUpdate  },
    });
  }, [PieData]);

  const getOption = (dataSource: number[], data: string[]) => {
    const option = {
      // title: {
      //   text: name,
      //   left: "center",
      //   padding: [10, 0],
      // },
      color: ["#28a745", "#ffc107", "#dc3545", "#343a40"],
      // tooltip: {
      //   trigger: "item",
      //   formatter: "{a} <br/>{b}: {c} ({d}%)",
      // },
      series: [
        {
          name: "Counts",
          type: "pie",
          radius: ["50%", "80%"],
          // avoidLabelOverlap: true,
          // top: 0,
          label: {
            show: false,
            position: "inside",
            // bleedMargin: 5,
            // formatter: "{b} : {c}",
            // fontWeight: "bold",
            fontSize: 0
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
              // label: { show: dataSource ? dataSource[0] : false },
            },
            {
              value: dataSource ? dataSource[1] : null,
              name: data[1],
              // label: { show: dataSource ? dataSource[1] : false },
            },
            {
              value: dataSource ? dataSource[2] : null,
              name: data[2],
              // label: { show: dataSource ? dataSource[2] : false },
            },
            {
              value: dataSource ? dataSource[3] : null,
              name: data[3],
              // label: { show: dataSource ? dataSource[3] : false },
            },
          ],
        },
      ],
    };
    return option;
  };
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
    // console.log('123', params)
    if (params.data.name === ("excellent" || "good" || "fair" || "poor")) {
      dispatch({
        type: "setPietoTopo",
        payload: { strength: `${params.data.name}` },
      });
    } else {
      dispatch({
        type: "setPietoTopo",
        payload: { health: `${params.data.name}` },
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
      {Cate ==='health'&& <Card
        title={Translator("ISMS.DevicesHealth")}
        className={styles.Card}
        // bodyStyle={{ padding: 0 }}
        headStyle={{ padding:0, backgroundColor:'#002FA7', color:'white', fontFamily:'Open Sans', textAlign:'center' }} bodyStyle={{ padding:0,  border:'2px solid #002FA7'}}
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
                  Translator("ISMS.up"),
                  Translator("ISMS.warning"),
                  Translator("ISMS.critical"),
                  Translator("ISMS.offline"),
                ],
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
            <div className={styles.legend} style={{color:"#28a745"}}><BsFillSquareFill/> <p>Up:{PieData.health && PieData.health.up} </p></div>
            <div className={styles.legend} style={{color:"#ffc107"}}> <BsFillSquareFill/><p>Warning:{PieData.health && PieData.health.warning} </p></div>
            <div className={styles.legend} style={{color:"#dc3545"}}> <BsFillSquareFill/><p>Critical:{PieData.health && PieData.health.critical} </p></div>
            <div className={styles.legend} style={{color:"#343a40"}}>  <BsFillSquareFill/><p>Offline:{PieData.health && PieData.health.offline}</p> </div>
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
                [
                  Translator("ISMS.up"),
                  Translator("ISMS.warning"),
                  Translator("ISMS.critical"),
                  Translator("ISMS.offline"),
                ]
              )}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"}
              onEvents={onEvents}
            />
          </Fragment>
        )}
      </Card>}
      {Cate ==='signal'&& <Card title={Translator("ISMS.DevicesStrength")} className={styles.Card} headStyle={{ padding:0, backgroundColor:'#002FA7', color:'white', fontFamily:'Open Sans', textAlign:'center' }} bodyStyle={{ padding:0,  border:'2px solid #002FA7'}}>
        {StatisticLoading ? (
          <Spin>
            <ReactEchartsCore
              className={styles.PieChart}
              echarts={echarts}
              //@ts-ignore
              option={getOption(
                [100, 0, 0, 0],
                [
                  Translator("ISMS.excellent"),
                  Translator("ISMS.good"),
                  Translator("ISMS.fair"),
                  Translator("ISMS.poor"),
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
            <div className={styles.legend} style={{color:"#28a745"}}><BsFillSquareFill/> <p>Excellent:{PieData.sim && PieData.sim.excellent} </p></div>
            <div className={styles.legend} style={{color:"#ffc107"}}> <BsFillSquareFill/><p>Good:{PieData.sim && PieData.sim.good} </p></div>
            <div className={styles.legend} style={{color:"#dc3545"}}> <BsFillSquareFill/><p>Fair:{PieData.sim && PieData.sim.fair} </p></div>
            <div className={styles.legend} style={{color:"#343a40"}}>  <BsFillSquareFill/><p>Poor:{PieData.sim && PieData.sim.poor}</p> </div>
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
                  Translator("ISMS.excellent"),
                  Translator("ISMS.good"),
                  Translator("ISMS.fair"),
                  Translator("ISMS.poor"),
                ],
              )}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"}
              onEvents={onEvents}
            />
          </Fragment>
        )}
      </Card>}
    </div>
    // </Fragment>
  );
};
export default PieChartC;
