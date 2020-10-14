import React, { useEffect } from "react";
import { Tabs, Select, Descriptions, Form, Input, Modal } from "antd";
import styles from "../topology.module.scss";

const { TabPane } = Tabs;
const { Option } = Select;

const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 16 },
};


const TopoIoTC = ({ IoTvisible, setIoTvisible, IoTresponse, deviceindex, handleDeviceChange }) => {
  console.log(IoTresponse)
  const [form] = Form.useForm();
  const onFinish = (values) => {
    console.log(values);
  };

  useEffect(() => {
    if(IoTresponse){
      form.setFieldsValue({
        battery_capacity_ah: IoTresponse[0].eeprom.battery_capacity_ah,
        battery_type: IoTresponse[0].eeprom.battery_type,
        charge_limit_voltage_v: IoTresponse[0].eeprom.charge_limit_voltage_v,
        discharge_limit_voltage_v:
          IoTresponse[0].eeprom.discharge_limit_voltage_v,
        equalizing_charge_interval_day:
          IoTresponse[0].eeprom.equalizing_charge_interval_day,
        equalizing_charge_time_min:
          IoTresponse[0].eeprom.equalizing_charge_time_min,
        equalizing_charge_voltage_v:
          IoTresponse[0].eeprom.equalizing_charge_voltage_v,
        folating_charge_voltage_v:
          IoTresponse[0].eeprom.folating_charge_voltage_v,
        low_voltage_warning_voltage_v:
          IoTresponse[0].eeprom.low_voltage_warning_voltage_v,
        over_discharge_delay_s: IoTresponse[0].eeprom.over_discharge_delay_s,
        over_discharge_reverse_voltage_v:
          IoTresponse[0].eeprom.over_discharge_reverse_voltage_v,
        over_discharge_voltage_v: IoTresponse[0].eeprom.over_discharge_voltage_v,
        overvoltage_voltage_v: IoTresponse[0].eeprom.overvoltage_voltage_v,
        rasing_charge_reverse_voltage_v:
          IoTresponse[0].eeprom.rasing_charge_reverse_voltage_v,
        rasing_charge_time_min: IoTresponse[0].eeprom.rasing_charge_time_min,
        rasing_charge_voltage_v: IoTresponse[0].eeprom.rasing_charge_voltage_v,
        recognized_voltage_v: IoTresponse[0].eeprom.recognized_voltage_v,
        system_voltage_v: IoTresponse[0].eeprom.system_voltage_v,
        temperature_coefficient: IoTresponse[0].eeprom.temperature_coefficient,
      });
    }

  }, [IoTresponse]);

  const callback = (key) => {
    console.log(key);
  };

  return (
    <Modal
      visible={IoTvisible}
      onOk={() => setIoTvisible(false)}
      onCancel={() => setIoTvisible(false)}
      okText="confirm"
      cancelText="cancel"
      centered={true}
      width={"50%"}
      destroyOnClose={true}
    >
      <Select
        defaultValue="485_0"
        style={{ width: 120 }}
        onChange={handleDeviceChange}
      >
        {IoTresponse &&
          IoTresponse.map((_, index) => {
            return <Option key={index} value={index}>{`485_${index}`}</Option>;
          })}
      </Select>
      <Tabs defaultActiveKey="Today" onChange={callback}>
        <TabPane tab="Today" key="Today" className={styles.tabpane}>
          <Descriptions
            // title="Responsive Descriptions"
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            className={styles.desc}
          >
            <Descriptions.Item label="Battery" className={styles.descItem}>
              Voltage_max:
              {IoTresponse[deviceindex].controller.today.battery.min_voltage_v}
              (V)
              <br />
              Voltage_max:
              {IoTresponse[deviceindex].controller.today.battery.max_voltage_v}
              (V)
              <br />
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            // title="Responsive Descriptions"
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            className={styles.desc}
          >
            <Descriptions.Item label="Charge" className={styles.descItem}>
              Current_max:
              {IoTresponse[deviceindex].controller.today.charge.max_current_a}
              (A)
              <br />
              Ampere_Hour:{" "}
              {IoTresponse[deviceindex].controller.today.charge.ampere_hour_ah}
              (A/H)
              <br />
              Watt: {IoTresponse[deviceindex].controller.today.charge.watt_w}(W)
              <br />
              Watt_max:{" "}
              {IoTresponse[deviceindex].controller.today.charge.max_watt_w}(W)
              <br />
              Watt_total:{" "}
              {IoTresponse[deviceindex].controller.today.charge.total_watt_w}(W)
              <br />
            </Descriptions.Item>
          </Descriptions>
          <Descriptions
            // title="Responsive Descriptions"
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            className={styles.desc}
          >
            <Descriptions.Item label="Discharge" className={styles.descItem}>
              Current_max:{" "}
              {
                IoTresponse[deviceindex].controller.today.discharge
                  .max_current_a
              }{" "}
              (A)
              <br />
              Ampere_Hour:{" "}
              {
                IoTresponse[deviceindex].controller.today.discharge
                  .ampere_hour_ah
              }
              (A/H)
              <br />
              Watt: {IoTresponse[deviceindex].controller.today.discharge.watt_w}
              (W)
              <br />
              Watt_max:{" "}
              {IoTresponse[deviceindex].controller.today.discharge.max_watt_w}
              (W)
              <br />
              Watt_total:{" "}
              {IoTresponse[deviceindex].controller.today.discharge.total_watt_w}
              (W)
              <br />
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Pannel" key="Pannel" className={styles.tabpane}>
          <Descriptions
            bordered
            className={styles.desc}
            // column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="Current">
              {IoTresponse[deviceindex].controller.solar_pannel.current_a} (A)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Voltage">
              {IoTresponse[deviceindex].controller.solar_pannel.voltage_v} (V)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Watt">
              {IoTresponse[deviceindex].controller.solar_pannel.watt_w} (W)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Temperature">
              {IoTresponse[deviceindex].controller.solar_pannel.temperature_c}{" "}
              (C)
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Battery" key="Battery" className={styles.tabpane}>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Charge Current">
              {IoTresponse[deviceindex].controller.battery.charge_current_a} (A)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="FullCharge Time">
              {IoTresponse[deviceindex].controller.battery.full_charged_time}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="OverDischarge Time">
              {IoTresponse[deviceindex].controller.battery.over_discharged_time}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="SOC">
              {IoTresponse[deviceindex].controller.battery.soc_percentage} (%)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Temperature">
              {IoTresponse[deviceindex].controller.battery.temperature_c} (C)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Total Charge">
              {IoTresponse[deviceindex].controller.battery.total_charge_ah}{" "}
              (A/H)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Total DisCharge">
              {IoTresponse[deviceindex].controller.battery.total_discharge_ah}{" "}
              (A/H)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Voltage">
              {IoTresponse[deviceindex].controller.battery.voltage_v} (V)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Charge State">
              {IoTresponse[deviceindex].controller.battery.charge_state} (W)
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Load" key="Load" className={styles.tabpane}>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Current">
              {IoTresponse[deviceindex].controller.load.current_a} (A)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Voltage">
              {IoTresponse[deviceindex].controller.load.voltage_v} (V)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Watt">
              {IoTresponse[deviceindex].controller.load.watt_w} (W)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Load Light">
              {IoTresponse[deviceindex].controller.load.load_light_percentage}{" "}
              (%)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Load On_Off">
              {IoTresponse[deviceindex].controller.load.load_on_off}
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
            <Form.Item name="battery_capacity_ah" label="battery_capacity_ah">
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item name="battery_type" label="battery_type">
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item name="charge_limit_voltage_v" label="Charge limit(V)">
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="discharge_limit_voltage_v"
              label="DisCharge limit(V)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="equalizing_charge_interval_day"
              label="Equalizing Charge Interval(day)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="equalizing_charge_time_min"
              label="Equalizing Charge time(min)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="equalizing_charge_voltage_v"
              label="Equalizing Charge(V)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="folating_charge_voltage_v"
              label="Folating Charge(V)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="low_voltage_warning_voltage_v"
              label="Low Voltage warning(V)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="over_discharge_delay_s"
              label="Over DisCharge delay(s)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="over_discharge_reverse_voltage_v"
              label="Over DisCharge reverse(V)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="over_discharge_voltage_v"
              label="Over DisCharge(V)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item name="overvoltage_voltage_v" label="Overvoltage(V)">
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="rasing_charge_reverse_voltage_v"
              label="Rasing charge reverse(V)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="rasing_charge_time_min"
              label="Rasing charge time min"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item name="rasing_charge_voltage_v" label="Rasing charge(V)">
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item
              name="recognized_voltage_v"
              label="Recognized Voltage(V)"
            >
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item name="system_voltage_v" label="System Voltage(V)">
              <Input className={styles.IoTinput} />
            </Form.Item>
            <Form.Item name="temperature_coefficient" label="Temp Coefficient">
              <Input className={styles.IoTinput} />
            </Form.Item>
          </Form>
        </TabPane>
        <TabPane tab="system" key="system" className={styles.tabpane}>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Charge Current">
              {IoTresponse[deviceindex].system.charge_current_a} (A)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="DisCharge Current">
              {IoTresponse[deviceindex].system.discharge_current_a} (A)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Voltage_max">
              {IoTresponse[deviceindex].system.max_voltage_v} (V)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Hardware Version">
              {IoTresponse[deviceindex].system.hardware_version}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Serial Number">
              {IoTresponse[deviceindex].system.serial_number}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Software Version">
              {IoTresponse[deviceindex].system.software_version}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>
    </Modal>
  );
};
export default TopoIoTC;
