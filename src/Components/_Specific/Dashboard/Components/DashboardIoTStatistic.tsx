import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import styles from "../dashboard.module.scss";
import { Card, Spin } from "antd";
import axios from "axios";
import { AxiosRequestConfig } from "axios";
import { useTranslation } from "react-i18next";

const IoTStatisticC = ({ Cate, IsUpdate }: { Cate: string, IsUpdate: boolean }) => {
  const [loading, setLoading] = useState(false);
  const { state } = useContext(Context);
  const level = localStorage.getItem("authUser.level");
  const cid = localStorage.getItem("authUser.cid");
  const history = useHistory();
  const { t } = useTranslation();
  const [RouterwithFlowNum, setRouterwithFlowNum] = useState<
    undefined | number
  >(undefined);
  const [RouterSum, setRouterSum] = useState<undefined | number>(undefined);
  // const [RouterPercentage, setRouterPercentage] = useState<undefined | number>(undefined);
  const [FlowsNum, setFlowsNum] = useState<undefined | number>(undefined);
  useEffect(() => {
    setLoading(true);
    const config: AxiosRequestConfig = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"device_status":{"filter":{${level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
        }}}}}`
      ),
    };

    axios(config)
      .then((res) => {
        if (res.data.response) {
          // console.log(res.data.response);
          const Rawdata = res.data.response.device_status;
          setRouterSum(Rawdata.length);
          let RouterwithFlowNum = Rawdata.filter(
            (item: any) => item.obj.status?.flows?.number >= 0
          );
          let FlowsNum = RouterwithFlowNum.map(
            (item: any) => item.obj.status.flows.number
          );
          FlowsNum = FlowsNum.reduce((a: number, b: number) => a + b, 0);
          setRouterwithFlowNum(RouterwithFlowNum.length);
          setFlowsNum(FlowsNum);
          // setRouterPercentage(Math.round(RouterwithFlowNum.length * 100 / Rawdata.length))
        } else {
          setRouterwithFlowNum(undefined);
          setFlowsNum(undefined);
          setRouterSum(undefined);
          // setRouterPercentage(undefined)
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [state.Login.Cid, IsUpdate]);

  return (
    <div className={styles.RouterCardWrapper}>
      {Cate === "Router" && (
        <Card
          className={styles.Card}
          headStyle={{
            padding: 0,
            backgroundColor: "#002FA7",
            color: "white",
            fontFamily: "Open Sans",
            textAlign: "center",
          }}
          bodyStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #002FA7",
            position: "relative",
          }}
          // loading={loading}
          title={t("ISMS.RouterwithFlow")}
        >
          {loading ? <Spin>
            <div className={styles.RouterWrapper}>
            <h2>0</h2>
          </div>

          </Spin> :
            <div className={styles.RouterWrapper}>
              <p className={styles.RouterDesc}>
                {t("ISMS.TotalRouters")}: {RouterSum}
              </p>
              <h2>{RouterwithFlowNum}</h2>
            </div>
          }

        </Card>
      )}

      {Cate === "IoT" && (
        <Card
          style={{ cursor: 'pointer' }}
          onClick={() => history.push("./iotguage")}
          className={styles.Card}
          headStyle={{
            padding: 0,
            backgroundColor: "#002FA7",
            color: "white",
            fontFamily: "Open Sans",
            textAlign: "center",
          }}
          bodyStyle={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "2px solid #002FA7",
            position: "relative",
          }}
          // loading={loading}
          title={t("ISMS.IoTFlow")}
        >
          {loading ? <Spin><div className={styles.RouterWrapper}>
            <h2>0</h2>
          </div></Spin> : <div className={styles.RouterWrapper}>
            <h2>{FlowsNum}</h2>
          </div>}

        </Card>
      )}
    </div>
  );
};
export default IoTStatisticC;
