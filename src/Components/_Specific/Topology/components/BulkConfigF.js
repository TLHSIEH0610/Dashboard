import React, { useState, useContext, Fragment, useEffect } from "react";
import styles from "../topology.module.scss";
import {
  Form,
  Button,
  Row,
  Col,
  Input,
  message,
  Card,
  Divider,
  Modal,
} from "antd";
import Context from "../../../../Utility/Reduxx";
import { ImCross } from "react-icons/im";
import { FcPlus } from "react-icons/fc";
import axios from "axios";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router";
import BulkConfigFLan, { LanJSON } from "./BulkConfigF_Lan";
import BulkConfigFWan, { WanJSON } from "./BulkConfigF_Wan";
import BulkConfigFLte, { LteJSON } from "./BulkConfigF_Lte";
import BulkConfigFPeriod, { PeriodJSON } from "./BulkConfigF_Period";
import BulkConfigFAlarm, { AlarmJSON } from "./BulkConfigF_Alarm";
import BulkConfigFilter from "./BulkConfigF_Filter";
import BulkConfigFWifi, { WifiJSON } from './BulkConfigF_Wifi'
import { useTranslation } from "react-i18next";

const BulkConfigF = ({
  models,
  FileRepository,
  Nodeloading,
  Fileloading,
  groups,
  cities,
  dataSource,
  record,
  setRecord,
  setIsUpdate,
  IsUpdate,
}) => {
  const [form] = Form.useForm();
  const { state, dispatch } = useContext(Context);
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [Rebootvisible, setRebootvisible] = useState(false);
  const [Savevisible, setSavevisible] = useState(false);
  const level = localStorage.getItem("authUser.level");
  const cid = localStorage.getItem("authUser.cid");
  const [resultList, setResultList] = useState({
    failureDevices: [],
    rebootDevices: [],
  });
  const [filterData, setFilterData] = useState({
    models: "",
    groups: [],
    cities: [],
  });
  const [ImportFrom, setImportFrom] = useState("");
  const [showLan, setShowLan] = useState(false);
  const [showWan, setShowWan] = useState(false);
  const [showLte, setShowLte] = useState(false);
  const [showAlarm, setShowAlarm] = useState(false);
  const [showPeriod, setShowPeriod] = useState(false);
  const [showWifi, setShowWifi]  = useState(false);
  const [NodeList, setNodeList] = useState([]);
  const [LANIPV6Static, setLANIPV6Static] = useState("");
  // const [LanStatisticIPEnable, setLanStatisticIPEnable] = useState("");
  const [WanPriority, setWanPriority] = useState("");
  const [WanEthernetType, setWanEthernetType] = useState("");
  const [WanDHCPServer1, setWanDHCPServer1] = useState("");
  const [WanDHCPServer2, setWanDHCPServer2] = useState("");
  const [WanDHCPServer3, setWanDHCPServer3] = useState("");
  // const [PriorityOrderOptions, setPriorityOrderOptions] = useState({
  //   "lte": false,
  //   "eth": false,
  //   "wifi-2.4G": false,
  // });
  const [LTE1PinEnable, setLTE1PinEnable] = useState("");
  const [LTE2PinEnable, setLTE2PinEnable] = useState("");
  const [LTERecoverAPN1, setLTERecoverAPN1] = useState("");
  const [LTE1DataLimitEnable, setLTE1DataLimitEnable] = useState("");
  const [LTE2DataLimitEnable, setLTE2DataLimitEnable] = useState("");
  const [AlarmEnable, setAlarmEnable] = useState("");
  const [AlarmType, setAlarmType] = useState([]);
  const [GPSReference, setGPSReference] = useState("");
  const [DeviceNum, setDeviceNum] = useState([]);
  const [showDualSim, setShowDualSim] = useState(true)
  const [SelectedSIM, setSelectedSIM] = useState("SIM1");
  const [SelectedModel, setSelectedModel] = useState('')
  const [SelectedWPS, setSelectedWPS] = useState('SSID-1')
  const M300model = ['M300-G/M301-G','M301-GW','M301-G','M301','M300-G']
  const { t } = useTranslation();

  useEffect(() => {
    if (record?.id) {
      handleDeviceChange(record.id);
    }
        // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record, IsUpdate]);

  // console.log(form.isFieldTouched('LTE1_puk'))

  function setFields(data, nodeInf) {
    console.log(data, nodeInf, record);
    setDeviceNum([1])
    //jusge if dual sim
    setSelectedSIM("SIM1")
    if(data.lte?.sim?.length===1){
      setShowDualSim(false)
    }else{
      setShowDualSim(true)
    }
    //judge data appearance
    // if(!data.lan){
      setShowLan(false);
    // }else{
    //   setShowLan(true);
    // }
    // if(!data.wan){
      setShowWan(false);
    // }else{
    //   setShowWan(true);
    // }
    // if(!data.lte){
      setShowLte(false);
    // }else{
    //   setShowLte(true);
    // }
    // if(!data.system){
      setShowAlarm(false);
    // }else{
    //   setShowAlarm(true);
    // }
    // if(!data.wifi){
      setShowWifi(false);
    // }else{
    //   setShowWifi(true);
    // }
    // if(!data.report_period){
      setShowPeriod(false);
    // }else{
    //   setShowPeriod(true);
    // }

    //import Wan priority  
    if (data?.wan?.priority?.order?.length === 3 ) {
      setWanPriority("Auto");
      form.setFieldsValue({ Priority: "Auto" });
    }else if(data?.wan?.priority?.order?.length === 2 && M300model.includes(nodeInf.model)){
      setWanPriority("Auto");
      form.setFieldsValue({ Priority: "Auto" });
    }
    else if (data?.wan?.priority?.order?.length) {
      setWanPriority(data?.wan?.priority?.order?.[0]);
      form.setFieldsValue({ Priority: data?.wan?.priority?.order?.[0] });
    }
    //import devices'
    let Device_ID;
    if (record?.id) {
      Device_ID = [record.id];
    } else if (ImportFrom === "Device") {
      Device_ID = [nodeInf.id];
    } else {
      Device_ID = nodeInf.id;
    }
    setLANIPV6Static(data.lan?.ipv6?.type);
    // setLanStatisticIPEnable(
    //   data.lan?.ipv4?.dhcp?.pool?.[0]?.fixed_ip?.[0]?.enabled
    // );
    setWanEthernetType(data.wan?.ethernet?.type);
    setWanDHCPServer1(data.wan?.ethernet?.dhcp?.dns?.ipv4?.[0].type);
    setWanDHCPServer2(data.wan?.ethernet?.dhcp?.dns?.ipv4?.[1].type);
    setWanDHCPServer3(data.wan?.ethernet?.dhcp?.dns?.ipv4?.[2].type);
    setAlarmEnable(data.system?.alarm?.mode || false);
    setGPSReference(data.system?.alarm?.geofence?.auto_detect);
    setAlarmType(data.system?.alarm?.inputs);
    setLTE1PinEnable(data.lte?.sim?.[0]?.pin_enabled || false);
    setLTE2PinEnable(data.lte?.sim?.[1]?.pin_enabled || false);
    setLTERecoverAPN1(data.lte?.policy.recovery?.recover_apn?.enabled);
    setLTE1DataLimitEnable(data.lte?.limit?.[0]?.enabled);
    setLTE2DataLimitEnable(data.lte?.limit?.[1]?.enabled || false);

    let NewfilterData = filterData;
    NewfilterData.models = nodeInf.model;
    setSelectedModel(nodeInf.model)
    setFilterData(NewfilterData);
    OnChangeFilter();

    form.setFieldsValue({
      Device_ID: Device_ID,
      models: nodeInf.model,
      LAN_ipv4_address: data?.lan?.ipv4?.address,
      StaticIP: data?.lan?.ipv4?.dhcp?.pool?.[0]?.fixed_ip,
      LAN_ipv4_netmask: data?.lan?.ipv4?.netmask,
      LAN_ipv4_dhcpmode: data?.lan?.ipv4?.dhcp?.mode,
      LAN_ipv4_dhcp_start: data?.lan?.ipv4?.dhcp?.pool[0].start,
      LAN_ipv4_dhcp_end: data?.lan?.ipv4?.dhcp?.pool[0].end,
      LAN_ipv6_type: data?.lan?.ipv6?.type,
      LAN_ipv6_adress: data?.lan?.ipv6?.static?.address,
      LAN_ipv6_assignment: data?.lan?.ipv6?.dhcp?.assigment,
      WAN_ipv4_type_1: data?.wan?.ethernet?.dhcp?.dns.ipv4[0].type,
      WAN_ipv4_address_1: data?.wan?.ethernet?.dhcp?.dns.ipv4[0].address,
      WAN_ipv4_type_2: data?.wan?.ethernet?.dhcp?.dns.ipv4[1].type,
      WAN_ipv4_address_2: data?.wan?.ethernet?.dhcp?.dns.ipv4[1].address,
      WAN_ipv4_type_3: data?.wan?.ethernet?.dhcp?.dns.ipv4[2].type,
      WAN_ipv4_address_3: data?.wan?.ethernet?.dhcp?.dns.ipv4[2].address,
      WAN_username: data?.wan?.ethernet?.pppoe?.username,
      // WAN_password: data?.wan?.ethernet?.pppoe.password,
      WAN_service_name: data?.wan?.ethernet?.pppoe?.service_name,
      WAN_priority_1: data?.wan?.priority?.order[0],
      WAN_priority_2: data?.wan?.priority?.order[1],
      WAN_priority_3: data?.wan?.priority?.order[2],
      WAN_lte_mode: data?.wan?.priority?.lte?.mode,
      WAN_ethernet_type: data?.wan?.ethernet?.type,
      WAN_static_ipv4_address: data?.wan?.ethernet?.static?.ipv4?.address,
      WAN_static_ipv4_dns_address1:
        data?.wan?.ethernet?.static?.ipv4?.dns?.[0]?.address,
      WAN_static_ipv4_dns_address2:
        data?.wan?.ethernet?.static?.ipv4?.dns?.[1]?.address,
      WAN_static_ipv4_dns_address3:
        data?.wan?.ethernet?.static?.ipv4?.dns?.[2]?.address,
      WAN_static_gateway: data?.wan?.ethernet?.static?.ipv4?.gateway,
      WAN_static_netmask: data?.wan?.ethernet?.static?.ipv4?.netmask,
      LTE_mode: data?.lte?.config?.mode,
      LTE_mtu: data?.lte?.config?.mtu,
      LTE1_pin_enabled: data?.lte?.sim?.[0]?.pin_enabled || false,
      LTE1_apn: data?.lte?.sim?.[0]?.apn?.[0]?.apn,
      LTE1_ipv6_enabled: data?.lte?.sim?.[0]?.apn?.[0]?.ipv6_enabled,
      LTE1_auth: data?.lte?.sim?.[0]?.apn?.[0]?.auth?.type,
      LTE1_username: data?.lte?.sim?.[0]?.apn?.[0]?.auth?.username,

      //auth只有一組
      // LTE1_apn2: data?.lte?.sim?.[0]?.apn?.[1]?.apn,
      // LTE1_ipv6_enabled2: data?.lte?.sim?.[0]?.apn?.[1]?.ipv6_enabled,
      // LTE1_auth2: data?.lte?.sim?.[0]?.apn?.[1]?.auth?.type,
      // LTE1_username2: data?.lte?.sim?.[0]?.apn?.[1]?.auth?.username,

      LTE2_pin_enabled: data?.lte?.sim?.[1]?.pin_enabled || false,
      LTE2_apn: data?.lte?.sim?.[1]?.apn?.[0]?.apn,
      LTE2_ipv6_enabled: data?.lte?.sim?.[0]?.apn?.[0]?.ipv6_enabled,
      LTE2_auth: data?.lte?.sim?.[1]?.apn?.[0]?.auth?.type,
      LTE2_username: data?.lte?.sim?.[1]?.apn?.[0]?.auth?.username,

      //auth只有一組
      // LTE2_apn2: data?.lte?.sim?.[1]?.apn?.[1]?.apn,
      // LTE2_ipv6_enabled2: data?.lte?.sim?.[1]?.apn?.[1]?.ipv6_enabled,
      // LTE2_auth2: data?.lte?.sim?.[1]?.apn?.[1]?.auth?.type,
      // LTE2_username2: data?.lte?.sim?.[1]?.apn?.[1]?.auth?.username,

      LTE1_limit_mbyte: data?.lte?.limit?.[0]?.limit_mbyte,
      LTE1_limit_enabled: data?.lte?.limit?.[0]?.enabled || false,
      LTE1_reset_day: data?.lte?.limit?.[0]?.reset?.day,
      LTE1_reset_hour: data?.lte?.limit?.[0]?.reset?.hour,
      LTE1_reset_minute: data?.lte?.limit?.[0]?.reset?.minute,
      LTE1_reset_second: data?.lte?.limit?.[0]?.reset?.second,
      LTE2_limit_mbyte: data?.lte?.limit?.[1]?.limit_mbyte,
      LTE2_limit_enabled: data?.lte?.limit?.[1]?.enabled || false,
      LTE2_reset_day: data?.lte?.limit?.[1]?.reset?.day,
      LTE2_reset_hour: data?.lte?.limit?.[1]?.reset?.hour,
      LTE2_reset_minute: data?.lte?.limit?.[1]?.reset?.minute,
      LTE2_reset_second: data?.lte?.limit?.[1]?.reset?.second,
      LTE_roaming: data?.lte?.policy?.roaming || false,
      LTE_recovery_down_time: data?.lte?.policy?.recovery?.down_times,
      LTE_recovery_apn_enabled:
        data?.lte?.policy?.recovery?.recover_apn.enabled,
      LTE_recovery_apn_action: data?.lte?.policy?.recovery?.recover_apn.action,

      Wifi1_ap_enable: data?.wifi?.wifi_config?.ap_enable,
      Wifi1_txpower: data?.wifi?.wifi_config?.txpower,
      Wifi1_btw: data?.wifi?.wifi_config?.btw,
      Wifi1_CountryCode: data?.wifi?.wifi_config?.CountryCode,
      Wifi1_bt_lwps: data?.wifi?.wifi_config?.bt_lwps,
      Wifi1_enable: data?.wifi?.wifi_config?.port?.[0]?.basic?.enable,
      Wifi1_ssid: data?.wifi?.wifi_config?.port?.[0]?.basic?.ssid,
      Wifi1_hidden_ssid: data?.wifi?.wifi_config?.port?.[0]?.basic?.hidden_ssid,
      Wifi1_channel_id: data?.wifi?.wifi_config?.port?.[0]?.basic?.channel_id,
      Wifi1_ap_isolate: data?.wifi?.wifi_config?.port?.[0]?.basic?.ap_isolate,
      Wifi1_vlan: data?.wifi?.wifi_config?.port?.[0]?.basic?.vlan,
      Wifi1_auth: data?.wifi?.wifi_config?.port?.[0]?.security?.wpa?.auth,
      Wifi1_rekey: data?.wifi?.wifi_config?.port?.[0]?.security?.wpa?.rekey,
      Wifi1_passphrase: data?.wifi?.wifi_config?.port?.[0]?.security?.wpa?.passphrase,

      Wifi2_enable: data?.wifi?.wifi_config?.port?.[1]?.basic?.enable,
      Wifi2_ssid: data?.wifi?.wifi_config?.port?.[1]?.basic?.ssid,
      Wifi2_hidden_ssid: data?.wifi?.wifi_config?.port?.[1]?.basic?.hidden_ssid,
      Wifi2_channel_id: data?.wifi?.wifi_config?.port?.[1]?.basic?.channel_id,
      Wifi2_ap_isolate: data?.wifi?.wifi_config?.port?.[1]?.basic?.ap_isolate,
      Wifi2_vlan: data?.wifi?.wifi_config?.port?.[1]?.basic?.vlan,
      Wifi2_auth: data?.wifi?.wifi_config?.port?.[1]?.security?.wpa?.auth,
      Wifi2_rekey: data?.wifi?.wifi_config?.port?.[1]?.security?.wpa?.rekey,
      Wifi2_passphrase: data?.wifi?.wifi_config?.port?.[1]?.security?.wpa?.passphrase,

      alive: data?.report_period?.alive,
      gps: data?.report_period?.gps,
      iot: data?.report_period?.iot,
      status: data?.report_period?.status,
      timeout: data?.report_period?.timeout,
      alarm_enabled: data?.system?.alarm?.mode,
      alarm_input: data?.system?.alarm?.inputs,
      gps_reference: data?.system?.alarm?.geofence?.auto_detect,
      gps_radius: data?.system?.alarm?.geofence?.radius_m,
      gps_latitude: data?.system?.alarm?.geofence?.latitude,
      gps_longitude: data?.system?.alarm?.geofence?.longitude,
    });
    setRecord(undefined);
  }



  function handleDeviceChange(value) {
    setLoading(true);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"device_cfg":{"filter":{"id":"${value}"},"nodeInf":{},"obj":{"report_period":{},"lan":{},"wan":{},"lte":{},"wifi":{},"system":{}}}}}`
      ),
    };
    axios(config)
      .then((res) => {
        if (res.data?.response?.device_cfg?.[0]?.obj !== "No Response!") {
          const data = res.data.response.device_cfg[0].obj;
          const nodeInf = res.data.response.device_cfg[0].nodeInf;
          setFields(data, nodeInf);
          setImportFrom("");
          form.resetFields(["ImportSelector"]);
        } else {
          form.resetFields();
          message.error("No Response!");
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setLoading(false);
        if (error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
      });
  }

  function handleFileChange(value) {
    console.log(`selected ${value}`);
    setLoading(true);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/repository",
      data: JSON.parse(
        `{"download_file":{${
          level === "super_super"
            ? state.Login.Cid === ""
              ? `"cid":"${cid}"`
              : state.Login.Cid
            : `"cid":"${cid}"`
        },"name":"${value}","type":"json_yml"}}`
      ),
    };
    console.log(config.data);

    axios(config)
      .then((res) => {
        console.log(res.data);
        setFields(
          res.data.response.repository.set.device_cfg.obj,
          res.data.response.repository.set.device_cfg.nodeInf
        );
        setLoading(false);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setLoading(false);
        message.error("update fail.");
      });
  }

  const OnChangeFilter = () => {
    let NewData = dataSource;
    NewData = NewData.filter((item) => {
      let groupfilter;
      if (filterData.groups?.length) {
        groupfilter = item.gid.filter((g) => filterData.groups.indexOf(g) > -1);
      }
      return (
        (filterData.models !== "" ? filterData.models === item.model : true) &&
        (filterData.cities.length
          ? filterData.cities.includes(item.city)
          : true) &&
        (groupfilter?.length ? true : !filterData.groups?.length)
      );
    });
    setNodeList(NewData);
  };

  function GetJSON(values, nodeInf) {

    const ConfigData = `{"set":{"device_cfg":{"filter":{"id":${JSON.stringify(
      values.Device_ID
    )}},"nodeInf":${nodeInf ? JSON.stringify(nodeInf) : "{}"},"obj":{
      ${
        showLte
          ? `${LteJSON(values, showDualSim, form)} ${

              showLan || showPeriod || showAlarm || showWan || showWifi ? `,` : ""
            }`
          : ""
      }
      ${
        showWan
          ? `${WanJSON(values, M300model, SelectedModel)} ${
              showLan || showPeriod || showAlarm || showWifi ? `,` : ""
            }`
          : ""
      }
      ${
        showWifi
          ? `${WifiJSON(values)} ${
              showLan || showPeriod || showAlarm ? `,` : ""
            }`
          : ""
      }
      ${
        showAlarm
          ? `${AlarmJSON(values)} ${showLan || showPeriod ? `,` : ""}`
          : ""
      }
      ${showPeriod ? `${PeriodJSON(values)} ${showLan ? `,` : ""}` : ""}
      ${showLan ? LanJSON(values) : ""} }}}}`;
    return ConfigData;
  }

  const SubmitConfigonFinish = (values) => {
    // console.log(values);
    setLoading(true);

    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(GetJSON(values, undefined)),
    };

    console.log(config.data);

    axios(config)
      .then((res) => {
        console.log(res.data)
        setLoading(false);
        setIsUpdate(!IsUpdate);
        message.success("submit successfully.");
        const failureDevices = res.data.response.device_cfg
          .filter((item) => item.obj === "No Response!")
          .map((item) =>
            item.nodeInf.name !== "" ? item.nodeInf.name : item.nodeInf.id
          );
        // message.success("update successfully.");
        const rebootDevices = res.data.response.device_cfg
          .filter((item) => item.obj?.["$reboot"])
          .map((item) =>
            item.nodeInf.name !== "" ? item.nodeInf.name : item.nodeInf.id
          );

        if (rebootDevices.length || failureDevices.length) {
          // console.log(failureDevices, rebootDevices);
          setResultList({
            failureDevices: failureDevices,
            rebootDevices: rebootDevices,
          });
          setRebootvisible(true);
        }
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setLoading(false);
        message.error("update fail.");
      });
  };

  function RebootDevices(action) {
    setLoading(true);
    let DeviceID;
    if (action === "reboot") {
      DeviceID = form.getFieldsValue().Device_ID;
    } else if (action === "rebootByConfig") {
      DeviceID = resultList.rebootDevices;
    }
    if (!DeviceID) {
      return;
    }

    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"reboot":{"device_cfg":{"filter":{"id":${JSON.stringify(
          DeviceID
        )}},"nodeInf":{}}}}`
      ),
    };
    console.log(config);
    axios(config)
      .then((res) => {
        let rebootfailDevices = res.data.response?.device_cfg;
        // console.log(res.data)
        message.success("submit reboot command");
        if (res.data.response?.device_cfg) {
          rebootfailDevices = rebootfailDevices
            .filter((item) => item.obj === "No Response!")
            .map((item) => item.nodeInf.id);
        }

        if (rebootfailDevices?.length) {
          setRebootvisible(true);
          let newResultList = resultList;
          newResultList.failureDevices = []
          newResultList.rebootDevices=[]
          newResultList.rebootfailDevices = rebootfailDevices;
          console.log(newResultList);
          setResultList(newResultList);
        }
        setLoading(false);
        setIsUpdate(!IsUpdate);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setLoading(false);
        message.error("reboot fail.");
      });
  }

  function SaveConfigonFinish() {
    let FormData = form.getFieldsValue();
    const FileList = FileRepository.map(item=>item.name)
    if(FileList.includes(FormData.yml_filename)){
      message.error("FileName is duplicated!");
      return
    }

    setLoading(true);
    
    let nodeInf = { id: FormData.Device_ID, model: FormData.models, name: "" };
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/repository",
      data: JSON.parse(
        `{"upload_file":{${
          level === "super_super"
            ? state.Login.Cid === ""
              ? `"cid":"${cid}"`
              : state.Login.Cid
            : `"cid":"${cid}"`
        },"name":"${FormData.yml_filename}","type":"json_yml","inf":{"model":"${
          FormData.models
        }"},"json":${GetJSON(FormData, nodeInf)}}}`
      ),
    };
    console.log(config.data);

    axios(config)
      .then(() => {
        // console.log(res.data)
        setLoading(false);
        setIsUpdate(!IsUpdate);
        setSavevisible(false);
        message.success("save successfully");
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        setLoading(false);
        message.error("fail to save file");
      });
  }

  return (
    <Fragment>
      <Modal
        visible={Savevisible}
        onCancel={() => {
          setSavevisible(false);
        }}
        destroyOnClose={true}
        className={styles.modal}
        centered={true}
        width={"50%"}
        title= {t("ISMS.SaveconfigtoRepository")}
        okText="Save"
        footer={[
          <Button key="Cancel" onClick={() => setSavevisible(false)}>
             {t("ISMS.Cancel")}
          </Button>,
          <Button
            key="Save"
            type="primary"
            loading={loading}
            onClick={() => SaveConfigonFinish()}
          >
             {t("ISMS.Save")}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <div className={`${styles.FormWrapper} ${styles.BulkFormWrapper}`}>
            <Row gutter={24} justify="flex-start">
              <Col xs={24} sm={24} md={24} lg={12} xl={12}>
                <Form.Item
                  name={"yml_filename"}
                  label= {t("ISMS.FileName")}
                  rules={[
                    {
                      required: true,
                    },
                  ]}
                >
                  <Input placeholder= {t("ISMS.Inputafilename")} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
      <Modal
        visible={Rebootvisible}
        onCancel={() => {
          setRebootvisible(false);
          setResultList({ failureDevices: [], rebootDevices: [] });
        }}
        destroyOnClose={true}
        className={styles.modal}
        centered={true}
        width={"50%"}
        title="Result"
        footer={[
          resultList.rebootDevices.length ? (
            <Button key="Cancel" onClick={() => setRebootvisible(false)}>
              Cancel
            </Button>
          ) : null,
          resultList.failureDevices.length ||
          resultList.rebootfailDevices?.length ? (
            <Button key="Confirm" onClick={() => setRebootvisible(false)}>
              Confirm
            </Button>
          ) : null,
          resultList.rebootDevices.length ? (
            <Button
              key="Reboot"
              type="primary"
              loading={loading}
              onClick={() => {
                RebootDevices("rebootByConfig");
                setRebootvisible(false);
                setResultList({ failureDevices: [], rebootDevices: [] });
              }}
            >
              Reboot
            </Button>
          ) : null,
        ]}
      >
        {resultList.failureDevices.length ? (
          <div className={styles.rebootWording}>
            <h2>No Response</h2>
            <p>
              Device:
              {resultList.failureDevices.map((item, index) => (
                <span key={index} className={styles.rebootdevice}>{item}</span>
              ))}
            </p>
            <Divider />
          </div>
        ) : (
          ""
        )}

        {resultList.rebootDevices.length ? (
          <div className={styles.rebootWording}>
            <h2>Reboot to implement new config</h2>
            <p>
              Click OK button to <span style={{ color: "red" }}>reboot </span>{" "}
              or click Cancel to reboot manually.
            </p>
            <p>
              Devices:
              {resultList.rebootDevices.map((item, index) => (
                <span className={styles.rebootdevice} key={index}>
                  {item}
                </span>
              ))}
            </p>
          </div>
        ) : (
          ""
        )}

        {resultList.rebootfailDevices?.length ? (
          <div className={styles.rebootWording}>
            <h2>Reboot fail</h2>
            <p>please try again later</p>
            <p>
              Device:
              {resultList.rebootfailDevices.map((item, index) => (
                <span key={index} className={styles.rebootdevice}>{item}</span>
              ))}
            </p>
          </div>
        ) : (
          ""
        )}
      </Modal>
      <Card className={styles.Card} title={t("ISMS.SettingFilter")} >
        <BulkConfigFilter
          SubmitConfigonFinish={SubmitConfigonFinish}
          form={form}
          ImportFrom={ImportFrom}
          setImportFrom={setImportFrom}
          handleDeviceChange={handleDeviceChange}
          setFilterData={setFilterData}
          setShowLan={setShowLan}
          setShowWan={setShowWan}
          setShowLte={setShowLte}
          setShowAlarm={setShowAlarm}
          setShowWifi={setShowWifi}
          setShowPeriod={setShowPeriod}
          showWan={showWan}
          showLan={showLan}
          showLte={showLte}
          showWifi={showWifi}
          showAlarm={showAlarm}
          showPeriod={showPeriod}
          // setPriorityOrderOptions={setPriorityOrderOptions}
          setSavevisible={setSavevisible}
          filterData={filterData}
          OnChangeFilter={OnChangeFilter}
          loading={loading}
          dataSource={dataSource}
          handleFileChange={handleFileChange}
          Fileloading={Fileloading}
          FileRepository={FileRepository}
          Nodeloading={Nodeloading}
          groups={groups}
          cities={cities}
          models={models}
          level={level}
          RebootDevices={RebootDevices}
          NodeList={NodeList}
          DeviceNum={DeviceNum}
          setDeviceNum={setDeviceNum}
          setSelectedModel = {setSelectedModel}
          M300model={M300model}
          

        />
      </Card>

      <Card
        className={styles.Card}
        title="LAN"
        headStyle={{
          boxShadow: "1px 1px 3px lightgray",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        bodyStyle={showLan ? {} : { padding: 0 }}
        extra={
          showLan ? (
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowLan(false)}
            />
          ) : (
            <FcPlus
              className={styles.AddIcon}
              onClick={() => setShowLan(true)}
            />
          )
        }
      >
        {showLan && (
          <BulkConfigFLan
            SubmitConfigonFinish={SubmitConfigonFinish}
            form={form}
            LANIPV6Static={LANIPV6Static}
            setLANIPV6Static={setLANIPV6Static}
            // LanStatisticIPEnable={LanStatisticIPEnable}
            // setLanStatisticIPEnable={setLanStatisticIPEnable}
            DeviceNum={DeviceNum}
          />
        )}
      </Card>
      <Card
        className={styles.Card}
        title="WAN"
        headStyle={{
          boxShadow: "1px 1px 3px lightgray",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        bodyStyle={showWan ? {} : { padding: 0 }}
        extra={
          showWan ? (
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowWan(false)}
            />
          ) : (
            <FcPlus
              className={styles.AddIcon}
              onClick={() => setShowWan(true)}
            />
          )
        }
      >
        {showWan && (
          <BulkConfigFWan
            SubmitConfigonFinish={SubmitConfigonFinish}
            form={form}
            // setPriorityOrderOptions={setPriorityOrderOptions}
            // PriorityOrderOptions={PriorityOrderOptions}
            WanPriority={WanPriority}
            setWanPriority={setWanPriority}
            WanEthernetType={WanEthernetType}
            setWanEthernetType={setWanEthernetType}
            WanDHCPServer1={WanDHCPServer1}
            setWanDHCPServer1={setWanDHCPServer1}
            WanDHCPServer2={WanDHCPServer2}
            setWanDHCPServer2={setWanDHCPServer2}
            WanDHCPServer3={WanDHCPServer3}
            setWanDHCPServer3={setWanDHCPServer3}
            SelectedModel={SelectedModel}
            M300model={M300model}
          />
        )}
      </Card>
      <Card
        className={styles.Card}
        title="LTE"
        headStyle={{
          boxShadow: "1px 1px 3px lightgray",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        bodyStyle={showLte ? {} : { padding: 0 }}
        extra={
          showLte ? (
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowLte(false)}
            />
          ) : (
            <FcPlus
              className={styles.AddIcon}
              onClick={() => setShowLte(true)}
            />
          )
        }
      >
        {showLte && (
          <BulkConfigFLte
            SubmitConfigonFinish={SubmitConfigonFinish}
            form={form}
            LTE1PinEnable={LTE1PinEnable}
            setLTE1PinEnable={setLTE1PinEnable}
            LTERecoverAPN1={LTERecoverAPN1}
            setLTERecoverAPN1={setLTERecoverAPN1}
            LTE2PinEnable={LTE2PinEnable}
            setLTE2PinEnable={setLTE2PinEnable}
            LTE1DataLimitEnable={LTE1DataLimitEnable}
            setLTE1DataLimitEnable={setLTE1DataLimitEnable}
            LTE2DataLimitEnable={LTE2DataLimitEnable}
            setLTE2DataLimitEnable={setLTE2DataLimitEnable}
            showDualSim={showDualSim}
            setSelectedSIM={setSelectedSIM}
            SelectedSIM={SelectedSIM}
            SelectedModel = {SelectedModel}
            M300model={M300model}
          />
        )}
      </Card>

      {!M300model.includes(SelectedModel) && <Card
        className={styles.Card}
        title="Wifi"
        headStyle={{
          boxShadow: "1px 1px 3px lightgray",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        bodyStyle={showWifi ? {} : { padding: 0 }}
        extra={
          showWifi ? (
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowWifi(false)}
            />
          ) : (
            <FcPlus
              className={styles.AddIcon}
              onClick={() => setShowWifi(true)}
            />
          )
        }
      >
        {showWifi && (
          <BulkConfigFWifi
            SubmitConfigonFinish={SubmitConfigonFinish}
            form={form}
            SelectedWPS={SelectedWPS}
            setSelectedWPS={setSelectedWPS}
          />
        )}
      </Card>}

      {!M300model.includes(SelectedModel) && <Card
        className={styles.Card}
        title="Alarm"
        headStyle={{
          boxShadow: "1px 1px 3px lightgray",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        bodyStyle={showAlarm ? {} : { padding: 0 }}
        extra={
          showAlarm ? (
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowAlarm(false)}
            />
          ) : (
            <FcPlus
              className={styles.AddIcon}
              onClick={() => setShowAlarm(true)}
            />
          )
        }
      >
        {showAlarm && (
          <BulkConfigFAlarm
            SubmitConfigonFinish={SubmitConfigonFinish}
            form={form}
            AlarmEnable={AlarmEnable}
            setAlarmEnable={setAlarmEnable}
            AlarmType={AlarmType}
            setAlarmType={setAlarmType}
            GPSReference={GPSReference}
            setGPSReference={setGPSReference}
          />
        )}
      </Card>}
      <Card
        className={styles.Card}
        title="Period"
        headStyle={{
          boxShadow: "1px 1px 3px lightgray",
          fontSize: "1.1rem",
          fontWeight: "bold",
        }}
        bodyStyle={showPeriod ? {} : { padding: 0 }}
        extra={
          showPeriod ? (
            <ImCross
              className={styles.DeleteIcon}
              onClick={() => setShowPeriod(false)}
            />
          ) : (
            <FcPlus
              className={styles.AddIcon}
              onClick={() => setShowPeriod(true)}
            />
          )
        }
      >
        {showPeriod && (
          <BulkConfigFPeriod
            SubmitConfigonFinish={SubmitConfigonFinish}
            form={form}
          />
        )}
      </Card>
    </Fragment>
  );
};

export const BulkConfigMF = React.memo(BulkConfigF);


