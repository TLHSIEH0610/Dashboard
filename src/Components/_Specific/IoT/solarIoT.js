import React, { useEffect, useState } from "react";
import { Card, Table } from "antd";
import useURLloader from "../../../hook/useURLloader";


const SolarIoTC = () => {
  const SolarUrl = "/api/IoT_solar2.json";
  const [loading, response] = useURLloader(SolarUrl);
  const [IoTData, setIoTData] = useState([])

  useEffect(() => {
    // console.log(response);
    if (response) {
      let IoTData = [];
      console.log(response);
      response.forEach((item, index) => {
        IoTData.push({
          key: index,
          id: item.id,
          node: item.node,
          time: item.Time,
          battery_charge_current_a: item.controller.battery.charge_current_a,
          battery_full_charged_time: item.controller.battery.full_charged_time,
          battery_over_discharged_time: item.controller.battery.over_discharged_time,
          battery_soc_percentage: item.controller.battery.soc_percentage,
          battery_temperature_c: item.controller.battery.temperature_c,
          battery_total_charge_ah: item.controller.battery.total_charge_ah,
          battery_total_discharge_ah: item.controller.battery.total_discharge_ah,
          battery_voltage_v: item.controller.battery.voltage_v,
          charge_state: item.controller.charge_state,
          load_current_a: item.controller.load.current_a,
          load_voltage_v: item.controller.load.voltage_v,
          load_watt_w: item.controller.load.watt_w,
          load_light_percentage: item.controller.load_light_percentage,
          load_on_off: item.controller.load_on_off,
          solar_pannel_current_a: item.controller.solar_pannel.current_a,
          solar_pannel_voltage_v: item.controller.solar_pannel.voltage_v,
          solar_pannel_watt_w: item.controller.solar_pannel.watt_w,
          solar_pannel_temperature_c: item.controller.temperature_c,
          today_battery_max_voltage_v: item.controller.today.battery.max_voltage_v,
          today_battery_min_voltage_v: item.controller.today.battery.min_voltage_v,
          today_charge_ampere_hour_ah: item.controller.today.charge.ampere_hour_ah,
          today_charge_max_current_a: item.controller.today.charge.max_current_a,
          today_charge_max_watt_w: item.controller.today.charge.max_watt_w,
          today_charge_total_watt_w: item.controller.today.charge.total_watt_w,
          today_charge_watt_w: item.controller.today.charge.watt_w,
          today_discharge_ampere_hour_ah: item.controller.today.discharge.ampere_hour_ah,
          today_discharge_max_current_a: item.controller.today.discharge.max_current_a,
          today_discharge_max_watt_w: item.controller.today.discharge.max_watt_w,
          today_discharge_total_watt_w: item.controller.today.discharge.total_watt_w,
          today_discharge_watt_w: item.controller.today.discharge.watt_w,
          uptime_day:item.controller.uptime_day
        });
      });
      console.log(IoTData)
      setIoTData(IoTData)
    }
  }, [response]);

  const columns = [
    {
      title: "Device",
      dataIndex: "id",
      key: "id",
      width: 200,
    },
    {
      title: "node",
      dataIndex: "node",
      key: "id",
      width: 100,
    },
    {
      title: "Time",
      dataIndex: "time",
      key: "Time",
      width: 150,
    },
    // {
    //   title: "Controller",
    //   children: [
        {
          title: "Battery",
          children: [
            {
              title: "SOC(%)",
              dataIndex: "battery_soc_percentage",
              key: "Time",
              width: 100,
            },
            {
              title: "Voltage",
              dataIndex: "battery_voltage_v",
              key: "Time",
              width: 100,
            },
            {
              title: "Charge Current(A)",
              dataIndex: "battery_charge_current_a",
              key: "Time",
              width: 100,
            },
            {
              title: "Temperature(C)",
              dataIndex: "battery_temperature_c",
              key: "Time",
              width: 100,
            },
            {
              title: "Over DisCharge Time",
              dataIndex: "battery_over_discharged_time",
              key: "Time",
              width: 100,
            },
            {
              title: "Full Charge Time",
              dataIndex: "battery_full_charged_time",
              key: "Time",
              width: 100,
            },
            {
              title: "Total Charge(A/H)",
              dataIndex: "battery_total_charge_ah",
              key: "Time",
              width: 100,
            },
            {
              title: "Total DisCharge(A/H)",
              dataIndex: "total_discharge_ah",
              key: "Time",
              width: 100,
            },
            {
              title: "Charge State",
              dataIndex: "charge_state",
              key: "Time",
              width: 100,
            },
          ],
        },
        {
          title: "Load",
          children: [
            {
              title: "SOC(%)",
              dataIndex: "load_current_a",
              key: "Time",
              width: 100,
            },
            {
              title: "Voltage",
              dataIndex: "load_voltage_v",
              key: "Time",
              width: 100,
            },
            {
              title: "Charge Current(A)",
              dataIndex: "load_watt_w",
              key: "Time",
              width: 100,
            },
            {
              title: "Temperature(C)",
              dataIndex: "load_light_percentage",
              key: "Time",
              width: 100,
            },
            {
              title: "Over DisCharge Time",
              dataIndex: "load_on_off",
              key: "Time",
              width: 100,
            },
          ],
        },
        {
          title: "Solar Pannel",
          children: [
            {
              title: "SOC(%)",
              dataIndex: "solar_pannel_current_a",
              key: "Time",
              width: 100,
            },
            {
              title: "Voltage",
              dataIndex: "solar_pannel_voltage_v",
              key: "Time",
              width: 100,
            },
            {
              title: "Charge Current(A)",
              dataIndex: "solar_pannel_watt_w",
              key: "Time",
              width: 100,
            },
            {
              title: "Temperature(C)",
              dataIndex: "solar_pannel_temperature_c",
              key: "Time",
              width: 100,
            },
          ],
        },
        {
          title: "Today",
          children: [
            {
              title: "Battery",
              children: [
                {
                  title: "Max Voltage(V)",
                  dataIndex: "today_battery_max_voltage_v",
                  key: "max_voltage_v",
                  width: 100,
                },
                {
                  title: "Min Voltage(V)",
                  dataIndex: "today_battery_min_voltage_v",
                  key: "min_voltage_v",
                  width: 100,
                },
              ],
            },
            {
              title: "Charge",
              children: [
                {
                  title: "ampere_hour_ah",
                  dataIndex: "today_charge_ampere_hour_ah",
                  key: "ampere_hour_ah",
                  width: 100,
                },
                {
                  title: "Max Current(A)",
                  dataIndex: "today_charge_max_current_a",
                  key: "max_current_a",
                  width: 100,
                },
                {
                  title: "Max_Watt(W)",
                  dataIndex: "today_charge_max_watt_w",
                  key: "max_watt_w",
                  width: 100,
                },
                {
                  title: "Total_Watt(W)",
                  dataIndex: "today_charge_total_watt_w",
                  key: "total_watt_w",
                  width: 100,
                },
                {
                  title: "watt(W)",
                  dataIndex: "today_charge_watt_w",
                  key: "today_charge_watt_w",
                  width: 100,
                },
              ],
            },
            {
              title: "DisCharge",
              children: [
                {
                  title: "ampere_hour_ah",
                  dataIndex: "today_discharge_ampere_hour_ah",
                  key: "today_discharge_ampere_hour_ah",
                  width: 100,
                },
                {
                  title: "max_current_a",
                  dataIndex: "today_discharge_max_current_a",
                  key: "today_discharge_max_current_a",
                  width: 100,
                },
                {
                  title: "Max Watt(W)",
                  dataIndex: "today_discharge_max_watt_w",
                  key: "today_discharge_max_watt_w",
                  width: 100,
                },
                {
                  title: "Total Watt(W)",
                  dataIndex: "today_discharge_watt_w",
                  key: "today_discharge_watt_w",
                  width: 100,
                },
                {
                  title: "Watt(W)",
                  dataIndex: "today_discharge_watt_w",
                  key: "today_discharge_watt_w",
                  width: 100,
                },
                {
                  title: "uptime_day",
                  dataIndex: "uptime_day",
                  key: "uptime_day",
                  width: 100,
                },
              ],
            },
          ],
        },
    //   ],
    // },
  ];

  return (
    <Card>
      <Table
      loading={loading}
        columns={columns}
        dataSource={IoTData}
        bordered
        pagination={false}
        size="middle"
        scroll={{ x: "calc(700px + 50%)", y: 350 }}
      />
    </Card>
  );
};

export default SolarIoTC;
