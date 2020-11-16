import React, { Fragment, useEffect, useState, useContext } from "react";
import {
  Tabs,
  Select,
  Descriptions,
  Form,
  Input,
  Modal,
  Spin,
  Alert,
  Tooltip,
  Popconfirm,
  Button,
  Empty
} from "antd";
import styles from "../topology.module.scss";
import axios from "axios";
import { FcSynchronize } from "react-icons/fc";
import { useHistory, useLocation } from 'react-router-dom'
import Context from '../../../../Utility/Reduxx'
import {UserLogOut} from '../../../../Utility/Fetch'

const { TabPane } = Tabs;
const { Option } = Select;

const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 11 },
};

const TopoIoTC = ({ IoTvisible, setIoTvisible, record, setRecord }) => {
  const { dispatch } = useContext(Context)
  const history = useHistory()
  const location = useLocation();
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [IoTData, setIoTData] = useState(null);
  const [FourEightFiveList, setFourEightFiveList] = useState(null);
  const [Refresh, setRefresh] = useState(false);
  const [haveContent, setHaveContent] = useState(false)
  const [Deviceindex, setDeviceindex] = useState(0)
  const onFinish = (values) => {
    console.log(values);
  };
  function handleDeviceChange(value) {
    console.log(`selected ${value}`);
    setDeviceindex(value);
  }


  useEffect(() => {
    if(!record){
      // console.log(record)
      return
    }
    if (record.id) {
      setUploading(true);
      const IoTUrl = Refresh
        ? `/cmd?get={"device_cfg":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{"iot":{}}}}`
        : `/cmd?get={"device_iot":{"filter":{"id":"${record.id}"}}}`;
      console.log(IoTUrl);
      axios
        .get(IoTUrl)
        .then((res) => {
          console.log(res.data)
          if(res.data.response.device_iot && res.data.response.device_iot[0].obj.iot){
            console.log('有data')
            const IoTData = res.data.response.device_iot[0].obj.iot[Deviceindex].data;
            setHaveContent(true)
            setIoTData(IoTData);
            
            res.data.response.device_iot[0].obj.iot.forEach((item)=>{
              let timestamp= new Date(item.timestamp*1000)
              item.timestamp = `${timestamp.getFullYear()}-${
                timestamp.getMonth() + 1
              }-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}`
            })
            setFourEightFiveList(res.data.response.device_iot[0].obj.iot);
            console.log(res.data.response.device_iot[0].obj.iot);
            form.setFieldsValue({
              battery_capacity_ah: IoTData.eeprom.battery_capacity_ah,
              battery_type: IoTData.eeprom.battery_type,
              charge_limit_voltage_v: IoTData.eeprom.charge_limit_voltage_v,
              discharge_limit_voltage_v: IoTData.eeprom.discharge_limit_voltage_v,
              equalizing_charge_interval_day:
                IoTData.eeprom.equalizing_charge_interval_day,
              equalizing_charge_time_min:
                IoTData.eeprom.equalizing_charge_time_min,
              equalizing_charge_voltage_v:
                IoTData.eeprom.equalizing_charge_voltage_v,
              folating_charge_voltage_v: IoTData.eeprom.folating_charge_voltage_v,
              low_voltage_warning_voltage_v:
                IoTData.eeprom.low_voltage_warning_voltage_v,
              over_discharge_delay_s: IoTData.eeprom.over_discharge_delay_s,
              over_discharge_reverse_voltage_v:
                IoTData.eeprom.over_discharge_reverse_voltage_v,
              over_discharge_voltage_v: IoTData.eeprom.over_discharge_voltage_v,
              overvoltage_voltage_v: IoTData.eeprom.overvoltage_voltage_v,
              rasing_charge_reverse_voltage_v:
                IoTData.eeprom.rasing_charge_reverse_voltage_v,
              rasing_charge_time_min: IoTData.eeprom.rasing_charge_time_min,
              rasing_charge_voltage_v: IoTData.eeprom.rasing_charge_voltage_v,
              recognized_voltage_v: IoTData.eeprom.recognized_voltage_v,
              system_voltage_v: IoTData.eeprom.system_voltage_v,
              temperature_coefficient: IoTData.eeprom.temperature_coefficient,
            });
          }else{
            console.log('沒data')
            setHaveContent(false)
          }

          // setRefresh(false);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          // setRefresh(false);
          setUploading(false);
          if (error.response && error.response.status === 401) {
            const isAuthed = localStorage.getItem("auth.isAuthed");
            if (!isAuthed) {
              return;
            }
            dispatch({
              type: "LogPath",
              payload: { LogPath: location.pathname },
            });
            UserLogOut();
            history.push("/login");                                                                         
          } else {
            history.push("/internalerror");
          }

        });
    }
  }, [record.id, Refresh]);

  // const GetIoTDataFromDevice = () => {
  //   const IoTUrl = ;
  // }

  const callback = (key) => {
    console.log(key);
  };

  return (
    <Modal
      visible={IoTvisible}
      onCancel={() => {
        setIoTvisible(false);
        setIoTData(null);
        setRefresh(false);
        setRecord({id:null})
        setHaveContent(false)
        
      }}
      centered={true}
      destroyOnClose={true}
      className={styles.modal}
      footer={[
        <Button
          key="confirm"
          type="primary"
          onClick={() => {
            setIoTvisible(false);
            setIoTData(null);
            setRefresh(false);
            setRecord({id:null})
            setHaveContent(false)
          }}
        >
          Confirm
        </Button>,
      ]}
    >
      {IoTData && !uploading ? (
        <Fragment>
          <Select
            value={FourEightFiveList && FourEightFiveList[0].id}
            className={styles.FourEightFiveBar}
            onChange={handleDeviceChange}
          >
            {FourEightFiveList &&
              FourEightFiveList.map((item, index) => {
                return (
                  <Option key={index} value={index}>
                    {item.id} ({item.name})
                  </Option>
                );
              })}
          </Select>

            <div style={{display:"flex"}}>
            <p>LastUpdate: {FourEightFiveList[`${Deviceindex}`].timestamp}</p>
            <Tooltip title="Re-get data from Device">
            <Popconfirm
              title="Will cause extra data usage, sure to refresh?"
              onConfirm={() => {
                setRefresh(true);
                setHaveContent(false)
              }}
            >
              <FcSynchronize className={styles.Refresh} />
            </Popconfirm>
          </Tooltip>
            </div>
            
          <Tabs defaultActiveKey="Today" onChange={callback}>
            <TabPane tab="Today" key="Today" className={styles.tabpane}>
              <Descriptions
                bordered
                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                className={styles.desc}
              >
                <Descriptions.Item label="Battery" className={styles.descItem}>
                  Minimal Voltage:
                  {IoTData.controller.today.battery.min_voltage_v}
                  (V)
                  <br />
                  Maximum Voltage:
                  {IoTData.controller.today.battery.max_voltage_v}
                  (V)
                  <br />
                </Descriptions.Item>
                <Descriptions.Item label="Charge" className={styles.descItem}>
                  Maximum Current:
                  {IoTData.controller.today.charge.max_current_a}
                  (A)
                  <br />
                  AH:
                  {IoTData.controller.today.charge.ampere_hour_ah}
                  (A/H)
                  <br />
                  Watt: {IoTData.controller.today.charge.watt_w}(W)
                  <br />
                  Maximum Watt:
                  {IoTData.controller.today.charge.max_watt_w}(W)
                  <br />
                  Total Watt:
                  {IoTData.controller.today.charge.total_watt_w}(W)
                  <br />
                </Descriptions.Item>
                <Descriptions.Item
                  label="Discharge"
                  className={styles.descItem}
                >
                  Maximum Current:
                  {IoTData.controller.today.discharge.max_current_a}
                  (A)
                  <br />
                  AH:
                  {IoTData.controller.today.discharge.ampere_hour_ah}
                  (A/H)
                  <br />
                  Watt: {IoTData.controller.today.discharge.watt_w}
                  (W)
                  <br />
                  Maximum Watt:
                  {IoTData.controller.today.discharge.max_watt_w}
                  (W)
                  <br />
                  Total Watt:
                  {IoTData.controller.today.discharge.total_watt_w}
                  (W)
                  <br />
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Solar Pannel" key="Pannel" className={styles.tabpane}>
              <Descriptions
                bordered
                className={styles.desc}
                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
              >
                <Descriptions.Item label="Current">
                  {IoTData.controller.solar_pannel.current_a} (A)
                </Descriptions.Item>
                <Descriptions.Item label="Voltage">
                  {IoTData.controller.solar_pannel.voltage_v} (V)
                </Descriptions.Item>
                <Descriptions.Item label="Watt">
                  {IoTData.controller.solar_pannel.watt_w} (W)
                </Descriptions.Item>
                <Descriptions.Item label="Temperature">
                  {IoTData.controller.temperature_c}
                  (C)
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Battery" key="Battery" className={styles.tabpane}>
              <Descriptions bordered className={styles.desc}>
                <Descriptions.Item label="Charge Current">
                  {IoTData.controller.battery.charge_current_a} (A)
                </Descriptions.Item>
                <Descriptions.Item label="Full Charged Time">
                  {IoTData.controller.battery.full_charged_time}
                </Descriptions.Item>
                <Descriptions.Item label="Over Discharged Time">
                  {IoTData.controller.battery.over_discharged_time}
                </Descriptions.Item>
                <Descriptions.Item label="SOC">
                  {IoTData.controller.battery.soc_percentage} (%)
                </Descriptions.Item>
                <Descriptions.Item label="Temperature">
                  {IoTData.controller.battery.temperature_c} (C)
                </Descriptions.Item>
                <Descriptions.Item label="Total Charge">
                  {IoTData.controller.battery.total_charge_ah}
                  (A/H)
                </Descriptions.Item>
                <Descriptions.Item label="Total Discharge">
                  {IoTData.controller.battery.total_discharge_ah}
                  (A/H)
                </Descriptions.Item>
                <Descriptions.Item label="Voltage">
                  {IoTData.controller.battery.voltage_v} (V)
                </Descriptions.Item>
                <Descriptions.Item label="Charge State">
                  {IoTData.controller.charge_state} (W)
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Load" key="Load" className={styles.tabpane}>
              <Descriptions
                bordered
                className={styles.desc}
                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
              >
                <Descriptions.Item label="Current">
                  {IoTData.controller.load.current_a} (A)
                </Descriptions.Item>
                <Descriptions.Item label="Voltage">
                  {IoTData.controller.load.voltage_v} (V)
                </Descriptions.Item>
                <Descriptions.Item label="Watt">
                  {IoTData.controller.load.watt_w} (W)
                </Descriptions.Item>
                <Descriptions.Item label="Load Light">
                  {IoTData.controller.load_light_percentage}
                  (%)
                </Descriptions.Item>
                <Descriptions.Item label="Load ON/OFF">
                  {IoTData.controller.load_on_off}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="eeprom" key="eeprom" className={styles.tabpane}>
              <Form
                {...layout}
                name="nest-messages"
                onFinish={onFinish}
                form={form}
              >
                <Form.Item
                  name="battery_capacity_ah"
                  label="Battery Capacity (AH)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item name="battery_type" label="Battery Type">
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="charge_limit_voltage_v"
                  label="Charge limit(V)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="discharge_limit_voltage_v"
                  label="Discharge limit(V)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="equalizing_charge_interval_day"
                  label="Equalizing Charge Interval(day)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="equalizing_charge_time_min"
                  label="Equalizing Charge time(min)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="equalizing_charge_voltage_v"
                  label="Equalizing Charge(V)"
                >
                  <Input className={styles.IoTinput} disabled={true} />
                </Form.Item>
                <Form.Item
                  name="folating_charge_voltage_v"
                  label="Folating Charge(V)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="low_voltage_warning_voltage_v"
                  label="Low Voltage warning(V)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="over_discharge_delay_s"
                  label="Over Discharge delay(s)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="over_discharge_reverse_voltage_v"
                  label="Over Discharge reverse(V)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="over_discharge_voltage_v"
                  label="Over Discharge(V)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item name="overvoltage_voltage_v" label="Overvoltage(V)">
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="rasing_charge_reverse_voltage_v"
                  label="Rasing Charge Reverse Voltage(V)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="rasing_charge_time_min"
                  label="Rasing charge time min"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="rasing_charge_voltage_v"
                  label="Rasing charge(V)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="recognized_voltage_v"
                  label="Recognized Voltage(V)"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item name="system_voltage_v" label="System Voltage(V)">
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
                <Form.Item
                  name="temperature_coefficient"
                  label="Temp Coefficient"
                >
                  <Input className={styles.IoTinput} disabled={true}/>
                </Form.Item>
              </Form>
            </TabPane>
            <TabPane tab="system" key="system" className={styles.tabpane}>
              <Descriptions
                bordered
                className={styles.desc}
                column={{ xxl: 2, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
              >
                <Descriptions.Item label="Charge Current">
                  {IoTData.system.charge_current_a} (A)
                </Descriptions.Item>
                <Descriptions.Item label="Discharge Current">
                  {IoTData.system.discharge_current_a} (A)
                </Descriptions.Item>
                <Descriptions.Item label="Voltage_max">
                  {IoTData.system.max_voltage_v} (V)
                </Descriptions.Item>
                <Descriptions.Item label="Hardware Version">
                  {IoTData.system.hardware_version}
                </Descriptions.Item>
                <Descriptions.Item label="Serial Number">
                  {IoTData.system.serial_number}
                </Descriptions.Item>
                <Descriptions.Item label="Software Version">
                  {IoTData.system.software_version}
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
          </Tabs>
        </Fragment>
      ) : (
        !haveContent && uploading ?  
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
        :<Empty description={
          <span>
            No Data
          </span>
        }/> 
      )}
    </Modal>
  );
};

export const TopoIoTMC = React.memo(TopoIoTC);
