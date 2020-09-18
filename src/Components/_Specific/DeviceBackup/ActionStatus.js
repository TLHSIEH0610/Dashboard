import React, { useState, useEffect, useRef, Fragment } from "react";
import styles from "./devicebackup.module.scss";
import { Button, Card, Space, Form, Input, Table, Steps } from "antd";
import axios from "axios";
import { SearchOutlined, UserOutlined, SolutionOutlined, LoadingOutlined, SmileOutlined } from "@ant-design/icons";
import Highlighter from 'react-highlight-words';

const { Step } = Steps;

const ActionStatus = () => {
  const [loading, setLoading] = useState(false)
  const [event, setEvent] = useState([
    { name: "", action: "", key:'', model:'', state:'' },
  ]);


  useEffect(() => {
    setLoading(true)
    axios.get("api/BkUpReSr.json").then((res) => {
      let responseData = []
      res.data.response.bck_rst_upg.forEach((item, index)=>{
        responseData.push({name:item.name, action:item.action, key:index, model:item.model, state:item.state, id:item.id })
      })
      setEvent(responseData);
      setLoading(false)
    });
  },[]);

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

  const[searchText, setSearchText] = useState('')
  const[searchedColumn, setSearchedColumn] = useState('')

 const handleSearch = (selectedKeys, confirm, dataIndex) => {
      confirm();
      setSearchText( selectedKeys[0])
      setSearchedColumn( dataIndex)
    }
  
  const  handleReset = clearFilters => {
      clearFilters();
      setSearchText('')
    }

  const searchInput = useRef('');

  // "response": {
  //   "bck_rst_upg": [
  //     {
  //       "id": "015E350099100001",
  //       "cid": "12345678901234567890123456789011",
  //       "model": "M350",
  //       "name": "2222",
  //       "type": "cfg",
  //       "inf": "123",
  //       "action": "UPGRADE",
  //       "state": "START_REBOOT"
  //     },

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
      title: 'History',
      dataIndex: 'History',
      width: '20%',
      render: ( text, record, index) => (
          <Fragment>
            {<a href='#' key={index}> clear </a>}
          </Fragment>
      )
  }
  ];


  // record.state ==='START_REBOOT'? 'wait' : ( record.state ==='FILE_UPLOADING'? 'process' : 'finish')
  return (
    <Fragment>
     <Card title="Request Status" >
     <Table
        columns={columns}
        dataSource={event}
        pagination={false}
        className={styles.table}
        loading={loading}
        expandable={{
          // expandedRowRender: record => <p style={{ margin: 0 }}>{record.id}</p>,  
          expandedRowRender: record => <Steps>
            {/* {record.state} */}
          <Step status={(record.state ==='RECEIVE_COMMAND' ? 'process' : 'wait')} title="RECEIVE_COMMAND" icon={record.state ==='RECEIVE_COMMAND' ?<LoadingOutlined /> :<UserOutlined />} />
          <Step status={(record.state ===('FILE_UPLOADING' || 'FILE_UPLOAD')) ? 'process' : 'finish'} title="(UP)DOWNLOADING" icon={record.state ===('FILE_UPLOADING' || 'FILE_UPLOAD') ?<LoadingOutlined /> :<SolutionOutlined />} />
          <Step status={'finish'} title="START_REBOOT" icon={<SmileOutlined />} />
        </Steps>,
          rowExpandable: record => record.state !== 'START_REBOOT',
        }}
      />
     </Card>
     </Fragment>
  );
};

export default ActionStatus;
