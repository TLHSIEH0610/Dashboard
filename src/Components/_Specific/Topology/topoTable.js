import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Table,
  Space,
  Modal,
  Tabs,
  Tooltip,
  Select,
} from "antd";
import { useHistory } from "react-router-dom";
import { UserLogOut } from "../../../Utility/Fetch";
import Context from "../../../Utility/Reduxx";
import useURLloader from "../../../hook/useURLloader";
import {
  MdSignalCellularConnectedNoInternet0Bar,
  MdSignalCellular1Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
  MdCastConnected,
} from "react-icons/md";
import { ImCircleDown, ImCancelCircle } from "react-icons/im";
import { AiFillWarning } from "react-icons/ai";
import styles from "./topology.module.scss";
import { SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import axios from "axios";
import {
  StatusStrength,
  StatusGPS,
  StatusDNS,
  StatusConnection,
  TxRxStatistic,
} from "./components/status";
import TopoIoT from "./components/table_IoT";
import { RiAlarmWarningFill, RiEdit2Fill } from "react-icons/ri";
import { FcDocument, FcSettings } from "react-icons/fc";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LanSetting, WanSetting, LteSetting } from "./components/setting";
import OSMap from "../Track_Map/OSmap";

const { Option } = Select;
const { TabPane } = Tabs;
const healthIcon = (props) => {
  switch (props.health) {
    case "up":
      return (
        <div className={styles.iconwrapper}>
          <ImCircleDown className={styles.up} />
          <p>up</p>
        </div>
      );
    case "critical":
      return (
        <div className={styles.iconwrapper}>
          <AiFillWarning className={styles.critical} />
          <p>critical</p>
        </div>
      );
    case "warning":
      return (
        <div className={styles.iconwrapper}>
          <AiFillWarning className={styles.warning} />
          <p>warning</p>
        </div>
      );
    case "offline":
      return (
        <div className={styles.iconwrapper}>
          <ImCancelCircle className={styles.offline} />
          <p>offline</p>
        </div>
      );
  }
};
function strengthIcon(props) {
  switch (props.strength) {
    case "excellent":
      return (
        <div className={styles.iconwrapper}>
          <MdSignalCellular4Bar className={styles.up} />
          <p>excellent</p>
        </div>
      );
    case "good":
      return (
        <div className={styles.iconwrapper}>
          <MdSignalCellular3Bar className={styles.critical} />
          <p>good</p>
        </div>
      );
    case "fair":
      return (
        <div className={styles.iconwrapper}>
          <MdSignalCellular1Bar className={styles.warning} />
          <p>fair</p>
        </div>
      );
    case "poor":
      return (
        <div className={styles.iconwrapper}>
          <MdSignalCellularConnectedNoInternet0Bar className={styles.offline} />
          <p>poor</p>
        </div>
      );
  }
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 12,
  },
};

const EditableContext = React.createContext();

const EditableRow = ({ index, ...props }) => {
  const [form] = Form.useForm();
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  );
};

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false);
  const inputRef = useRef();
  const form = useContext(EditableContext);
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);

  const toggleEdit = () => {
    setEditing(!editing);
    form.setFieldsValue({
      [dataIndex]: record[dataIndex],
    });
  };

  const save = async (e) => {
    try {
      const values = await form.validateFields();
      toggleEdit();
      handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  let childNode = children;

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input ref={inputRef} onPressEnter={save} onBlur={save} />
      </Form.Item>
    ) : (
      <div
        className="editable-cell-value-wrap"
        style={{
          paddingRight: 24,
        }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};

const TopoTable = () => {
  const history = useHistory();
  const { state } = useContext(Context);
  const [form] = Form.useForm();
  const cid = localStorage.getItem("authUser.cid");
  const Deviceurl =
    cid === "proscend"
      ? `/cmd?get={"device_status":{"filter":{${state.Login.Cid}}}}`
      : `/cmd?get={"device_status":{"filter":{"cid":"${cid}"}}}`;
  const [loading, response] = useURLloader(Deviceurl);
  const IoTUrl = `api/IoT_solar.json`;
  const [IoTloading, IoTresponse] = useURLloader(IoTUrl);
  const [dataSource, setDataSource] = useState([]);
  const [record, setRecord] = useState([]);
  const [identity, setIdentity] = useState([]);
  const [lan, setLan] = useState({});
  const [wan, setWan] = useState({});
  const [lte, setLte] = useState({});
  const [IoTDeviceList, setIoTDeviceList] = useState([]);
  const [visible, setVisible] = useState(false);
  const [Svisible, setSvisible] = useState(false);
  const [Dvisible, setDvisible] = useState(false);
  const [IoTvisible, setIoTvisible] = useState(false);
  const [Mapvisible, setMapvisible] = useState(false);
  const [deviceindex, setDeviceindex] = useState(0);

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData);
  };

  useEffect(() => {
    if (response) {
      let responseData = response.response.device_status;
      let dataSource = [];
      console.log(responseData);
      responseData.forEach((item, index) => {
        dataSource.push({
          key: index,
          id: item.nodeInf.id,
          health: item.nodeInf.health,
          model: item.nodeInf.model,
          strength: item.nodeInf.sim,
          alarm: item.obj.status.alarm,
          connection: item.obj.status.connection,
          statistic: item.obj.status.statistic,
          dns: item.obj.status.dns,
          gps: item.obj.status.gps,
          sim: item.obj.status.sim,
        });
      });
      console.log(state);
      console.log(dataSource);
      setDataSource(dataSource);
    }
  }, [response]);

  useEffect(() => {
    if (IoTresponse) {
      console.log(IoTresponse);
      let IoTDeviceList = [];
      IoTresponse.forEach((item) => {
        IoTDeviceList.push(item.id);
      });
      console.log(IoTDeviceList);
      setIoTDeviceList(IoTDeviceList);
    }
  }, [IoTresponse]);

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput.current = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            size={"small"}
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button
            onClick={() => handleReset(clearFilters)}
            size={"small"}
            style={{ width: 90 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });


  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };

  const searchInput = useRef("");

  //tabs點擊後回調
  function callback(key) {
    console.log(key);
    const url = `/cmd?get={"device_cfg":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{"${key}":{}}}}`;
    axios.get(url).then((res) => {
      console.log(res.data);
      if (key === "lan") {
        let result = res.data.response.device_cfg[0].obj.lan;
        setLan(result);
        form.setFieldsValue({
          ip4_address: result.ipv4.address,
          ip4_netmask: result.ipv4.netmask,
          ip4_dhcpmodel: result.ipv4.dhcp.model,
          ip4_dhcp_start: result.ipv4.dhcp.pool[0].start,
          ip4_dhcp_end: result.ipv4.dhcp.pool[0].end,
          ip6_type: result.ipv6.type,
          ip6_assignment: result.ipv6.dhcp.assignment,
        });
      }
      key === "wan" && setWan(res.data.response.device_cfg[0].obj.wan);
      key === "lte" && setLte(res.data.response.device_cfg[0].obj.lte);
    });
  }

  const onFinish = (values) => {
    console.log(values);
  };

  const [filteredInfo, setFilteredInfo] = useState({});
  const [sortedInfo, setSortedInfo] = useState({});
  const handleChange = (pagination, filters, sorter) => {
    console.log("Various parameters", pagination, filters, sorter);
    setFilteredInfo(filters);
    setSortedInfo(sorter);
  };

  const clearFilters = () => {
    setFilteredInfo(null);
  };

  const clearAll = () => {
    setFilteredInfo(null);
    setSortedInfo(null);
  };

  function handleDeviceChange(value) {
    console.log(`selected ${value}`);
    setDeviceindex(value);
  }

  let columns = [
    {
      title: "Device",
      dataIndex: "id",
      width: "27%",
      // editable:true,
      key: "1",
      ...getColumnSearchProps("id"),
      // render: (_, record, index) => {
      //   return (
          // <div className={styles.rename}>
            // record.id
          //   <Tooltip title="rename">
          //     <RiEdit2Fill
          //       className={styles.renameIcon}
          //       onClick={(e) => {
          //         e.preventDefault();
          //       }}
          //     />
          //   </Tooltip>
          // </div>
      //   );
      // },
    },
    {
      title: "Model",
      dataIndex: "model",
      width: "10%",
      key: "2",
      ...getColumnSearchProps("model"),
    },
    {
      title: "Health",
      dataIndex: "health",
      width: "16%",
      key: "health",
      // filters: [
      //   { text: "up", value: "up" },
      //   { text: "critical", value: "critical" },
      //   { text: "warning", value: "warning" },
      //   { text: "offline", value: "offline" },
      // ],
      // filteredValue: filteredInfo ? filteredInfo.health : null,
      // onFilter: (value, record) => record.health.includes(value),
      // sorter: (a, b) => a.health.length - b.health.length,
      // sortOrder: sortedInfo
      //   ? sortedInfo.columnKey === "health" && sortedInfo.order
      //   : null,
      // ellipsis: true,
      render: (text, record, index) => healthIcon(record),
    },
    {
      title: "Strength",
      dataIndex: "strength",
      width: "16%",
      key: "strength",
      // filters: [
      //   { text: "excellent", value: "excellent" },
      //   { text: "good", value: "good" },
      //   { text: "fair", value: "fair" },
      //   { text: "poor", value: "poor" },
      // ],
      // filteredValue: filteredInfo ? filteredInfo.strength : null,
      // onFilter: (value, record) => record.strength.includes(value),
      // sorter: (a, b) => a.strength.length - b.strength.length,
      // sortOrder: sortedInfo
      //   ? sortedInfo.columnKey === "strength" && sortedInfo.order
      //   : null,
      // ellipsis: true,
      render: (text, record, index) => strengthIcon(record),
    },
    {
      title: "Action",
      dataIndex: "alarm",
      width: "25%",
      key: "5",
      render: (text, record, index) => {
        const alarmlog = record.alarm.length;
        return (
          <>
            <Tooltip title="Alarm Log">
              <a
                disabled={alarmlog ? false : true}
                href="#"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setVisible(true);
                  setRecord(record);
                }}
              >
                <RiAlarmWarningFill
                  className={
                    alarmlog
                      ? `${styles.alarmlog}`
                      : `${styles.alarmlog} ${styles.disabled}`
                  }
                />
              </a>
            </Tooltip>
            <Tooltip title="Device Status">
              <a
                href="#"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setSvisible(true);
                  setRecord(record);
                }}
              >
                <FcDocument className={styles.Status} />
              </a>
            </Tooltip>
            <Tooltip title="Map">
              <a
                href="#"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setMapvisible(true);
                  setRecord(record);
                }}
              >
                <FaMapMarkerAlt className={styles.Map} />
              </a>
            </Tooltip>
            <Tooltip title="View IoT">
              <a
                disabled={IoTDeviceList.includes(record.id) ? false : true}
                href="#"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setIoTvisible(true);
                  setRecord(record);
                  console.log(record);
                  form.setFieldsValue({
                    battery_capacity_ah:
                      IoTresponse[0].eeprom.battery_capacity_ah,
                    battery_type: IoTresponse[0].eeprom.battery_type,
                    charge_limit_voltage_v:
                      IoTresponse[0].eeprom.charge_limit_voltage_v,
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
                    over_discharge_delay_s:
                      IoTresponse[0].eeprom.over_discharge_delay_s,
                    over_discharge_reverse_voltage_v:
                      IoTresponse[0].eeprom.over_discharge_reverse_voltage_v,
                    over_discharge_voltage_v:
                      IoTresponse[0].eeprom.over_discharge_voltage_v,
                    overvoltage_voltage_v:
                      IoTresponse[0].eeprom.overvoltage_voltage_v,
                    rasing_charge_reverse_voltage_v:
                      IoTresponse[0].eeprom.rasing_charge_reverse_voltage_v,
                    rasing_charge_time_min:
                      IoTresponse[0].eeprom.rasing_charge_time_min,
                    rasing_charge_voltage_v:
                      IoTresponse[0].eeprom.rasing_charge_voltage_v,
                    recognized_voltage_v:
                      IoTresponse[0].eeprom.recognized_voltage_v,
                    system_voltage_v: IoTresponse[0].eeprom.system_voltage_v,
                    temperature_coefficient:
                      IoTresponse[0].eeprom.temperature_coefficient,
                  });
                }}
              >
                <MdCastConnected className={styles.IoT} />
              </a>
            </Tooltip>
            <Tooltip title="Setting">
              <a
                href="#"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setDvisible(true);
                  setRecord(record);
                  const url = `/cmd?get={"device_identity":{"filter":{"id":"${record.id}"},"nodeInf":{},"obj":{"identity":{}}}}`;
                  // console.log(url);
                  axios
                    .get(url)
                    .then((res) => {
                      console.log(
                        res.data.response.device_identity[0].obj.identity
                      );
                      let key = Object.keys(
                        res.data.response.device_identity[0].obj.identity
                      );
                      let value = Object.values(
                        res.data.response.device_identity[0].obj.identity
                      );
                      let data = [];
                      key.forEach((key, index) => {
                        data.push({ key: key, value: value[`${index}`] });
                      });
                      setIdentity(data);
                    })
                    .catch((error) => {
                      console.log(error);
                      if (error.response.status === 401) {
                        UserLogOut();
                        history.push("/login");
                      }
                    });
                }}
              >
                <FcSettings className={styles.Setting} />
              </a>
            </Tooltip>
          </>
        );
      },
    },
  ];

  columns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave: handleSave,
      }),
    };
  });

  const alarmcolumns = [
    {
      title: "Level",
      dataIndex: "level",
      key: "level",
      ...getColumnSearchProps("level"),
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      ...getColumnSearchProps("message"),
    },
    {
      title: "TrigerTime",
      dataIndex: "trigger_time",
      key: "trigger_time",
      ...getColumnSearchProps("trigger_time"),
    },
    {
      title: "RecoverTime",
      dataIndex: "recover_time",
      key: "recover_time",
      ...getColumnSearchProps("recover_time"),
    },
  ];

  const identitycolumns = [
    {
      title: "Items",
      dataIndex: "key",
      key: "key",
    },
    {
      title: "Data",
      dataIndex: "value",
      key: "value",
    },
  ];

  return (
    <Card>
      <Modal
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        okText="confirm"
        cancelText="cancel"
        centered={true}
        width={"70%"}
        className={styles.modal}
      >
        <Table
          // loading={loading}
          className={styles.alarmtable}
          dataSource={record.alarm}
          columns={alarmcolumns}
          pagination={true}
          scroll={{ y: 400 }}
          size="middle"
        />
      </Modal>
      <Modal
        // Svisible setSvisible
        visible={Svisible}
        onOk={() => setSvisible(false)}
        onCancel={() => setSvisible(false)}
        okText="confirm"
        cancelText="cancel"
        centered={true}
        width={"50%"}
        className={styles.modal}
      >
        <Tabs defaultActiveKey="1">
          <TabPane tab="Statistic" key="1" className={styles.tabpane}>
            <TxRxStatistic dataSource={record} />
          </TabPane>
          <TabPane tab="Connection" key="2" className={styles.tabpane}>
            <StatusConnection dataSource={record} />
          </TabPane>
          <TabPane tab="Strength" key="3" className={styles.tabpane}>
            <StatusStrength dataSource={record} />
          </TabPane>
          <TabPane tab="GPS" key="4" className={styles.tabpane}>
            <StatusGPS dataSource={record} />
          </TabPane>
          <TabPane tab="DNS" key="5" className={styles.tabpane}>
            <StatusDNS dataSource={record} />
          </TabPane>
        </Tabs>
      </Modal>
      <Modal
        // Svisible setSvisible
        visible={IoTvisible}
        onOk={() => setIoTvisible(false)}
        onCancel={() => setIoTvisible(false)}
        okText="confirm"
        cancelText="cancel"
        centered={true}
        width={"35%"}
      >
        <Select
          defaultValue="485_0"
          style={{ width: 120 }}
          onChange={handleDeviceChange}
        >
          {IoTresponse &&
            IoTresponse.map((item, index) => {
              return (
                <Option key={index} value={index}>{`485_${index}`}</Option>
              );
            })}
        </Select>

        <TopoIoT
          dataSource={IoTresponse}
          form={form}
          deviceindex={deviceindex}
        />
      </Modal>
      <Modal
        // Svisible setSvisible
        visible={Mapvisible}
        onOk={() => setMapvisible(false)}
        onCancel={() => setMapvisible(false)}
        okText="confirm"
        cancelText="cancel"
        centered={true}
        width={"35%"}
      >
        <OSMap />
      </Modal>
      <Modal
        visible={Dvisible}
        onOk={() => setDvisible(false)}
        onCancel={() => setDvisible(false)}
        okText="confirm"
        cancelText="cancel"
        centered={true}
        width={"50%"}
        className={styles.modal}
      >
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Identity" key="identity" className={styles.tabpane}>
            <Table
              loading={loading}
              dataSource={identity}
              columns={identitycolumns}
              pagination={true}
            />
          </TabPane>
          <TabPane tab="LAN" key="lan" className={styles.tabpane}>
            <LanSetting layout={layout} form={form} onFinish={onFinish} />
          </TabPane>
          <TabPane tab="WAN" key="wan" className={styles.tabpane}>
            <WanSetting layout={layout} form={form} onFinish={onFinish} />
          </TabPane>
          <TabPane tab="LTE" key="lte" className={styles.tabpane}>
            <LteSetting layout={layout} form={form} onFinish={onFinish} />
          </TabPane>
        </Tabs>
      </Modal>
      {/* 主table */}
      <Space style={{ marginBottom: 16 }}>
        {/* <Button onClick={setAgeSort}>Sort Health</Button> */}
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table
        components={components}
        rowClassName={() => 'editable-row'}
        bordered
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
        onChange={handleChange}
      />
    </Card>
  );
};

export default TopoTable;

// /cmd?get={"device_identity":{}}
/// cmd?get={"device_cfg":{                                                                        }}
// /cmd?get={"device_cfg":{"filter":{"id":"015FcYbTCqw80jjS0dF9AACO"},"nodeInf":{},"obj":{"lan":{}}}}
