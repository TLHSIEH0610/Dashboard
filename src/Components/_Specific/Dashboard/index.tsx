import React, { useState, useEffect, useContext } from "react";
import useURLloader from "../../../hook/useURLloader";
import { PieChartC } from "./Components/PieChart";
import Context from "../../../Utility/Reduxx";
import DashboardMapC from "./Components/DashboardMap";
import IoTStatisticC from "./Components/DashboardIoTStatistic";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ImageList from "./Components/test";
import update from "immutability-helper";
import styles from "./dashboard.module.scss";
import { FcEngineering, FcSynchronize } from "react-icons/fc";
import { Popover, Form, Checkbox, Divider, Button, Tooltip } from "antd";
import { useTranslation } from 'react-i18next';

import { FaAutoprefixer } from 'react-icons/fa'


interface Iprops {
  id?: string;
  src?: Element | any;
  show?: Boolean;
  className?: string;
  IsUpdate?: boolean;
}

const DashboardC = () => {
  const { t } = useTranslation();
  const { state } = useContext(Context);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const [IsUpdate, setIsUpdate] = useState(false)
  const [AutoRefresh, setAutoRefresh ] =useState(false)
  const StatisticUrl = "/cmd";
  const Urldata = `{"get":{"statistic":{"filter":{${level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
    }}}}}`;
  const [StatisticLoading, StatisticResponse] = useURLloader(
    StatisticUrl,
    Urldata, IsUpdate
  );
  
  const [count, setCount] = useState(0);
  // const [PieData, setPieData] = useState([]);
  const [form] = Form.useForm()
  const [show, setShow] = useState<any>({ PieHealth: true, PieSignal: true, PiePeriod: false, PiePeriodUpdate: false, Router: true, IoT: true, Map: true })
  const onFinish = (value: any) => {
    setShow({ PieHealth: value.PieHealth, PieSignal: value.PieSignal, PiePeriod: value.PiePeriod, PiePeriodUpdate: value.PiePeriodUpdate, Router: value.Router, IoT: value.IoT, Map: value.Map })
  }
  form.setFieldsValue(show)
  useEffect(()=>{
    if(!AutoRefresh){
      return
    }
      // console.log('有執行')
      // setIsUpdate(!IsUpdate)
      setIsUpdate(!IsUpdate)
      const stateInterval = setInterval(() => {
        setCount((prevState) => prevState + 1);
      }, 10000);

    return () => clearInterval(stateInterval);

  },[AutoRefresh, count])

  const content = (
    <Form form={form} onFinish={onFinish}>
      <Form.Item
        name="PieHealth"
        valuePropName="checked"
        style={{ marginBottom: 0 }}
      >
        <Checkbox>{t("ISMS.DevicesHealth")}</Checkbox>
      </Form.Item>
      <Form.Item
        name="PieSignal"
        valuePropName="checked"
        style={{ marginBottom: 0 }}
      >
        <Checkbox>{t("ISMS.DevicesStrength")}</Checkbox>
      </Form.Item>
      {level === 'super_super' && <Form.Item
        name="PiePeriod"
        valuePropName="checked"
        style={{ marginBottom: 0 }}
      >
        <Checkbox>{t("ISMS.LastUpdate")}</Checkbox>
      </Form.Item>}
      {level === 'super_super' && <Form.Item
        name="PiePeriodUpdate"
        valuePropName="checked"
        style={{ marginBottom: 0 }}
      >
        <Checkbox>{t("ISMS.PeriodUpdate")}</Checkbox>
      </Form.Item>}
      <Form.Item
        name="Router"
        valuePropName="checked"
        style={{ marginBottom: 0 }}
      >
        <Checkbox>{t("ISMS.RouterwithFlow")}</Checkbox>
      </Form.Item>
      <Form.Item
        name="IoT"
        valuePropName="checked"
        style={{ marginBottom: 0 }}
      >
        <Checkbox>{t("ISMS.TotalRouters")}</Checkbox>
      </Form.Item>
      <Form.Item
        name="Map"
        valuePropName="checked"
        style={{ marginBottom: 0 }}
      >
        <Checkbox>{t("ISMS.Map")}</Checkbox>
      </Form.Item>
      <Divider style={{ marginBottom: "10px", marginTop: 0 }} />
      <Form.Item style={{ marginBottom: 0 }}>
        <Button htmlType="submit" onClick={() => { }}>
          {t("ISMS.Confirm")}
        </Button>
      </Form.Item>
    </Form>
  );
  const [images, setImages] = useState<Iprops[]>([ ]);

  useEffect(() => {
    if (StatisticResponse?.response?.statistic) {
      const PieData = StatisticResponse.response.statistic.obj;

      // setPieData(PieData);
      let Images = ([
        {
          id: "PieHealth",
          src: (
            <PieChartC
              StatisticLoading={false}
              PieData={PieData}
              Cate={"health"}
              IsUpdate={IsUpdate}
            />
          ),
          className: `${styles.CardItem}`,
        },
        {
          id: "PieSignal",
          src: (
            <PieChartC
              StatisticLoading={false}
              PieData={PieData}
              Cate={"signal"}
              IsUpdate={IsUpdate}
            />
          ),
          className: `${styles.CardItem}`,
        },
        {
          id: "PiePeriod",
          src: (
            <PieChartC
              IsUpdate={IsUpdate}
              Cate={"period"}
            />
          ),
          className: `${styles.CardItem}`,
        },
        {
          id: "PiePeriodUpdate",
          src: (
            <PieChartC

              IsUpdate={IsUpdate}
              Cate={"periodupdate"}
            />
          ),
          className: `${styles.CardItem}`,
        },
        {
          id: "Router",
          src: <IoTStatisticC Cate="Router" IsUpdate={IsUpdate}/>,
          className: `${styles.CardItem}`,
          // show: true,
        },
        {
          id: "IoT",
          src: <IoTStatisticC Cate="IoT" IsUpdate={IsUpdate}/>,
          className: `${styles.CardItem}`,
          // show: true
        },
        {
          id: "Map",
          src: <DashboardMapC />,
          className: `${styles.CardItemMap}`,
          // show: true
        },
      ]);
      Images = Images.filter((item:{id:string, src?:any, className:string})=>show[`${item.id}`])
      console.log(Images)
      setImages(Images)
    } 
  }, [StatisticResponse, state.Login.Cid, show]);

  const moveImage = (dragIndex: any, hoverIndex: any) => {
    const draggedImage = images[dragIndex];

    setImages(
      update(images, {
        $splice: [
          [dragIndex, 1],
          [hoverIndex, 0, draggedImage],
        ],
      })
    );
  };


  
  return (
    <div style={{ position: 'relative' }}>
      <div className={styles.iconBackground}>
        
      <Tooltip title={t("ISMS.Refresh")}>
        <Button
          icon={<FcSynchronize style={{fontSize:'1.5rem'}}/>}
          className={styles.btn}
          onClick={() => setIsUpdate(!IsUpdate)}
        />
      </Tooltip>
      <Tooltip title={t("ISMS.AutoRefresh")}>
      <Button className={styles.btn} style={AutoRefresh ? {background:'#FFEFD5'} : undefined} onClick={()=>setAutoRefresh(!AutoRefresh)} icon={<div className={styles.autoRefresh}> <FcSynchronize style={{fontSize:'1.5rem'}}/><FaAutoprefixer className={styles.alphet}/></div>} />
      </Tooltip>
      <Tooltip title={t("ISMS.Setting")}>
      <Popover placement="left" content={content} trigger="click">
        <Button className={styles.btn} icon={<FcEngineering style={{fontSize:'1.5rem'}} className={styles.settingIcon} />}/>
      </Popover>
      </Tooltip>
      </div>
      <DndProvider backend={HTML5Backend}>
        <ImageList images={images} moveImage={moveImage}  />
      </DndProvider>
    </div>
  );
};

export default DashboardC;
