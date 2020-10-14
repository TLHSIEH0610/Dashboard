import React, {
  useEffect,
  useState,
  useRef,
  useContext,
} from "react";
import {
  Form,
  Input,
  Button,
  Card,
  Table,
  Space,
  Modal,
  Tooltip,
  message,
  Popconfirm,
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
import TopoIoTC from "./components/TopoIoTC";
import { RiAlarmWarningFill, RiEdit2Fill } from "react-icons/ri";
import { FcDocument, FcSettings } from "react-icons/fc";
import { FaMapMarkerAlt } from "react-icons/fa";
import OSMap from "../Track_Map/OSmap";
import AlarmLogC from "./components/AlarmLogC";
import DeviceStateC from "./components/DeviceStateC";
import DeviceSettingC from "./components/DeviceSettingC";
// import { healthIcon, strengthIcon } from './components/'

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
      default:
        return
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
      default:
        return
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

const TopologyC = () => {
  const history = useHistory();
  const { state } = useContext(Context);
  const cid = localStorage.getItem("authUser.cid");
  const DeviceStateUrl =
    cid === "proscend"
      ? `/cmd?get={"device_status":{"filter":{${state.Login.Cid}}}}`
      : `/cmd?get={"device_status":{"filter":{"cid":"${cid}"}}}`;
  const [DeviceStateloading, DeviceStateResponse] = useURLloader(
    DeviceStateUrl
  );
  const IoTUrl = `api/IoT_solar.json`;
  const [_, IoTresponse] = useURLloader(IoTUrl);
  const [dataSource, setDataSource] = useState([]);
  const [record, setRecord] = useState([]);
  const [identity, setIdentity] = useState([]);
  const [IoTDeviceList, setIoTDeviceList] = useState([]);
  const [AlarmTablevisible, setAlarmTablevisible] = useState(false);
  const [DeviceStatevisible, setDeviceStatevisible] = useState(false);
  const [DeviceSettingvisible, setDeviceSettingvisible] = useState(false);
  const [IoTvisible, setIoTvisible] = useState(false);
  const [Mapvisible, setMapvisible] = useState(false);
  const [deviceindex, setDeviceindex] = useState(0);
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
        if (record.name === values.name) {
          return;
        }
        handleSave({ ...record, ...values });
        const cid = localStorage.getItem("authUser.cid");
        const RenameUrl =
          cid === "proscend"
            ? `/cmd?set={"node_name":{"filter":{${state.Login.Cid}},"list":[{"id":"${record.id}","name":"${values.name}"}]}}`
            : `/cmd?set={"node_name":{"filter":{"cid":"${cid}"},"list":[{"id":"${record.id}","name":"${values.name}"}]}}`;
        axios
          .get(RenameUrl)
          .then((res) => {
            console.log(res);
            message.success("rename successfully.");
          })
          .catch((error) => {
            console.log(error);
            message.error("rename fail.");
          });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
        message.error("rename fail.");
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
        <Popconfirm
          placement="bottom"
          title="sure to rename?"
          onConfirm={() => toggleEdit()}
          okText="Yes"
          cancelText="No"
        >
          <div
            className="editable-cell-value-wrap"
            style={{
              paddingRight: 24,
            }}
            // onClick={toggleEdit}
          >
            {children}
          </div>
        </Popconfirm>
      );
    }

    return <td {...restProps}>{childNode}</td>;
  };

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
    if (DeviceStateResponse) {
      let responseData = DeviceStateResponse.response.device_status;
      let dataSource = [];
      console.log(responseData);
      responseData.forEach((item, index) => {
        dataSource.push({
          key: index,
          id: item.nodeInf.id,
          name: item.nodeInf.name,
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

      setDataSource(dataSource);
    }
  }, [DeviceStateResponse]);

  useEffect(() => {
    if (IoTresponse) {
      // console.log(IoTresponse);
      let IoTDeviceList = [];
      IoTresponse.forEach((item) => {
        IoTDeviceList.push(item.id);
      });
      // console.log(IoTDeviceList);
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


  const DeviceSettingonFinish = (values) => {
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
      dataIndex: "name",
      width: "27%",
      editable: true,
      key: "name",
      ...getColumnSearchProps("name"),
      filteredValue: filteredInfo ? filteredInfo.name : null,
      onFilter: (value, record) => record.name.includes(value),
      render: (_, record) => {
        return (
          <div className={styles.rename}>
            <Tooltip title={record.id}>
              {record.name ? <p>{record.name}</p> : <p>{record.id}</p>}
            </Tooltip>
            <Tooltip title="rename">
              <RiEdit2Fill
                className={styles.renameIcon}
                onClick={(e) => {
                  e.preventDefault();
                }}
              />
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Model",
      dataIndex: "model",
      width: "10%",
      key: "2",
      ...getColumnSearchProps("model"),
      filteredValue: filteredInfo ? filteredInfo.model : null,
      onFilter: (value, record) => record.model.includes(value),
    },
    {
      title: "Health",
      dataIndex: "health",
      width: "16%",
      key: "health",
      filters: [
        { text: "up", value: "up" },
        { text: "critical", value: "critical" },
        { text: "warning", value: "warning" },
        { text: "offline", value: "offline" },
      ],
      filteredValue: filteredInfo ? filteredInfo.health : null,
      onFilter: (value, record) => record.health.includes(value),
      sorter: (a, b) => a.health.length - b.health.length,
      sortOrder: sortedInfo
        ? sortedInfo.columnKey === "health" && sortedInfo.order
        : null,
      // ellipsis: true,
      render: (_, record) => healthIcon(record),
    },
    {
      title: "Strength",
      dataIndex: "strength",
      width: "16%",
      key: "strength",
      filters: [
        { text: "excellent", value: "excellent" },
        { text: "good", value: "good" },
        { text: "fair", value: "fair" },
        { text: "poor", value: "poor" },
      ],
      filteredValue: filteredInfo ? filteredInfo.strength : null,
      onFilter: (value, record) => record.strength.includes(value),
      sorter: (a, b) => a.strength.length - b.strength.length,
      sortOrder: sortedInfo
        ? sortedInfo.columnKey === "strength" && sortedInfo.order
        : null,
      // ellipsis: true,
      render: (_, record) => strengthIcon(record),
    },
    {
      title: "Action",
      dataIndex: "alarm",
      width: "25%",
      key: "5",
      render: (_, record, index) => {
        const alarmlog = record.alarm.length;
        return (
          <>
            <Tooltip title="Alarm Log">
              <a
                disabled={alarmlog ? false : true}
                href="/#"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setAlarmTablevisible(true);
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
                href="/#"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setDeviceStatevisible(true);
                  setRecord(record);
                }}
              >
                <FcDocument className={styles.Status} />
              </a>
            </Tooltip>
            <Tooltip title="Map">
              <a
                href="/#"
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
                href="/#"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setIoTvisible(true);
                  setRecord(record);
                  console.log(record);
                }}
              >
                <MdCastConnected className={styles.IoT} />
              </a>
            </Tooltip>
            <Tooltip title="Setting">
              <a
                href="/#"
                key={index}
                onClick={(e) => {
                  e.preventDefault();
                  setDeviceSettingvisible(true);
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

  return (
    <Card>
      <AlarmLogC
        dataSource={record.alarm}
        getColumnSearchProps={getColumnSearchProps}
        AlarmTablevisible={AlarmTablevisible}
        setAlarmTablevisible={setAlarmTablevisible}
      />

      <DeviceStateC
        record={record}
        DeviceStatevisible={DeviceStatevisible}
        setDeviceStatevisible={setDeviceStatevisible}
      />

      {IoTresponse && (
        <TopoIoTC
          IoTvisible={IoTvisible}
          setIoTvisible={setIoTvisible}
          IoTresponse={IoTresponse}
          deviceindex={deviceindex}
          handleDeviceChange={handleDeviceChange}
        />
      )}

      <Modal
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

      <DeviceSettingC
        DeviceSettingvisible={DeviceSettingvisible}
        setDeviceSettingvisible={setDeviceSettingvisible}
        DeviceStateloading={DeviceStateloading}
        identity={identity}
        DeviceSettingonFinish={DeviceSettingonFinish}
        layout={layout}
      />

      <Space style={{ marginBottom: 16 }}>
        <Button onClick={clearFilters}>Clear filters</Button>
        <Button onClick={clearAll}>Clear filters and sorters</Button>
      </Space>
      <Table
        components={components}
        rowClassName={() => "editable-row"}
        bordered
        loading={DeviceStateloading}
        dataSource={dataSource}
        columns={columns}
        // pagination={false}
        onChange={handleChange}
      />
    </Card>
  );
};

export default TopologyC;

// /cmd?get={"device_identity":{}}
/// cmd?get={"device_cfg":{                                                                        }}
// /cmd?get={"device_cfg":{"filter":{"id":"015FcYbTCqw80jjS0dF9AACO"},"nodeInf":{},"obj":{"lan":{}}}}
