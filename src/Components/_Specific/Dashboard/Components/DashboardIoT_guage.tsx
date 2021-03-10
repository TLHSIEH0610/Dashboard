import React, { Fragment } from "react";
import "echarts/lib/chart/gauge";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import { Tag } from "antd";
import styles from "../dashboard.module.scss";


interface Iguage {
    title: string;
    GuageName: string;
    value: number;
    unit: string;
    max?:number;
    min?:number;
    c1?:number;
    c2?:number;
    c3?:number;
    c4?:number;
}


const CheckColor = (title:string) => {
  switch (title) {
    case "Battery":
      // return <FcChargeBattery className={styles.guageIcon} />;
     return <Tag color="#108ee9">Battery</Tag>
    case "Pannel":
      // return <FcGrid className={styles.guageIcon}/>;
      return <Tag color="#87d068">Pannel</Tag>
    case "Load":
      // return <FcIdea className={styles.guageIcon}/>;
      return <Tag color="#f50">Load</Tag>
  }
};

export const DashboardIoTGuageC: React.FC <Iguage> = ({ title, GuageName, value, unit, max, min, c1, c2, c3, c4 }) => {

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
          min: min,
          max: max,
          // center : ['50%', '90%'],
          // radius : 100,
          // startAngle: -135,
          // endAngle: -405,
          precision: 0,
          splitNumber: 4,
          detail: { formatter: `{value}${unit}`, fontSize: 20 },
          data: [{ value: value, name: GuageName }],
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 15,
              color: [
                [c1, "#FF6E76"],
                [c2, "#FDDD60"],
                [c3, "#58D9F9"],
                [c4, "#7CFFB2"],
              ],
            },
          },
          axisTick: {
            splitNumber: 1,
            lineStyle: {
                width: 2,
                color: 'auto'
            }
        },
        axisLabel: {
          distance: 10,// Distancia adonde pone los valores
          textStyle: {
              color: "#000"
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


export const DashboardIoTOneShot: React.FC <Iguage> = ({ title, GuageName, value, unit}) => {

  const getOption = () => {
    const option = {
      series: [
        {
          name: "IoT",
          type: "gauge",
          // min: 0,
          // max: 270,
          startAngle: 90,
          endAngle: -269.9,
          splitNumber: 0,
          detail: { formatter: `{value}${unit}`, fontSize: 20 },
          data: [{ value: value, name: GuageName }],
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 15,
              color: [
                [1, "rgb(0, 148, 206)"],
              ],
            },
          },
        axisLabel: {
          distance: 10,
          color: 'transparent',
      },
          splitLine: {
            show: false,
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


  // const CheckColor = (title:string) => {
  //   switch (title) {
  //     case "Battery":
  //       return <FcChargeBattery className={styles.guageIcon} />;
  //     case "Pannel":
  //       return <FcGrid className={styles.guageIcon}/>;
  //     case "Load":
  //       return <FcIdea className={styles.guageIcon}/>;
  //   }
  // };

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



export const DashboardIoTExtreme: React.FC <Iguage> = ({ title, GuageName, value, unit, max, min}) => {

  const getOption = () => {
    const option = {
      series: [
        {
          name: "IoT",
          type: "gauge",
          min: min,
          max: max,
          startAngle: 180,
          endAngle: 0,
          splitNumber: 1,
          detail: { formatter: `{value}${unit}`, fontSize: 20 },
          data: [{ value: value, name: GuageName }],
      //     progress: {
      //       show: true,
      //       roundCap: true,
      //       width: 18
      //   },
      //   itemStyle: {
      //     color: '#58D9F9',
      //     shadowColor: 'rgba(0,138,255,0.45)',
      //     shadowBlur: 10,
      //     shadowOffsetX: 2,
      //     shadowOffsetY: 2
      // },
          axisLine: {
            roundCap: true,
            lineStyle: {
              width: 15,
              color: [
                [1, "#556B2F"],
              ],
            },
          },
          axisTick: {
            show: false,
            splitNumber: 2,
            lineStyle: {
                width: 2,
                color: 'auto'
            }
        },
          splitLine: {
            show: false,
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
          axisLabel: {
            distance: 10,
            // color: 'transparent',
        },
          title: {
            show: false,
          },
        },
      ],
    };
    return option;
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

      <div className={styles.guageTag} >
        {CheckColor(title)} <p>{GuageName}</p>
      </div>
    </Fragment>
  );
};
