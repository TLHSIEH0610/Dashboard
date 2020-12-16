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

const PieChartC = ({ PieData, StatisticLoading }) => {
  const history = useHistory();
  const { dispatch } = useContext(Context);
  const [HealthSum, setHealthSum] = useState()
  const [SignalSum, setSignalSum] = useState()
  useEffect(()=>{
    if(PieData.health){
      setHealthSum(()=> [
        PieData.health.up,
        PieData.health.warning,
        PieData.health.critical,
        PieData.health.offline,
      ].reduce(function (a, b) {
        return a + b;
      }, 0))

      setSignalSum(()=> [
        PieData.sim.excellent,
        PieData.sim.good,
        PieData.sim.fair,
        PieData.sim.poor,
      ].reduce(function (a, b) {
        return a + b;
      }, 0))
      
    }
  },[PieData])


  const getOption = (dataSource, data, name) => {
    const option = {
      title: {
        text: name,
        left: "center",
        padding: [10, 0],

      },
      color: ["#28a745", "#ffc107", "#dc3545", "#343a40"],
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "horizontal",
        // left: '20%',
        data: data,
        align: "auto",
        padding: [50, 30],
      },
      series: [
        {
          name: "Counts",
          type: "pie",
          radius: ["40%", "60%"],
          avoidLabelOverlap: true,
          top: 50,
          label: {
            show: true,
            position: "inside",
            bleedMargin: 5,
            alignTo: "none",
            formatter: "{b} : {c}",
            fontWeight: "bold",
            fontSize: "15",
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
              label: { show: dataSource ? dataSource[0] : false },
            },
            {
              value: dataSource ? dataSource[1] : null,
              name: data[1],
              label: { show: dataSource ? dataSource[1] : false },
            },
            {
              value: dataSource ? dataSource[2] : null,
              name: data[2],
              label: { show: dataSource ? dataSource[2] : false },
            },
            {
              value: dataSource ? dataSource[3] : null,
              name: data[3],
              label: { show: dataSource ? dataSource[3] : false },
            },
          ],
        },
      ],
    };
    return option;
  };

  //Click事件
  const onChartClick = (params) => {
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
        <Card className={styles.Card}  bodyStyle={{ padding: 0 }} style={{position:'relative'}}>
          {StatisticLoading ? (
            <Spin>
              <ReactEchartsCore
                className={styles.PieChart}
                echarts={echarts}
                option={getOption(
                  [100, 0, 0, 0],
                  [
                    Translator("ISMS.up"),
                    Translator("ISMS.warning"),
                    Translator("ISMS.critical"),
                    Translator("ISMS.offline"),
                  ],
                  Translator("ISMS.DevicesHealth")
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
            <ReactEchartsCore
              className={styles.PieChart}
              echarts={echarts}
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
                ],
                Translator("ISMS.DevicesHealth")
              )}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"}
              onEvents={onEvents}
            />
            </Fragment>
          )}
        </Card>
        <Card className={styles.Card}  bodyStyle={{ padding: 0 }}>
          {StatisticLoading ? (
            <Spin>
              <ReactEchartsCore
                className={styles.PieChart}
                echarts={echarts}
                option={getOption(
                  [100, 0, 0, 0],
                  [
                    Translator("ISMS.excellent"),
                    Translator("ISMS.good"),
                    Translator("ISMS.fair"),
                    Translator("ISMS.poor"),
                  ],
                  Translator("ISMS.DevicesStrength")
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
            <ReactEchartsCore
              className={styles.PieChart}
              echarts={echarts}
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
                Translator("ISMS.DevicesStrength")
              )}
              notMerge={true}
              lazyUpdate={true}
              theme={"theme_name"}
              onEvents={onEvents}
            />
          </Fragment>
          )}
        </Card>
      </div>
    // </Fragment>
  );
};
export default PieChartC;
