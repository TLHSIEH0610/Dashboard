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
import { Card } from "antd";
import { BsFillSquareFill } from "react-icons/bs";
import axios from "axios";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useTranslation } from "react-i18next";

const PieChartPeriod_ = ({ Cate, IsUpdate }:{ Cate:any, IsUpdate:boolean }) => {
  const history = useHistory();
  const { state, dispatch } = useContext(Context);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const [period, setPeriod] = useState<undefined | any>({})
  const [count, setCount] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    // setLoading(true)
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"device_status":{"filter":{${level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
        }},"nodeInf":{},"obj":{}}}}`
      ),
    };
    console.log('執行pi period')
    const stateInterval = setInterval(() => {
      setCount((prevState) => prevState + 1);
    }, 10000);

    axios(config)
      .then((res) => { 
        const dateTime = Date.now();
        const utc_timestamp = Math.floor(dateTime / 1000)
        // console.log(utc_timestamp)
        let nonOffline =  res.data?.response?.device_status?.filter((item:any)=>item.nodeInf.health !== 'offline')
        const utcBias = nonOffline?.map((item:any)=>{
          return  (utc_timestamp-item.nodeInf.lastUpdate)-28800
        })
        const PeriodA:number[] = utcBias.filter((item:number)=>item<=40)
        const PeriodB:number[]  = utcBias.filter((item:number)=>item>40 && item<=60)
        const PeriodC:number[]  = utcBias.filter((item:number)=>item>60)
        const PeriodD:number[]  = res.data?.response?.device_status?.filter((item:any)=>item.nodeInf.health === 'offline')

        const TimetoOsmart = nonOffline?.map((item:any)=>item.nodeInf.sub_utc)
        const PeriodE:number[] = TimetoOsmart.filter((item:number)=>item<=40)
        const PeriodF:number[]  = TimetoOsmart.filter((item:number)=>item>40 && item<=60)
        const PeriodG:number[]  = TimetoOsmart.filter((item:number)=>item>60) 
        // console.log(PeriodA, PeriodB, PeriodC, PeriodE, PeriodF, PeriodG)
        setPeriod({PeriodA:PeriodA.length, PeriodB:PeriodB.length, PeriodC:PeriodC.length, PeriodD:PeriodD.length,PeriodE:PeriodE.length, PeriodF:PeriodF.length,PeriodG:PeriodG.length})
        // setLoading(false);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
        // setLoading(false);
      });

      return () => clearInterval(stateInterval);
      // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.Login.Cid, count, IsUpdate]);


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
  



  return (
    // <Fragment>
    <div className={styles.PieWrapper}>
    
        {Cate === "period" && <Card
          title={t("ISMS.LastUpdate")}
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
          
              <Fragment>
                <p className={styles.PieSum}>{`${period?.PeriodA+period?.PeriodB+period?.PeriodC+period?.PeriodD}`}</p>
                <div className={styles.legendWrapper}>
                  <div className={styles.legend} style={{ color: "#28a745" }}>
                    <BsFillSquareFill />
                    <p>
                    0~40: {period?.PeriodA}
                    </p>
                  </div>
                  <div className={styles.legend} style={{ color: "#ffc107" }}>
                    <BsFillSquareFill />
                    <p>
                    41~60: {period?.PeriodB}
                    </p>
                  </div>
                  <div className={styles.legend} style={{ color: "#dc3545" }}>
                    <BsFillSquareFill />
                    <p>
                    60 ~: {period?.PeriodC}
                    </p>
                  </div>
                  <div className={styles.legend} style={{ color: "#343a40" }}>
                    <BsFillSquareFill />
                    <p>
                    Offline : {period?.PeriodD}
                    </p>
                  </div>
                </div>
                <ReactEchartsCore
                  className={styles.PieChart}
                  echarts={echarts}
                  //@ts-ignore
                  option={getOption(
                    [
                      period?.PeriodA,
                      period?.PeriodB,
                      period?.PeriodC,
                      period?.PeriodD,
                    ],
                    [
                      "0~40",
                      "41~60",
                      "60~~",
                      "Offline",
                    ]
                  )}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={"theme_name"}
                  // onEvents={onEvents}
                />
              </Fragment>
        </Card>}

        {Cate === "periodupdate" && <Card
          title={t("ISMS.PeriodUpdate")}
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
          
              <Fragment>
                <p className={styles.PieSum}>{`${period?.PeriodE+period?.PeriodF+period?.PeriodG+period?.PeriodD}`}</p>
                <div className={styles.legendWrapper}>
                  <div className={styles.legend} style={{ color: "#28a745" }}>
                    <BsFillSquareFill />
                    <p>
                    0~40: {period?.PeriodE}
                    </p>
                  </div>
                  <div className={styles.legend} style={{ color: "#ffc107" }}>
                    <BsFillSquareFill />
                    <p>
                    41~60: {period?.PeriodF}
                    </p>
                  </div>
                  <div className={styles.legend} style={{ color: "#dc3545" }}>
                    <BsFillSquareFill />
                    <p>
                    60 ~: {period?.PeriodG}
                    </p>
                  </div>
                  <div className={styles.legend} style={{ color: "#343a40" }}>
                    <BsFillSquareFill />
                    <p>
                    Offline : {period?.PeriodD}
                    </p>
                  </div>
                </div>
                <ReactEchartsCore
                  className={styles.PieChart}
                  echarts={echarts}
                  //@ts-ignore
                  option={getOption(
                    [
                      period?.PeriodE,
                      period?.PeriodF,
                      period?.PeriodG,
                      period?.PeriodD,
                    ],
                    [
                      "0~40",
                      "41~60",
                      "60~~",
                      "Offline",
                    ]
                  )}
                  notMerge={true}
                  lazyUpdate={true}
                  theme={"theme_name"}
                  // onEvents={onEvents}
                />
              </Fragment>
        </Card>}
      

    </div>
    // </Fragment>
  );
};

export const PieChartPeriod =   React.memo(PieChartPeriod_);