import React, { useContext } from "react";
import "echarts/lib/chart/pie";
import ReactEchartsCore from "echarts-for-react/lib/core";
import echarts from "echarts/lib/echarts";
import "echarts/lib/component/tooltip";
import "echarts/lib/component/title";
import "echarts/lib/component/legend";
import { useHistory } from 'react-router-dom'
import Context from '../../../Utility/Reduxx'
import { Translator } from '../../../i18n/index'

const PieChartC = ({ dataSource, data, name }) => {
  const history = useHistory()
  const { dispatch } = useContext(Context)


  const getOption = () => {
    const option = {
      title: {
        text: name,
        subtext: `\n \n \n \n \n \n \n \n \n ${ dataSource ? Translator("ISMS.Sum") : 'no data'}  ${dataSource ? dataSource.reduce(function(a, b) {
            return a + b

          ;
      }, 0) : '' }  `,
        left: "center",
        padding: [10, 0],
        subtextStyle: {
          color: 'black',
          fontSize: 15,
          fontWeight:'bold'
        }
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
        padding: [50, 30]
      },
      series: [
        {
          name: "Number",
          type: "pie",
          radius: ["50%", "70%"],
          avoidLabelOverlap: true,
          top: 50,
          label: {
            show: true,
            position: "inside",
            bleedMargin: 5,
            alignTo: "none",
            formatter: '{b} : {c}',
            fontWeight: 'bold',
            fontSize: '15'
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

  //Click事件
  const onChartClick = (params)=>{
    // console.log('123', params)
    if(params.data.name===('excellent' || 'good' || 'fair' || 'poor')){
      dispatch({ type: "setPietoTopo", payload: { strength: `${params.data.name}` }});
    }else{
      dispatch({ type: "setPietoTopo", payload: { health: `${params.data.name}` }});
    }
    history.push('./topology')
}
  const onEvents = {
    'click': onChartClick,
  }

  return (

    <ReactEchartsCore
      echarts={echarts}
      option={getOption()}
      notMerge={true}
      lazyUpdate={true}
      theme={"theme_name"}
      onEvents= {onEvents}
    />

  );
};
export default PieChartC;
