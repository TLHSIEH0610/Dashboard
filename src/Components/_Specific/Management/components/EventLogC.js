
import React, { useEffect, useState, useRef, useContext } from "react";
import {
  Button,
  Modal,
  Table,
  Alert,
  Spin,
  Input,
  Space
} from "antd";
import styles from "../management.module.scss";
import axios from "axios";
import {
  SearchOutlined
} from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useTranslation } from 'react-i18next';
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";

const EventLogC = ({ record, EventLogModalvisible, setEventLogModalvisible, setRecord }) => {
    const [uploading, setUploading] = useState(false);
    const [EventLog, setEventLog] = useState([])
    const { t } = useTranslation();
    const { dispatch } = useContext(Context);
    const history = useHistory();

    useEffect(() => {
      if (record.cid) {
        setUploading(true)
        // const EventLogUrl = `/cmd?get={"event_log":{"filter":{"cid":"${record.cid}"}}} `
        const config = {
          method: 'post',
          headers: { 'Content-Type': 'application/json' },
          url: '/cmd',
          data: JSON.parse(`{"get":{"event_log":{"filter":{"cid":"${record.cid}"}}}}`),
        }
        axios(config).then((res)=>{

            const EventLog = res.data.response.event_log.list[0].event_list.map((item, index)=>{
                // let getTime =  new Date(item.timestamp*1000)
                return(
                  {
                    key: index,
                    message: item.message,
                    time: item.timestamp
                }
                )
            })
            console.log(EventLog)
            setEventLog(EventLog)
            setUploading(false)
        })
        .catch((error)=>{
            console.log(error)
            setUploading(false)
            if (error.response && error.response.status === 401) {
              dispatch({ type: "setLogin", payload: { IsLogin: false } });
              UserLogOut();
              history.push("/userlogin");
            }
        })
      }
          // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [record.cid]);

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
            // placeholder={`Search ${dataIndex}`}
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
               {t("ISMS.Search")}
            </Button>
            <Button
              onClick={() => handleReset(clearFilters)}
              size={"small"}
              style={{ width: 90 }}
            >
               {t("ISMS.Reset")}
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

    const columns = [
        {
          title: t("ISMS.Message"),
          dataIndex: 'message',
          ...getColumnSearchProps("message"),
        },
        {
          title:  t("ISMS.Time"),
          dataIndex: 'time',
          sorter:(a,b) =>{
            // console.log(a,b)
            return a.time - b.time
        },
           defaultSortOrder :'descend',
          render:(text) => {
            let date = new Date(text * 1000);
            return(
              `${date.getFullYear()}-${
                date.getMonth() + 1
              }-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`
            )
          }

        },
      ];
  
    return (
      <Modal
        title={t("ISMS.EventLog")}
        className={styles.modal}
        visible={EventLogModalvisible}
        onCancel={() => {
          setEventLogModalvisible(false);
          setRecord({ cid: null });
        }}
        footer={[
          <Button
            key="submit"
            type="primary"
            loading={uploading}
            onClick={() => {
                setEventLogModalvisible(false);
            }}
          >
             {t("ISMS.Confirm")}
          </Button>,
        ]}
      >
       {uploading? <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin> : <Table className={styles.table} columns={columns} dataSource={EventLog} />}
      </Modal>
    );
  };
  
  export const EventLogMC = React.memo(EventLogC);