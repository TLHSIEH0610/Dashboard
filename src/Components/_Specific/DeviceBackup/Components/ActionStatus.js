import React, {
  useState,
  useEffect,
  Fragment,
  useContext,
} from "react";
import styles from "../devicebackup.module.scss";
import {
  Button,
  Card,
  Table,
  Steps,
  Popconfirm,
  message,
  Tooltip
} from "antd";
import axios from "axios";
import {
  UserOutlined,
  SolutionOutlined,
  LoadingOutlined,
  SmileOutlined,
} from "@ant-design/icons";
// import Highlighter from "react-highlight-words";
import Context from "../../../../Utility/Reduxx";
import { useTranslation } from 'react-i18next';
import { FcSynchronize } from 'react-icons/fc'
import { FaAutoprefixer } from 'react-icons/fa'

const { Step } = Steps;

const ActionStatusC = ({ setIsUpdate, IsUpdate }) => {
  const { state, dispatch } = useContext(Context);
  const [event, setEvent] = useState([]);
  const [count, setCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  // const IsActionUpdated = state.BackupRestore.IsActionUpdated
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const { t } = useTranslation();
  const [ActionStatusIsUpdate, setActionStatusIsUpdate] = useState(false)
  const [AutoRefresh, setAutoRefresh] = useState(false)


  useEffect(()=>{
    if(!AutoRefresh){
      return
    }

      // setIsUpdate(!IsUpdate)
      setActionStatusIsUpdate(!ActionStatusIsUpdate)
      const stateInterval = setInterval(() => {
        setCount((prevState) => prevState + 1);
      }, 10000);

    return () => clearInterval(stateInterval);

  },[AutoRefresh, count])

  useEffect(() => {
    setUploading(true);
    // const ActionStateUrl = level==='super_super' ? `/cmd?get={"bck_rst_upg_list":{"list":{${state.Login.Cid}}}}`: `/cmd?get={"bck_rst_upg_list":{"list":{"cid":"${cid}"}}}`;
    console.log('update')
    const config1 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"bck_rst_upg_list":{"list":{${
          level === "super_super"
            ? state.Login.Cid === ""
              ? ""
              : state.Login.Cid
            : `"cid":"${cid}"`
        }}}}}`
      ),
    };

    const config2 = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"get":{"city":{"filter":{${
          level === "super_super"
            ? state.Login.Cid === ""
              ? ""
              : state.Login.Cid
            : `"cid":"${cid}"`
        }}}}}`
      ),
    };

    function ActionStateUrl() {
      return axios(config1);
    }
    function getCityUrl() {
      return axios(config2);
    }

    axios
      .all([ActionStateUrl(), getCityUrl()])
      .then(
        axios.spread((acct, perms) => {
          let CityResponse = perms.data?.response?.city?.data;
          let responseData
          if(acct?.data?.response?.bck_rst_upg){
             responseData = acct.data.response.bck_rst_upg.map(
              (item, index) => {
                let city = CityResponse.filter((i)=>i.id === item.id)
                // console.log(city)
                return ({
                  name: item.name,
                  device_name: item.device_name,
                  action: item.action,
                  key: index,
                  model: item.model,
                  state: item.state,
                  id: item.id,
                  time: item.utc,
                  city: city[0].city,
                })
              }
            );
          }else{
            responseData = []
          }


          // console.log(responseData);

          if (JSON.stringify(responseData) === JSON.stringify(event)) {
            setUploading(false);
            return;
          }
          // console.log(responseData)
          setEvent(responseData);

          dispatch({
            type: "ActionStatusList",
            payload: { ActionStatusList: responseData },
          });
          // dispatch({type:'IsActionUpdated', payload:{IsActionUpdated: false}})
          setUploading(false);
        })
      )
      .catch(() => {
        setUploading(false);
      });

    // const stateInterval = setInterval(() => {
    //   setCount((prevState) => prevState + 1);
    // }, 10000);

    // return () => clearInterval(stateInterval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [IsUpdate, state.Login.Cid, ActionStatusIsUpdate]);


  function clearHistory(id) {
    setUploading(true);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/cmd",
      data: JSON.parse(
        `{"set":{"bck_rst_upg_list":{"delete":{"id":"${id}"}}}}`
      ),
    };

    axios(config)
      .then((res) => {
        // console.log(res);
        setCount((prevState) => prevState + 1);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("clear successfully.");
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("operation failed.");
      });
  }

  const columns = [
    {
      title: t("ISMS.Location"),
      dataIndex: "city",
      render:(_, record) => record.city? record.city : 'No GPS Data'
    },
    {
      title: t("ISMS.Device"),
      dataIndex: "id",
      // width: "30%",
      // ...getColumnSearchProps("id"),
      render: (_, record) =>
        record.device_name !== "" ? record.device_name : record.id,
    },
    {
      title: t("ISMS.Model"),
      dataIndex: "model",
      // width: "15%",
      // ...getColumnSearchProps("model"),
      responsive: ["md"],
    },
    {
      title: t("ISMS.Action"),
      dataIndex: "action",
      // width: "15%",
    },
    {
      title: t("ISMS.FileName"),
      dataIndex: "name",
      // width: "15%",
      // ...getColumnSearchProps("name"),
      responsive: ["md"],
    },
    {
      title: t("ISMS.Time"),
      dataIndex: "time",
      // width: "20%",
      sorter: (a, b) => a.time - b.time,
      sortDirections: ["descend", "ascend"],
      render: (text) => {
        if (text) {
          let date = new Date(text * 1000);
          // console.log(date.toLocaleString())
          return `${date.getFullYear()}-${
            date.getMonth() + 1
          }-${date.getDate()} ${date.getHours() + 8}:${date.getMinutes()}`;
        }
      },
    },
    {
      title: t("ISMS.Status"),
      dataIndex: "state",
      // width: "20%",
      // ...getColumnSearchProps("state"),
    },
    {
      title: t("ISMS.History"),
      dataIndex: "History",
      // width: "20%",
      render: (_, record, index) => (
        <Fragment>
          {
            <Popconfirm
              title={t("ISMS.Suretodelete")}
              okText={t("ISMS.OK")}
              cancelText={t("ISMS.Cancel")}
              onConfirm={() => clearHistory(record.id)}
            >
              <Button key={index} loading={uploading}>
                {t("ISMS.clear")}
              </Button>
            </Popconfirm>
          }
        </Fragment>
      ),
    },
  ];


  return (
    <Fragment>
      <Card
        title={t("ISMS.Action Status")}
        bordered={true}
        extra={
          <div className={styles.IconWrapper}>

          <Tooltip title={t("ISMS.Refresh")}>
            <Button
              icon={<FcSynchronize style={{fontSize:'1.7rem'}} />}
              onClick={() => setActionStatusIsUpdate(!ActionStatusIsUpdate)}
            />
          </Tooltip>

          <Tooltip title={t("ISMS.AutoRefresh")}>
            <Button style={AutoRefresh ? {background:'#FFEFD5'} : null} onClick={()=>setAutoRefresh(!AutoRefresh)} icon={<div className={styles.autoRefresh}> <FcSynchronize style={{fontSize:'1.7rem'}}/><FaAutoprefixer className={styles.alphet}/></div>} />
          </Tooltip>

        </div>
        }
      >
        <Table
          columns={columns}
          dataSource={event}
          pagination={true}
          className={styles.table}
          loading={count === 0 && uploading}
          expandable={{
            expandedRowRender: (record) => (
              <div className={styles.step}>
                <Steps>
                  <Step
                    status={
                      record.state === "RECEIVE_COMMAND" ||
                      record.state === "START"
                        ? "process"
                        : "finish"
                    }
                    title="RECEIVE_COMMAND"
                    icon={
                      record.state === "RECEIVE_COMMAND" ||
                      record.state === "START" ? (
                        <LoadingOutlined />
                      ) : (
                        <UserOutlined />
                      )
                    }
                  />
                  <Step
                    status={
                      record.state === "FILE_UPLOADING" ||
                      record.state === "FILE_DOWNLOADING" ||
                      record.state === "FILE_DOWNLOAD"
                        ? "process"
                        : "wait"
                    }
                    title="Processing"
                    icon={
                      record.state === "FILE_UPLOADING" ||
                      record.state === "FILE_DOWNLOADING" ||
                      record.state === "FILE_DOWNLOAD" ? (
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
