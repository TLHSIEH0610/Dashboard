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
  Empty,
} from "antd";
import styles from "../topology.module.scss";
import axios from "axios";
import { FcSynchronize } from "react-icons/fc";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { UserLogOut } from "../../../../Utility/Fetch";


const { TabPane } = Tabs;
const { Option } = Select;

const layout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 11 },
};

const TopoIoTC = ({ IoTvisible, setIoTvisible, record, setRecord }) => {
  const { dispatch } = useContext(Context);
  const history = useHistory();
  // const location = useLocation();
  const [uploading, setUploading] = useState(false);
  const [form] = Form.useForm();
  const [IoTData, setIoTData] = useState(null);
  const [FourEightFiveList, setFourEightFiveList] = useState(null);
  const [Refresh, setRefresh] = useState(false);
  const [haveContent, setHaveContent] = useState(false);
  const [Deviceindex, setDeviceindex] = useState(0);
  const [Editable, setEditable] = useState(false) 
  const [CurrentPage,setCurrentPage] =useState('1')
  const level = localStorage.getItem('authUser.level')

  const onFinish = (values) => {
    console.log(values);
  };
  function handleDeviceChange(value) {
    console.log(`selected ${value}`);
    setDeviceindex(value);
  }

  useEffect(() => {
    if (!record) {
      // console.log(record)
      return;
    }
    if (record.id) {
      setUploading(true);
      const IoTUrl = Refresh
        ? `/cmd?get={"device_cfg":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{"iot":{}}}}`
        : `/cmd?get={"device_iot":{"filter":{"id":"${record.id}"}}}`;
      console.log(IoTUrl);
      axios
        .post(IoTUrl)
        .then((res) => {
          console.log(res.data);
          if (!Refresh &&
            res.data.response.device_iot[0] &&
            res.data.response.device_iot[0].obj.iot
          ) {
            console.log("有data");
            const IoTData =
              res.data.response.device_iot[0].obj.iot[Deviceindex].data;
            setHaveContent(true);
            setIoTData(IoTData);

            res.data.response.device_iot[0].obj.iot.forEach((item) => {
              let timestamp = new Date(item.timestamp * 1000);
              item.timestamp = `${timestamp.getFullYear()}-${
                timestamp.getMonth() + 1
              }-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}`;
            });
            setFourEightFiveList(res.data.response.device_iot[0].obj.iot);
            console.log(res.data.response.device_iot[0].obj.iot);
            form.setFieldsValue({
              battery_capacity_ah: IoTData.eeprom.battery_capacity_ah,
              battery_type: IoTData.eeprom.battery_type,
              charge_limit_voltage_v: IoTData.eeprom.charge_limit_voltage_v,
              discharge_limit_voltage_v:
                IoTData.eeprom.discharge_limit_voltage_v,
              equalizing_charge_interval_day:
                IoTData.eeprom.equalizing_charge_interval_day,
              equalizing_charge_time_min:
                IoTData.eeprom.equalizing_charge_time_min,
              equalizing_charge_voltage_v:
                IoTData.eeprom.equalizing_charge_voltage_v,
              folating_charge_voltage_v:
                IoTData.eeprom.folating_charge_voltage_v,
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
          }else if(Refresh &&
            res.data.response.device_cfg[0] &&
            res.data.response.device_cfg[0].obj.iot){
              console.log("有data");
              const IoTData =
                res.data.response.device_cfg[0].obj.iot[Deviceindex].data;
              setHaveContent(true);
              setIoTData(IoTData);
  
              res.data.response.device_cfg[0].obj.iot.forEach((item) => {
                let timestamp = new Date(item.timestamp * 1000);
                item.timestamp = `${timestamp.getFullYear()}-${
                  timestamp.getMonth() + 1
                }-${timestamp.getDate()} ${timestamp.getHours()}:${timestamp.getMinutes()}`;
              });
              setFourEightFiveList(res.data.response.device_cfg[0].obj.iot);
              console.log(res.data.response.device_cfg[0].obj.iot);
              form.setFieldsValue({
                battery_capacity_ah: IoTData.eeprom.battery_capacity_ah,
                battery_type: IoTData.eeprom.battery_type,
                charge_limit_voltage_v: IoTData.eeprom.charge_limit_voltage_v,
                discharge_limit_voltage_v:
                  IoTData.eeprom.discharge_limit_voltage_v,
                equalizing_charge_interval_day:
                  IoTData.eeprom.equalizing_charge_interval_day,
                equalizing_charge_time_min:
                  IoTData.eeprom.equalizing_charge_time_min,
                equalizing_charge_voltage_v:
                  IoTData.eeprom.equalizing_charge_voltage_v,
                folating_charge_voltage_v:
                  IoTData.eeprom.folating_charge_voltage_v,
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
          }
          else {
            console.log("沒data");
            setHaveContent(false);
          }

          // setRefresh(false);
          setUploading(false);
        })
        .catch((error) => {
          console.log(error);
          setUploading(false);
          if (error.response && error.response.status === 401) {
            dispatch({ type: "setLogin", payload: { IsLogin: false } });
            UserLogOut();
            history.push("/userlogin");
          } else {
            history.push("/internalerror");
          }
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.id, Refresh]);

  const callback = (page) => {
    setCurrentPage(page)
  };

  return (
    <Modal
      visible={IoTvisible}
      onCancel={() => {
        setIoTvisible(false);
        setIoTData(null);
        setRefresh(false);
        setRecord({ id: null });
        setHaveContent(false);
      }}
      centered={true}
      destroyOnClose={true}
      className={styles.modal}
      footer={[
        (level==='super_super' && CurrentPage ==='5' )&& 
        <Button
        key="Edit"
        onClick={() => {
          setEditable(!Editable)
        }}
      >
        Edit
      </Button>,
        <Button
          key="confirm"
          type="primary"
          onClick={() => {
            setIoTvisible(false);
            setIoTData(null);
            setRefresh(false);
            setRecord({ id: null });
            setHaveContent(false);
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

          <div style={{ display: "flex" }}>
            <p>LastUpdate: {FourEightFiveList[`${Deviceindex}`].timestamp}</p>
            <Tooltip title="Re-get data from Device">
              <Popconfirm
                title="Will cause extra data usage, sure to refresh?"
                onConfirm={() => {
                  setRefresh(true);
                  setHaveContent(false);
                }}
              >
                <FcSynchronize className={styles.Refresh} />
              </Popconfirm>
            </Tooltip>
          </div>

          <Tabs defaultActiveKey="1" onChange={callback}>
            <TabPane tab="Today" key="1" className={styles.tabpane}>
              <Descriptions
                bordered
                column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 1, xs: 1 }}
                className={styles.desc}
              >
                <Descriptions.Item
                  label="Battery Minimal Voltage"
                  className={styles.descItem}
                >
                  {IoTData.controller.today.battery.min_voltage_v}
                  (V)
                </Descriptions.Item>
                <Descriptions.Item
                  label="Battery Maximum Voltage"
                  className={styles.descItem}
                >
                  {IoTData.controller.today.battery.max_voltage_v}
                  (V)
                </Descriptions.Item>
                <Descriptions.Item
                  label="Charge Maximum Current"
                  className={styles.descItem}
                >
                  {IoTData.controller.today.charge.max_current_a}
                  (A)
                </Descriptions.Item>
                <Descriptions.Item label="Charge AH" className={styles.descItem}>
                  {IoTData.controller.today.charge.ampere_hour_ah}
                  (A/H)
                </Descriptions.Item>
                <Descriptions.Item label="Charge Watt" className={styles.descItem}>
                  {IoTData.controller.today.charge.watt_w}(W)
                </Descriptions.Item>
                <Descriptions.Item
                  label="Charge Maximum Watt"
                  className={styles.descItem}
                >
                  {IoTData.controller.today.charge.max_watt_w}(W)
                </Descriptions.Item>
                <Descriptions.Item
                  label="Charge Total Watt"
                  className={styles.descItem}
                >
                  {IoTData.controller.today.charge.total_watt_w}(W)
                </Descriptions.Item>
                <Descriptions.Item
                  label="Discharge Maximum Current"
                  className={styles.descItem}
                >
                  {IoTData.controller.today.discharge.max_current_a}
                  (A)
                </Descriptions.Item>
                <Descriptions.Item label="Discharge AH" className={styles.descItem}>
                  {IoTData.controller.today.discharge.ampere_hour_ah}
                  (A/H)
                </Descriptions.Item>
                <Descriptions.Item label="Discharge Watt" className={styles.descItem}>
                  {IoTData.controller.today.discharge.watt_w}
                  (W)
                </Descriptions.Item>
                <Descriptions.Item
                  label="Discharge Maximum Watt"
                  className={styles.descItem}
                >
                  {IoTData.controller.today.discharge.max_watt_w}
                  (W)
                </Descriptions.Item>
                <Descriptions.Item
                  label="Discharge Total Watt"
                  className={styles.descItem}
                >
                  {IoTData.controller.today.discharge.total_watt_w}
                  (W)
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Solar Pannel" key="2" className={styles.tabpane}>
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
            <TabPane tab="Battery" key="3" className={styles.tabpane}>
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
                  {IoTData.controller.charge_state} 
                </Descriptions.Item>
              </Descriptions>
            </TabPane>
            <TabPane tab="Load" key="4" className={styles.tabpane}>
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
            <TabPane tab="eeprom" key="5" className={styles.tabpane}>
              <Form
                {...layout}
                name="nest-messages"
                onFinish={onFinish}
                form={form}
              >
                <Descriptions
                  bordered
                  className={styles.desc}
                  column={{ xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }}
                >
                  <Descriptions.Item label="Battery Capacity">
                    {Editable ? (
                      <Form.Item
                        name="battery_capacity_ah"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.battery_capacity_ah
                    )} (AH)
                  </Descriptions.Item>
                  <Descriptions.Item label="Battery Type">
                    {Editable ? (
                      <Form.Item name="battery_type">
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.battery_type
                    )}
                  </Descriptions.Item>

                  <Descriptions.Item label="Charge limit">
                    {Editable ? (
                      <Form.Item
                        name="charge_limit_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.charge_limit_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Discharge limit">
                    {Editable ? (
                      <Form.Item
                        name="discharge_limit_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.discharge_limit_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Equalizing Charge Interval">
                    {Editable ? (
                      <Form.Item
                        name="equalizing_charge_interval_day"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.equalizing_charge_interval_day
                    )} (day)
                  </Descriptions.Item>

                  <Descriptions.Item label="Equalizing Charge time">
                    {Editable ? (
                      <Form.Item
                        name="equalizing_charge_time_min"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.equalizing_charge_time_min 
                    )} (min)
                  </Descriptions.Item>

                  <Descriptions.Item label="Equalizing Charge">
                    {Editable ? (
                      <Form.Item
                        name="equalizing_charge_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.equalizing_charge_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Folating Charge">
                    {Editable ? (
                      <Form.Item
                        name="folating_charge_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.folating_charge_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Low Voltage warning">
                    {Editable ? (
                      <Form.Item
                        name="low_voltage_warning_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.low_voltage_warning_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Over Discharge delay">
                    {Editable ? (
                      <Form.Item
                        name="over_discharge_delay_s"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.over_discharge_delay_s
                    )} (s)
                  </Descriptions.Item>
                  <Descriptions.Item label="Over Discharge reverse">
                    {Editable ? (
                      <Form.Item
                        name="over_discharge_reverse_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.over_discharge_reverse_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Over Discharge">
                    {Editable ? (
                      <Form.Item
                        name="over_discharge_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.over_discharge_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Overvoltage">
                    {Editable ? (
                      <Form.Item
                        name="overvoltage_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.overvoltage_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Rasing Charge Reverse Voltage">
                    {Editable ? (
                      <Form.Item
                        name="rasing_charge_reverse_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.rasing_charge_reverse_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Rasing charge time">
                    {Editable ? (
                      <Form.Item
                        name="rasing_charge_time_min"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.rasing_charge_time_min
                    )} (min)
                  </Descriptions.Item>

                  <Descriptions.Item label="Rasing charge">
                    {Editable ? (
                      <Form.Item
                        name="rasing_charge_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.rasing_charge_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Recognized Voltage">
                    {Editable ? (
                      <Form.Item
                        name="recognized_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.recognized_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="System Voltage">
                    {Editable ? (
                      <Form.Item
                        name="system_voltage_v"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.system_voltage_v
                    )} (V)
                  </Descriptions.Item>

                  <Descriptions.Item label="Temp Coefficient">
                    {Editable ? (
                      <Form.Item
                        name="temperature_coefficient"
                      >
                        <Input className={styles.IoTinput} disabled={true} />
                      </Form.Item>
                    ) : (
                      IoTData.eeprom.temperature_coefficient
                    )}
                  </Descriptions.Item>
                </Descriptions>
              </Form>
            </TabPane>
            <TabPane tab="system" key="6" className={styles.tabpane}>
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
      ) : !haveContent && uploading ? (
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
      ) : (
        <Empty description={<span>No Data</span>} />
      )}
    </Modal>
  );
};

export const TopoIoTMC = React.memo(TopoIoTC);
