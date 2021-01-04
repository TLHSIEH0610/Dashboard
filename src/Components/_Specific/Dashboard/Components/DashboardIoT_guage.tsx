import "echarts/lib/chart/gauge";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import React, { Fragment } from "react";
// import { Tag } from "antd";
import styles from "../dashboard.module.scss";
import { FcChargeBattery, FcIdea, FcGrid } from 'react-icons/fc'

interface Iguage {
    title: string;
    GuageName: string;
    value: number;
    unit: string;
}

const DashboardIoTGuageC: React.FC <Iguage> = ({ title, GuageName, value, unit }) => {

  const getOption = () => {
    const option = {
      tooltip: {
        formatter: "{a} <br/>{b} : {c}%",
      },
      toolbox: {
        feature: {
          restore: {},
          saveAsImage: {},
        },
      },
      series: [
        {
          name: "IoT",
          type: "gauge",
          min: 0,
          max: 100,
          //   startAngle: 315,
          //   endAngle: 225,
          splitNumber: 5,
          detail: { formatter: `{value}${unit}`, fontSize: 20 },
          data: [{ value: value, name: GuageName }],
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 15,
              color: [
                [0.25, "#FF6E76"],
                [0.5, "#FDDD60"],
                [0.75, "#58D9F9"],
                [1, "#7CFFB2"],
              ],
            },
          },
          axisTick: {
            splitNumber: 2,
            lineStyle: {
                width: 2,
                color: 'auto'
            }
        },
          splitLine: {
            // 分隔线
            length: 10, // 属性length控制线长
            lineStyle: {
              // 属性lineStyle（详见lineStyle）控制线条样式
              color: "auto",
            },
          },
          pointer: {
            width: 2,
          },
          title: {
            show: false,
          },
        },
      ],
    };
    return option;
  };

  const CheckColor = (title:string) => {
    switch (title) {
      case "Battery":
        return <FcChargeBattery className={styles.guageIcon} />;
      case "Pannel":
        return <FcGrid className={styles.guageIcon}/>;
      case "Load":
        return <FcIdea className={styles.guageIcon}/>;
    }
  };

  return (
    <Fragment>
      <ReactEchartsCore
        echarts={echarts}
        option={getOption()}
        notMerge={true}
        lazyUpdate={true}
        theme={"theme_name"}
        className={styles.guage}
        // onChartReady={this.onChartReadyCallback}
        // onEvents={EventsDict}
        // opts={}
      />

      <div className={styles.guageTag}>
        {CheckColor(title)} <p>{GuageName}</p>
      </div>
    </Fragment>
  );
};
export default DashboardIoTGuageC;
