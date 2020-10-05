import React, { useState, useEffect } from "react";
import { Tabs, Select, Descriptions, Form, Input, InputNumber, Button } from "antd";
import styles from "../topology.module.scss";

const { TabPane } = Tabs;
const { Option } = Select;
const layout = {
  labelCol: { span: 10 },
  wrapperCol: { span: 16 },
};
const validateMessages = {
  required: '${label} is required!',
  types: {
    email: '${label} is not validate email!',
    number: '${label} is not a validate number!',
  },
  number: {
    range: '${label} must be between ${min} and ${max}',
  },
};

const TopoIoT = (props) => {
  const { dataSource, form, deviceindex } = props;
  // const [deviceindex, setDeviceindex] = useState(0);

  const onFinish = values => {
    console.log(values);
  };

  // function handleChange(value) {
  //   console.log(`selected ${value}`);
  //   setDeviceindex(value);
  // }

  return (
      <Tabs defaultActiveKey="1">
        <TabPane tab="Today" key="1" className={styles.tabpane}>
          <Descriptions
            // title="Responsive Descriptions"
            bordered
            column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            className={styles.desc}
          >
            <Descriptions.Item label="Battery" className={styles.descItem}>
              Voltage_max:{" "}
              {dataSource[deviceindex].controller.today.battery.min_voltage_v}{" "}
              (V)
              <br />
              Voltage_max:{" "}
              {dataSource[deviceindex].controller.today.battery.max_voltage_v}
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
              Current_max:{" "}
              {dataSource[deviceindex].controller.today.charge.max_current_a}{" "}
              (A)
              <br />
              Ampere_Hour:{" "}
              {dataSource[deviceindex].controller.today.charge.ampere_hour_ah}
              (A/H)
              <br />
              Watt: {dataSource[deviceindex].controller.today.charge.watt_w}(W)
              <br />
              Watt_max:{" "}
              {dataSource[deviceindex].controller.today.charge.max_watt_w}(W)
              <br />
              Watt_total:{" "}
              {dataSource[deviceindex].controller.today.charge.total_watt_w}(W)
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
              {dataSource[deviceindex].controller.today.discharge.max_current_a}{" "}
              (A)
              <br />
              Ampere_Hour:{" "}
              {
                dataSource[deviceindex].controller.today.discharge
                  .ampere_hour_ah
              }
              (A/H)
              <br />
              Watt: {dataSource[deviceindex].controller.today.discharge.watt_w}
              (W)
              <br />
              Watt_max:{" "}
              {dataSource[deviceindex].controller.today.discharge.max_watt_w}(W)
              <br />
              Watt_total:{" "}
              {dataSource[deviceindex].controller.today.discharge.total_watt_w}
              (W)
              <br />
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Pannel" key="2" className={styles.tabpane}>
          <Descriptions
            bordered
            className={styles.desc}
            // column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
          >
            <Descriptions.Item label="Current">
              {dataSource[deviceindex].controller.solar_pannel.current_a} (A)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Voltage">
              {dataSource[deviceindex].controller.solar_pannel.voltage_v} (V)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Watt">
              {dataSource[deviceindex].controller.solar_pannel.watt_w} (W)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Temperature">
              {dataSource[deviceindex].controller.solar_pannel.temperature_c}{" "}
              (C)
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Battery" key="3" className={styles.tabpane}>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Charge Current">
              {dataSource[deviceindex].controller.battery.charge_current_a} (A)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="FullCharge Time">
              {dataSource[deviceindex].controller.battery.full_charged_time} 
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="OverDischarge Time">
              {dataSource[deviceindex].controller.battery.over_discharged_time}
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="SOC">
              {dataSource[deviceindex].controller.battery.soc_percentage} (%)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Temperature">
              {dataSource[deviceindex].controller.battery.temperature_c} (C)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Total Charge">
              {dataSource[deviceindex].controller.battery.total_charge_ah} (A/H)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Total DisCharge">
              {dataSource[deviceindex].controller.battery.total_discharge_ah} (A/H)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Voltage">
              {dataSource[deviceindex].controller.battery.voltage_v} (V)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Charge State">
              {dataSource[deviceindex].controller.battery.charge_state} (W)
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Load" key="4" className={styles.tabpane}>
        <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Current">
              {dataSource[deviceindex].controller.load.current_a} (A)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Voltage">
              {dataSource[deviceindex].controller.load.voltage_v} (V)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Watt">
              {dataSource[deviceindex].controller.load.watt_w} (W)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Load Light">
              {dataSource[deviceindex].controller.load.load_light_percentage} (%)
            </Descriptions.Item>
          </Descriptions>
          <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Load On_Off">
              {dataSource[deviceindex].controller.load.load_on_off} 
            </Descriptions.Item>
          </Descriptions>
          </TabPane>
          <TabPane tab="eeprom" key="5" className={styles.tabpane}>
                  <Form {...layout} name="nest-messages" onFinish={onFinish} validateMessages={validateMessages} form={form}>
                    <Form.Item name='battery_capacity_ah' label="battery_capacity_ah">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='battery_type' label="battery_type">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='charge_limit_voltage_v' label="Charge limit(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='discharge_limit_voltage_v' label="DisCharge limit(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='equalizing_charge_interval_day' label="Equalizing Charge Interval(day)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='equalizing_charge_time_min' label="Equalizing Charge time(min)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='equalizing_charge_voltage_v' label="Equalizing Charge(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='folating_charge_voltage_v' label="Folating Charge(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='low_voltage_warning_voltage_v' label="Low Voltage warning(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='over_discharge_delay_s' label="Over DisCharge delay(s)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='over_discharge_reverse_voltage_v' label="Over DisCharge reverse(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='over_discharge_voltage_v' label="Over DisCharge(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='overvoltage_voltage_v' label="Overvoltage(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='rasing_charge_reverse_voltage_v' label="Rasing charge reverse(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='rasing_charge_time_min' label="Rasing charge time min">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='rasing_charge_voltage_v' label="Rasing charge(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='recognized_voltage_v' label="Recognized Voltage(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='system_voltage_v' label="System Voltage(V)">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                    <Form.Item name='temperature_coefficient' label="Temp Coefficient">
                      <Input  className={styles.IoTinput}/>
                    </Form.Item>
                  </Form>
          </TabPane>         
           <TabPane tab="system" key="6" className={styles.tabpane}>
           <Descriptions bordered className={styles.desc}>
           <Descriptions.Item label="Charge Current">
              {dataSource[deviceindex].system.charge_current_a} (A)
            </Descriptions.Item>
            </Descriptions>
            <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="DisCharge Current">
              {dataSource[deviceindex].system.discharge_current_a} (A)
            </Descriptions.Item>
            </Descriptions>
            <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Voltage_max">
              {dataSource[deviceindex].system.max_voltage_v} (V)
            </Descriptions.Item>
            </Descriptions>
            <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Hardware Version">
              {dataSource[deviceindex].system.hardware_version} 
            </Descriptions.Item>
            </Descriptions>
            <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Serial Number">
              {dataSource[deviceindex].system.serial_number} 
            </Descriptions.Item>
            </Descriptions>
            <Descriptions bordered className={styles.desc}>
            <Descriptions.Item label="Software Version">
              {dataSource[deviceindex].system.software_version} 
            </Descriptions.Item>
            </Descriptions>
        </TabPane>
        
      </Tabs>

  );
};
export default TopoIoT;
