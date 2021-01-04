import React, { useContext, useEffect, useState, Fragment } from "react";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import styles from "../dashboard.module.scss";
import { Card } from "antd";
import axios from "axios";
import { AxiosRequestConfig } from "axios";

const IoTStatisticC = ({Cate}:{Cate:string}) => {
  const [loading, setLoading] = useState(false);
  const { state } = useContext(Context);
  const level = localStorage.getItem("authUser.level");
  const cid = localStorage.getItem("authUser.cid");
  const history = useHistory();

  const [RouterNum, setRouterNum] = useState<undefined | number>(undefined);
  const [RouterSum, setRouterSum] = useState<undefined | number>(undefined);
  // const [RouterPercentage, setRouterPercentage] = useState<undefined | number>(undefined);
  const [IoTrNum, setIoTrNum] = useState<undefined | number>(undefined);
  useEffect(() => {
    setLoading(true);
    const config: AxiosRequestConfig = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"device_iot":{"filter":{${
          level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
        }}}}}`
      ),
    };
    axios(config)
      .then((res) => {
        if (res.data.response) {
          // console.log(res.data.response);
          const Rawdata = res.data.response.device_iot;
          setRouterSum(Rawdata.length)
          let RouterNum = Rawdata.filter(
            (item: any) => item.obj.iot?.[0]?.data
          );
          let IoTNum = RouterNum.map((item: any) => item.obj.iot.length);
          IoTNum = IoTNum.reduce((a: number, b: number) => a + b, 0);
          setRouterNum(RouterNum.length);
          setIoTrNum(IoTNum);
          // setRouterPercentage(Math.round(RouterNum.length * 100 / Rawdata.length))
        } else {
          setRouterNum(undefined);
          setIoTrNum(undefined);
          setRouterSum(undefined)
          // setRouterPercentage(undefined)
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, [state.Login.Cid]);

  return (


            <div className={styles.RouterCardWrapper}>
                {Cate === 'Router' && <Card onClick={()=>history.push('./iotguage')} className={styles.Card} headStyle={{ padding:0, backgroundColor:'#002FA7', color:'white', fontFamily:'Open Sans', textAlign:'center' }} bodyStyle={{ display:'flex',alignItems:'center', justifyContent:'center', border:'2px solid #002FA7', position:'relative'}} loading={loading} title='Router with IoT '>
                
                    <div className={styles.RouterWrapper}>
                    <p className={styles.RouterDesc}>Total Routers: {RouterSum}</p> 
                    <h2>{RouterNum}</h2>
                    </div>
                  {/* <Row gutter={24} align="middle" style={{height:'100%'}}>
                    <Col span={24}><h2>Router with IoT Connected </h2></Col>
                    <Col span={24}><p className={styles.MainNum}>{RouterNum} / {RouterSum}</p></Col>
                    <Progress percent={RouterPercentage} showInfo={false} style={{width:'90%', marginLeft:'10px'}}/>
                    <Divider style={{marginBottom:'1%', marginTop:'auto%'}}/>
                    <span > Coverage: {RouterPercentage} %</span>
                  </Row> */}
                </Card>}

                {Cate === 'IoT' && <Card onClick={()=>history.push('./iotguage')} className={styles.Card} headStyle={{ padding:0, backgroundColor:'#002FA7', color:'white', fontFamily:'Open Sans', textAlign:'center' }} bodyStyle={{ display:'flex',alignItems:'center', justifyContent:'center', border:'2px solid #002FA7', position:'relative'}} loading={loading} title='IoT '>
                <div className={styles.RouterWrapper}>
                <p className={styles.RouterDesc}>MPTT Devices: {IoTrNum}</p> 
                 <h2>{IoTrNum}</h2>
                 </div>


                 
                  {/* <Row gutter={24} align="middle" style={{height:'100%'}}> 
                    <Col span={24}><h2>Connected IoT #</h2></Col>
                    <Col span={24}><p className={styles.MainNum}>{IoTrNum}</p></Col>
                    <Divider style={{margin:'5px'}}/>
                  </Row> */}
                </Card>}
              </div>


  );
};
export default IoTStatisticC;
