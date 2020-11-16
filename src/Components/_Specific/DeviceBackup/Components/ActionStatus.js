import React, { useState, useEffect, useRef, Fragment,useContext } from "react";
import styles from "../devicebackup.module.scss";
import { Button, Card, Space, Input, Table, Steps, Popconfirm, message } from "antd";
import axios from "axios";
import {
  SearchOutlined,
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import Context from '../../../../Utility/Reduxx'
import { Translator } from '../../../../i18n/index'


const { Step } = Steps;

const ActionStatusC = ({ uploading, setUploading }) => {
  const { state, dispatch } = useContext(Context)  
  const [event, setEvent] = useState([
    { name: "", action: "", key: "", model: "", state: "" },
  ]);
  const [count, setCount] = useState(0);
  const [tableUploading, setTableUploading] = useState(false)
  // const IsActionUpdated = state.BackupRestore.IsActionUpdated
  const cid = localStorage.getItem("authUser.cid");


  useEffect(() => {
    setTableUploading(true)
    const ActionStateUrl = cid==='proscend' ? `/cmd?get={"bck_rst_upg_list":{"list":{${state.Login.Cid}}}}`: `/cmd?get={"bck_rst_upg_list":{"list":{"cid":"${cid}"}}}`;     

    axios.get(ActionStateUrl).then((res) => {
      let responseData = [];
      res.data.response &&(
        res.data.response.bck_rst_upg.forEach((item, index) => {
          responseData.push({
            name: item.name,
            device_name: item.device_name,
            action: item.action,
            key: index,
            model: item.model,
            state: item.state,
            id: item.id,
          })
        }))
      if (JSON.stringify(responseData) === JSON.stringify(event)) {

        return;
      }

      setEvent(responseData);

      dispatch({type:'ActionStatusList', payload:{ActionStatusList: responseData}})
      // dispatch({type:'IsActionUpdated', payload:{IsActionUpdated: false}})
      setTableUploading(false)
    }).catch(()=>{
      setTableUploading(false)
    })

    const stateInterval = setInterval(() => {
      setCount((prevState) => prevState + 1);
    }, 10000);

    return () => clearInterval(stateInterval);

  }, [count, uploading, state.Login.Cid]);

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

  function clearHistory(id) {
    setUploading(true)
    let url = `/cmd?set={"bck_rst_upg_list":{"delete":{"id":"${id}"}}}`;
    console.log(url)
    axios.get(url).then((res) => {
      console.log(res)
      setCount((prevState) => prevState + 1)
      setUploading(false)
      message.success('clear successfully.')
    })
    .catch((error)=>{
      console.log(error)
      setUploading(false)
      message.error('operation failed.')
    })
  }

  const columns = [
    {
      title: Translator("ISMS.Device"),
      dataIndex: "id",
      width: "30%",
      ...getColumnSearchProps("id"),
      render: (_, record) => record.device_name!=='' ? record.device_name : record.id
    },
    {
      title: Translator("ISMS.Device"),
      dataIndex: "model",
      width: "15%",
      ...getColumnSearchProps("model"),
    },
    {
      title: Translator("ISMS.Action"),
      dataIndex: "action",
      width: "15%",
      ...getColumnSearchProps("action"),
    },
    {
      title: Translator("ISMS.Status"),
      dataIndex: "state",
      width: "20%",
      ...getColumnSearchProps("state"),
    },
    {
      title: Translator("ISMS.History"),
      dataIndex: "History",
      width: "20%",
      render: (_, record, index) => (
        <Fragment>
          {
            <Popconfirm
              title="Sure to delete?"
              onConfirm={() => clearHistory(record.id)}
            >
              <Button key={index}>clear</Button>
            </Popconfirm>
          }
        </Fragment>
      ),
    },
  ];

  return (
    <Fragment>
      <Card
        title={Translator("ISMS.Action Status")}
        // headStyle={{ background: "rgba(0,0,0,.03)" }}
        bordered = {true}
      >
        <Table
          columns={columns}
          dataSource={event}
          pagination={false}
          className={styles.table}
          loading={(count===0 && tableUploading) || uploading}
          expandable={{
            expandedRowRender: (record) => (
              <div className={styles.step}>
                <Steps>
                  <Step
                    status={
                      record.state === "RECEIVE_COMMAND" || record.state === "START"? "process" : "finish"
                    }
                    title="RECEIVE_COMMAND"
                    icon={
                      record.state === "RECEIVE_COMMAND" || record.state === "START"? (
                        <LoadingOutlined />
                      ) : (
                        <UserOutlined />
                      )
                    }
                  />
                  <Step
                    status={
                      record.state === "FILE_UPLOADING" || record.state === "FILE_DOWNLOADING" || record.state === "FILE_DOWNLOAD"? "process" : "wait"
                    }
                    title="Processing"
                    icon={
                      record.state === "FILE_UPLOADING" || record.state === "FILE_DOWNLOADING" || record.state === "FILE_DOWNLOAD"? (
                        <LoadingOutlined />
                      ) : (
                        <SolutionOutlined />
                      )
                    }
                  />
                  <Step
                    status={"wait"}
                    title="Complete"
                    icon={<SmileOutlined />}
                  />
                </Steps>
              </div>
            ),
            rowExpandable: (record) =>
              record.state !== "START_REBOOT" && record.state !== "FILE_UPLOAD",
          }}
        />
      </Card>
    </Fragment>
  );
};

export default ActionStatusC;


