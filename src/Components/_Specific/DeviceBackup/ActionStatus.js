import React, { useState, useEffect, useRef, Fragment,useContext } from "react";
import styles from "./devicebackup.module.scss";
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
import Context from '../../../Utility/Reduxx'
// import { UserLogOut } from "../../../Utility/Fetch";

const { Step } = Steps;

const ActionStatus = () => {
  const { state, dispatch } = useContext(Context)  
  const [loading, setLoading] = useState(false);
  const [event, setEvent] = useState([
    { name: "", action: "", key: "", model: "", state: "" },
  ]);
  const [count, setCount] = useState(0);
  const IsActionUpdated = state.BackupRestore.IsActionUpdated

  useEffect(() => {

    const cid = localStorage.getItem("authUser.cid");
    const url = cid==='proscend?' ? `/cmd?set={"bck_rst_upg_list":{"list":{ ${state.Login.Cid}}}}`: `/cmd?set={"bck_rst_upg_list":{"list":{ "cid":${cid}}}}`;

    axios.get(url).then((res) => {
      let responseData = [];
      res.data.response &&(
        res.data.response.bck_rst_upg.forEach((item, index) => {
          responseData.push({
            name: item.name,
            action: item.action,
            key: index,
            model: item.model,
            state: item.state,
            id: item.id,
          })
        }))
      if (JSON.stringify(responseData) === JSON.stringify(event)) {
        setLoading(false)
        return;
      }

      setEvent(responseData);
      dispatch({type:'ActionStatusList', payload:{ActionStatusList: responseData}})
      dispatch({type:'IsActionUpdated', payload:{IsActionUpdated: false}})
      setLoading(false)
    });

    const stateInterval = setInterval(() => {
      setCount((prevState) => prevState + 1);
    }, 10000);

    return () => clearInterval(stateInterval);

  }, [count, IsActionUpdated]);

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
    setLoading(true)
    let url = `/cmd?set={"bck_rst_upg_list":{"delete":{"id":"${id}"}}}`;
    axios.get(url).then((res) => {
      console.log(res)
      setCount((prevState) => prevState + 1)
      setLoading(false)
      message.success('clear successfully.')
    }).then(()=>{
      setLoading(true)
    })
    .catch((error)=>{
      console.log(error)
      setLoading(false)
      message.error('operation failed.')
    })
  }

  const columns = [
    {
      title: "Device",
      dataIndex: "id",
      width: "30%",
      ...getColumnSearchProps("id"),
    },
    {
      title: "Model",
      dataIndex: "model",
      width: "15%",
      ...getColumnSearchProps("model"),
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "15%",
      ...getColumnSearchProps("action"),
    },
    {
      title: "State",
      dataIndex: "state",
      width: "20%",
      ...getColumnSearchProps("state"),
    },
    {
      title: "History",
      dataIndex: "History",
      width: "20%",
      render: (text, record, index) => (
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
        title="Action Status"
        // headStyle={{ background: "rgba(0,0,0,.03)" }}
        bordered = {true}
      >
        <Table
          columns={columns}
          dataSource={event}
          pagination={false}
          className={styles.table}
          loading={loading}
          expandable={{
            expandedRowRender: (record) => (
              <div className={styles.step}>
                <Steps>
                  <Step
                    status={
                      record.state === "RECEIVE_COMMAND" ? "process" : "finish"
                    }
                    title="RECEIVE_COMMAND"
                    icon={
                      record.state === "RECEIVE_COMMAND" ? (
                        <LoadingOutlined />
                      ) : (
                        <UserOutlined />
                      )
                    }
                  />
                  <Step
                    status={
                      record.state === "FILE_UPLOADING" ? "process" : "wait"
                    }
                    title="Processing"
                    icon={
                      record.state === "FILE_UPLOADING" ? (
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

export default ActionStatus;
