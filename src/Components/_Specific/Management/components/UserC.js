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
  FcFinePrint,
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
import { EventLogMC } from "./EventLogC";

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

  const CustInfoUrl = "/inf_mgnt";
  const CustInfoUrldata = `{"list_inf":{${
    level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
  }}}`;

  // const CustInfoUrl = `/inf_mgnt?list_inf={${
  //   level === "super_super" ? state.Login.Cid : `"cid":"${cid}"`
  // }} `;
  const [CustInfoLoading, CustInfoResponse] = useURLloader(
    CustInfoUrl,
    CustInfoUrldata,
    IsUpdate
  );
  const history = useHistory();

  useEffect(() => {
    if (CustInfoResponse) {
      // console.log(CustInfoUrldata);
      setCustomerList(CustInfoResponse.response);
      // console.log(CustInfoResponse.response);
    }
  }, [CustInfoResponse]);

  const deleteUserInfo = (record) => {
    // console.log(record);
    setUploading(true);
    // const DeleteUrl = `/inf_mgnt?delete_inf={"cid":"${record.cid}"}`;
    // console.log(DeleteUrl);
    const config = {
      method: "post",
      headers: { "Content-Type": "application/json" },
      url: "/inf_mgnt",
      data: JSON.parse(`{"delete_inf":{"cid":"${record.cid}"}}`),
    };

    axios(config)
      .then(() => {
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("Delete successfully.");
        dispatch({
          type: "setIsUpdate",
          payload: { IsUpdate: !state.Global.IsUpdate },
        });
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
            <Tooltip title={Translator("ISMS.EditInformation")}>
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
            {level === "super_super" && (
              <Tooltip title={Translator("ISMS.Scheme")}>
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
            )}
            <Tooltip title={Translator("ISMS.User")}>
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setCreateUservisible(true);
                  setCreateUserRecord(record);
                }}
              >
                <img
                  src={require("../../../../image/customer.png")}
                  className={styles.CreateUserIcon}
                />
              </a>
            </Tooltip>

            <Tooltip title={Translator("ISMS.DeviceGroup")}>
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
            <Tooltip title={Translator("ISMS.DeviceTokenAPIKey")}>
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
            <Tooltip title={Translator("ISMS.Notification")}>
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
            <Tooltip title={Translator("ISMS.EventLog")}>
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
            {level === "super_super" && (
              <Tooltip title={Translator("ISMS.DeleteCustomer")}>
                <Popconfirm
                  title={Translator("ISMS.Suretodelete")}
                  okText={Translator("ISMS.OK")}
                  cancelText={Translator("ISMS.Cancel")}
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
        level={level}
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
        {level === "super_super" && (
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
          />
        </Form>
      </Card>
    </div>
  );
};

export default ManagementC;
