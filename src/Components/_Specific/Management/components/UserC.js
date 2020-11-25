import React, { useState, useEffect, useContext } from "react";
import { message, Table, Form, Popconfirm, Button, Tooltip, Card } from "antd";
import Context from "../../../../Utility/Reduxx";
import styles from "../management.module.scss";
import useURLloader from "../../../../hook/useURLloader";
import axios from "axios";
import { RiEdit2Fill } from "react-icons/ri";
import {
  FcKey,
  FcTimeline,
  FcConferenceCall,
  FcSpeaker,
  FcGoodDecision,
  FcFinePrint
} from "react-icons/fc";
import { NotifiModalMC } from "./NotificationC";
import { SchemeModalC } from "./SchemeC";
import { EditGroupModalMC } from "./GroupC";
import { TokenModelC } from "./TokenC";
import { CreateInfoModalMC, UserModalMC, EditCustomerInfoMC } from "./UserF";
import { Translator } from "../../../../i18n/index";
import { ImCross } from "react-icons/im";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import { EventLogMC } from './EventLogC'


const ManagementC = () => {
  const { state, dispatch } = useContext(Context);
  const [form] = Form.useForm();
  const [IsUpdate, setIsUpdate] = useState(false);
  const cid = localStorage.getItem("authUser.cid");
  const level = localStorage.getItem("authUser.level");
  const [uploading, setUploading] = useState(false);
  const [CustomerList, setCustomerList] = useState([]);
  const [CreateVisible, setCreateVisible] = useState(false);
  const [CreateUservisible, setCreateUservisible] = useState(false);
  const [NotifiModalvisible, setNotifiModalvisible] = useState(false);
  const [SchemeModalvisible, setSchemeModalvisible] = useState(false);
  const [EventLogModalvisible, setEventLogModalvisible] = useState(false);
  const [GroupModalvisible, setGroupModalvisible] = useState(false);
  const [Tokenvisible, setTokenvisible] = useState(false);
  const [EditCustomerInfovisible, setEditCustomerInfovisible] = useState(false);
  const [TokenRecord, setTokenRecord] = useState("");
  const [NotifiRecord, setNotifiRecord] = useState("");
  const [EditGroupRecord, setEditGroupRecord] = useState("");
  const [CreateUserRecord, setCreateUserRecord] = useState("");
  const [SchemeRecord, setSchemeRecord] = useState("");
  const [EventLogRecord, setEventLogRecord] = useState("");
  const [CustomerInfoRecord, setCustomerInfoRecord] = useState(false);
  const show = localStorage.getItem("authUser.level") === "super_super";
  const CustInfoUrl = `/inf_mgnt?list_inf={${
    level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
  }} `;
  const [CustInfoLoading, CustInfoResponse] = useURLloader(
    CustInfoUrl,
    IsUpdate
  );
  const history = useHistory();

  useEffect(() => {
    if (CustInfoResponse) {
      setCustomerList(CustInfoResponse.response);
    }
  }, [CustInfoResponse]);

  const deleteUserInfo = (record) => {
    // console.log(record);
    setUploading(true);
    const DeleteUrl = `/inf_mgnt?delete_inf={"cid":"${record.cid}"}`;
    console.log(DeleteUrl);
    axios
      .post(DeleteUrl)
      .then(() => {
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("Delete successfully.");
        dispatch({ type: "setIsUpdate", payload: { IsUpdate: !state.Global.IsUpdate } });
        // console.log(res);
      })
      .catch((error) => {
        setUploading(false);
        message.error("Delete fail.");
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
      });
  };

  const columns = [
    {
      title: Translator("ISMS.Customer"),
      dataIndex: ["inf_list", "company"],
      key: "company",
    },
    {
      title: Translator("ISMS.Operation"),
      dataIndex: "information",
      key: "information",
      render: (_, record) => {
        return (
          <div className={styles.InformationBtnWrapper}>
            <Tooltip title="Information">
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setCustomerInfoRecord(record);
                  setEditCustomerInfovisible(true);
                }}
              >
                <RiEdit2Fill className={styles.EditIcon} />
              </a>
            </Tooltip>
            <Tooltip title="Scheme">
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setSchemeRecord(record);
                  setSchemeModalvisible(true);
                }}
              >
                <FcTimeline className={styles.ViewSchemeIcon} />
              </a>
            </Tooltip>
            <Tooltip title="User">
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setCreateUservisible(true);
                  setCreateUserRecord(record);
                }}
              >
                <FcGoodDecision className={styles.CreateUserIcon} />
              </a>
            </Tooltip>

            <Tooltip title="Device Group">
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setEditGroupRecord(record);
                  setGroupModalvisible(true);
                }}
              >
                <FcConferenceCall className={styles.EditGroupIcon} />
              </a>
            </Tooltip>
            <Tooltip title="Device Token">
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setTokenRecord(record);
                  setTokenvisible(true);
                }}
              >
                <FcKey className={styles.TokenIcon} />
              </a>
            </Tooltip>
            <Tooltip title="Notification">
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setNotifiRecord(record);
                  setNotifiModalvisible(true);
                }}
              >
                <FcSpeaker className={styles.NotificationIcon} />
              </a>
            </Tooltip>
            <Tooltip title="Event Log">
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setEventLogRecord(record);
                  setEventLogModalvisible(true);
                }}
              >
                <FcFinePrint className={styles.ViewSchemeIcon} />
              </a>
            </Tooltip>
            {show && state.Login.Cid === "" && (
              <Tooltip title="Delete Customer">
                <Popconfirm
                  title="Sure to Delete?"
                  onConfirm={() => {
                    deleteUserInfo(record);
                  }}
                >
                  <ImCross className={styles.DeleteIcon} />
                </Popconfirm>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <CreateInfoModalMC
        CreateVisible={CreateVisible}
        setCreateVisible={setCreateVisible}
        setIsUpdate={setIsUpdate}
        IsUpdate={IsUpdate}
      />

      <EditCustomerInfoMC
        EditCustomerInfovisible={EditCustomerInfovisible}
        setEditCustomerInfovisible={setEditCustomerInfovisible}
        record={CustomerInfoRecord}
        setRecord={setCustomerInfoRecord}
        setIsUpdate={setIsUpdate}
        IsUpdate={IsUpdate}
      />

      <SchemeModalC
        SchemeModalvisible={SchemeModalvisible}
        setSchemeModalvisible={setSchemeModalvisible}
        record={SchemeRecord}
        setRecord={setSchemeRecord}
      />

      <UserModalMC
        record={CreateUserRecord}
        setRecord={setCreateUserRecord}
        CreateUservisible={CreateUservisible}
        setCreateUservisible={setCreateUservisible}
      />

      <EditGroupModalMC
        GroupModalvisible={GroupModalvisible}
        setGroupModalvisible={setGroupModalvisible}
        record={EditGroupRecord}
        setRecord={setEditGroupRecord}
      />

      <TokenModelC
        Tokenvisible={Tokenvisible}
        setTokenvisible={setTokenvisible}
        record={TokenRecord}
        setRecord={setTokenRecord}
      />

      <NotifiModalMC
        NotifiModalvisible={NotifiModalvisible}
        setNotifiModalvisible={setNotifiModalvisible}
        record={NotifiRecord}
        setRecord={setNotifiRecord}
      />

      <EventLogMC
        EventLogModalvisible={EventLogModalvisible}
        setEventLogModalvisible={setEventLogModalvisible}
        record={EventLogRecord}
        setRecord={setEventLogRecord}
      />


      <Card>
        {show && (
          <Button
            type="primary"
            onClick={() => setCreateVisible(true)}
            className={styles.NewUserInfoBtn}
            loading={uploading}
          >
            {Translator("ISMS.Create Customer")}
          </Button>
        )}

        <Form form={form} component={false}>
          <Table
            className={styles.UserInfoTable}
            loading={CustInfoLoading || uploading}
            columns={columns}
            dataSource={CustomerList}
            rowKey={(record) => record.cid}
            // expandable={{ expandedRowRender }}
          />
        </Form>
      </Card>
    </div>
  );
};

export default ManagementC;
