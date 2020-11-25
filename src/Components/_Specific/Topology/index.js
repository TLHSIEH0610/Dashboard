import React, {
  useEffect,
  useState,
  useRef,
  useContext,
  Fragment,
} from "react";
import {
  Form,
  Input,
  Card,
  Table,
  Tooltip,
  message,
  Popconfirm,
  Menu,
  Dropdown,
} from "antd";
import Context from "../../../Utility/Reduxx";
import useURLloader from "../../../hook/useURLloader";
import { MdCastConnected } from "react-icons/md";
import styles from "./topology.module.scss";
import { DownOutlined } from "@ant-design/icons";
import axios from "axios";
import { TopoIoTMC } from "./components/TopoIoTC";
import { RiAlarmWarningFill, RiEdit2Fill } from "react-icons/ri";
import { FcDocument, FcSettings } from "react-icons/fc";
import { FaMapMarkerAlt } from "react-icons/fa";
import { AlarmLogMC } from "./components/AlarmLogC";
import { DeviceStateMC } from "./components/DeviceStateC";
import { DeviceSettingMC } from "./components/DeviceSettingC";
import { healthIcon, strengthIcon } from "./components/TopologyF";
import { TopoFilterMC } from "./components/Filter";
import TrackMap from "../Track_Map/TrackerMap";
import { useTranslation } from 'react-i18next';

const TopologyC = () => {
  const { state } = useContext(Context);
  const [uploading, setUploading] = useState(false);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const NodeInfoUrl =
  level === "super_super"
      ? `/cmd?get={"nodeInf":{"filter":{${state.Login.Cid}}}}`
      : `/cmd?get={"nodeInf":{"filter":{"cid":"${cid}"}}}`;
  const [NodeInfoLoading, NodeInfoResponse] = useURLloader(
    NodeInfoUrl,
    uploading
  );
  const [dataSource, setDataSource] = useState([]);
  // const [IoTDeviceList, setIoTDeviceList] = useState([]);
  const [AlarmTablevisible, setAlarmTablevisible] = useState(false);
  const [DeviceStatevisible, setDeviceStatevisible] = useState(false);
  const [DeviceSettingvisible, setDeviceSettingvisible] = useState(false);
  const [IoTvisible, setIoTvisible] = useState(false);
  const [Mapvisible, setMapvisible] = useState(false);
  // const [deviceindex, setDeviceindex] = useState(0);
  const EditableContext = React.createContext();
  // const [drawerVisible, setDrawerVisible] = useState(false);
  const [AlarmRecord, setAlarmRecord] = useState([])
  const [DeviceStatusRecord, setDeviceStatusRecord]  = useState([]) 
  const [SettingRecord, setSettingRecord]  = useState([])
  const [IoTRecord, setIoTRecord]  = useState([])
  const [MapRecord, setMapRecord]  = useState([])
  const { t } = useTranslation();


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
        setUploading(true);
        
        // const cid = localStorage.getItem("authUser.cid");
        const RenameUrl = `/cmd?set={"node_name":{"filter":{"cid":"${record.cid}"},"list":[{"id":"${record.id}","name":"${values.name}"}]}}`;
        axios
          .post(RenameUrl)
          .then((res) => {
            handleSave({ ...record, ...values });
            console.log(res);
            message.success("rename successfully.");
            setUploading(false);
          })
          .catch((error) => {
            console.log(error);
            message.error("rename fail.");
          });
      } catch (errInfo) {
        console.log("Save failed:", errInfo);
        message.error("rename fail.");
        setUploading(false);
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

  useEffect(() => {
    if (NodeInfoResponse && NodeInfoResponse.response) {
      let NodeInfo = [];
      // console.log(responseData);
      NodeInfoResponse.response.nodeInf.forEach((item, index) => {
        NodeInfo.push({
          key: index,
          id: item.nodeInf.id,
          name: item.nodeInf.name,
          health: item.nodeInf.health,
          model: item.nodeInf.model,
          strength: item.nodeInf.sim,
          connection: item.nodeInf.connect,
          cid: item.nodeInf.cid,
        });
      });
      setDataSource(NodeInfo);
    }
  }, [NodeInfoResponse]);

  const menu = (record, index) => {
    return(
    <Menu>
      <Menu.Item key={index}>{IconforGenerator(record, index)}</Menu.Item>
    </Menu>
  )};

  function IconforGenerator(record, index) {
    return (
      <div className={styles.RWDwrapper}>
        <Tooltip title={`health: ${record.health}`}>
          {healthIcon(record.health)}
        </Tooltip>
        <Tooltip title={`signal: ${record.strength}`}>
          {strengthIcon(record.strength)}
        </Tooltip>

        <Tooltip title="Alarm">
          <a
            href="/#"
            key={index}
            onClick={(e) => {
              e.preventDefault();
              setAlarmTablevisible(true);
              setAlarmRecord(record);
            }}
          >
            <RiAlarmWarningFill
              className={styles.alarmlog}
              style={record.health === "up" && { color: "lightgray" }}
            />
          </a>
        </Tooltip>
        <Tooltip title="Device Status">
          <a
            href="/#"
            key={index}
            onClick={(e) => {
              console.log(record);
              e.preventDefault();
              setDeviceStatevisible(true);
              setDeviceStatusRecord(record);
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
              setMapRecord(record);
            }}
          >
            <FaMapMarkerAlt className={styles.Map} />
          </a>
        </Tooltip>
        <Tooltip title="View IoT">
          <a
            // disabled={IoTDeviceList.includes(record.id) ? false : true}
            href="/#"
            key={index}
            onClick={(e) => {
              e.preventDefault();
              setIoTvisible(true);
              setIoTRecord(record);
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
              setSettingRecord(record);
            }}
          >
            <FcSettings className={styles.Setting} />
          </a>
        </Tooltip>
      </div>
    );
  }
  const title = (content) =>t(content)
  let columns = [
    {
      title: title('ISMS.Device'),
      dataIndex: "name",
      width: "35%",
      editable: true,
      key: "name",
      render: (_, record) => {
        return (
          <div className={styles.rename}>
            <div style={{ display: "flex" }}>
              <Tooltip title={record.id}>
                {record.name ? <p>{record.name}</p> : <p>{record.id}</p>}
              </Tooltip>
              <Tooltip title="rename">
                <RiEdit2Fill className={styles.renameIcon} />
              </Tooltip>
            </div>
          </div>
        );
      },
    },
    {
      title: title('ISMS.Model'),
      dataIndex: "model",
      width: "15%",
      key: "2",
      responsive: ["sm"],
    },
    {
      title: state.Global.innerWidth > 576 ? title('ISMS.Information') : title('ISMS.Info'),
      dataIndex: "information",
      key: "information",
      render: (_, record, index) => {
        return (
          <Fragment>
            {state.Global.innerWidth > 500 ? (
              IconforGenerator(record, index)
            ) : (
              <Dropdown
                overlay={menu(record, index)}
                key={index}
                overlayClassName={styles.iconDrop}
              >
                <DownOutlined />
              </Dropdown>
            )}
          </Fragment>
        );
      },
    },
  ];

  const handleSave = (row) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, { ...item, ...row });
    setDataSource(newData)
  };

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
    <Fragment>
      <AlarmLogMC
        setRecord={setAlarmRecord}
        record={AlarmRecord}
        AlarmTablevisible={AlarmTablevisible}
        setAlarmTablevisible={setAlarmTablevisible}
      />
      
      <DeviceStateMC
        record={DeviceStatusRecord}
        setRecord={setDeviceStatusRecord}
        DeviceStatevisible={DeviceStatevisible}
        setDeviceStatevisible={setDeviceStatevisible}
      />


        <TopoIoTMC
          IoTvisible={IoTvisible}
          setIoTvisible={setIoTvisible}
          // setDeviceindex={setDeviceindex}
          record={IoTRecord}
          setRecord={setIoTRecord}
        />



        <TrackMap
          // drawerVisible={drawerVisible}
          // setDrawerVisible={setDrawerVisible}
          setMapvisible={setMapvisible}
          Mapvisible={Mapvisible}
          record={MapRecord}
          setRecord={setMapRecord}
        />
      

      <DeviceSettingMC
        DeviceSettingvisible={DeviceSettingvisible}
        setDeviceSettingvisible={setDeviceSettingvisible}
        // NodeInfoLoading={NodeInfoLoading}
        record={SettingRecord}
        setRecord={setSettingRecord}
      />
      <Card style={{ marginBottom: "10px" }} className={styles.TopoTableCard}>
        <TopoFilterMC setDataSource={setDataSource} dataSource={dataSource} uploading={NodeInfoLoading}/>
      </Card>
      <Card bodyStyle={{ padding: "2px" }}>
        <Table
          className={styles.TopoTable}
          components={components}
          rowClassName={() => "editable-row"}
          bordered
          loading={NodeInfoLoading || uploading}
          dataSource={dataSource}
          columns={columns}
        />
      </Card>
    </Fragment>
  );
};

export default TopologyC;
