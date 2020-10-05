import React, { useState, useEffect } from "react";
import { GroupedColumn } from "@ant-design/charts";
import "echarts/lib/chart/pie";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";

const PieChartC = (props) => {
  const { dataSource, data, name } = props;
  // console.log(dataSource, data, name);
  //   const statistic = dataSource.statistic
  const getOption = () => {
    const option = {
      title: {
        text: name,
        // subtext: "123",
        left: "center",
        padding: [5, 0]
      },
      color: ["#28a745", "#ffc107", "#dc3545", "#343a40"],
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b}: {c} ({d}%)",
      },
      legend: {
        orient: "vertical",
        left: 10,
        data: data,
        align: "auto",
      },
      series: [
        {
          name: "Number",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: true,
          label: {
            show: true,
            position: "outer",
            bleedMargin: 5,
            alignTo: "none",
            formatter: '{b} : {c}',
            fontWeight: 'bold',
            fontSize: '15'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: "30",
              fontWeight: "bold",
            },
          },
          labelLine: {
            show: false,
          },
          data: [
            {
              value: dataSource ? dataSource[0] : null,
              name: data[0], label:{show: dataSource? dataSource[0]: false}
            },
            {
              value: dataSource ? dataSource[1] : null,
              name: data[1], label:{show: dataSource? dataSource[1]: false}
            },
            {
              value: dataSource ? dataSource[2] : null,
              name: data[2], label:{show: dataSource? dataSource[2]: false}
            },
            {
              value: dataSource ? dataSource[3] : null,
              name: data[3], label:{show: dataSource? dataSource[3]: false}
            },
          ],
        },
      ],
    };
    return option;
  };

  return (
    <ReactEchartsCore
      echarts={echarts}
      option={getOption()}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
    />
  );
};
export default PieChartC;
