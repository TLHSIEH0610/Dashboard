import React, { useState, useEffect, useContext } from "react";
import {
  message,
  Input,
  Table,
  Form,
  Popconfirm,
  Button,
  InputNumber,
  Tag,
  Tooltip,
  Card,
} from "antd";
import Context from "../../../../Utility/Reduxx";
import styles from "../management.module.scss";
import useURLloader from "../../../../hook/useURLloader";
import axios from "axios";
import { RiEdit2Fill } from "react-icons/ri";
import {
  FcDeleteDatabase,
  FcKey,
  FcViewDetails,
  FcConferenceCall,
  FcSpeaker,
  FcGoodDecision,
} from "react-icons/fc";
import { NotifiModalMC } from "./NotificationC";
import { SchemeModalC } from "./SchemeC";
import { EditGroupModalMC } from "./GroupC";
import { TokenModelC } from "./TokenC";
import {
  CreateInfoModalMC,
  EditUserModalMC,
  CreateUserModalMC,
  EditUserInfoMC,
} from "./UserF";
import { Translator } from "../../../../i18n/index";

const UserC = () => {
  const { state } = useContext(Context);
  const [form] = Form.useForm();
  const cid = localStorage.getItem("authUser.cid");
  const [uploading, setUploading] = useState(false);
  const [Clist, setClist] = useState([]);
  const [CreateVisible, setCreateVisible] = useState(false);
  const [CreateUservisible, setCreateUservisible] = useState(false);
  const [EditVisible, setEditVisible] = useState(false);
  const [GroupList, setGroupList] = useState([]);
  const getGroupUrl =
    cid === "proscend"
      ? `/device_mgnt/group?list_group={${state.Login.Cid}}`
      : `/device_mgnt/group?list_group={"cid":"${cid}"}`;
  const [Grouploading, Groupresponse] = useURLloader(getGroupUrl, uploading);
  const [UserEditRecord, setUserEditRecord] = useState("");
  const [onEditcid, setOnEditcid] = useState("");
  const [NotifiModalvisible, setNotifiModalvisible] = useState(false);
  const [SchemeModalvisible, setSchemeModalvisible] = useState(false);
  const [GroupModalvisible, setGroupModalvisible] = useState(false);
  const [Tokenvisible, setTokenvisible] = useState(false);
  const [EditCustomerInfovisible, setEditCustomerInfovisible] = useState(false);
  const [TokenRecord, setTokenRecord] = useState("");
  const [NotifiRecord, setNotifiRecord] = useState("");
  const [EditGroupRecord, setEditGroupRecord] = useState("");
  const [CreateUserRecord, setCreateUserRecord] = useState("");
  const [SchemeRecord, setSchemeRecord] = useState("");
  const [CustomerInfoRecord, setCustomerInfoRecord] = useState(false);

  const UserList =
    cid === "proscend"
      ? `/user_mgnt?list_user={${state.Login.Cid}}`
      : `/user_mgnt?list_user={"cid":"${cid}"}`;
  const [UserListloading, UserListResponse] = useURLloader(UserList, uploading);
  const CustInfoUrl = `/inf_mgnt?list_inf={} `;
  const [CustInfoLoading, CustInfoResponse] = useURLloader(
    CustInfoUrl,
    uploading
  );

  useEffect(() => {
    if (UserListResponse && CustInfoResponse) {
      let CustomerList = [];
      let Cid= new Set()
      CustInfoResponse.response.forEach((item, index) => {
        UserListResponse.response.forEach((userlist, userlistIndex) => {
          userlist.user_list.forEach((user, userIndex) => {
            user["key"] = userIndex;
          });
          console.log(UserListResponse, CustInfoResponse);
          if (item.cid === userlist.cid && !Cid.has(item.cid)) {
            Cid.add(item.cid)
            CustomerList.push({
              key: index,
              cid: item.cid,
              user_list: userlist.user_list,
              company: item.inf_list.company,
              contact: item.inf_list.contact,
              mail: item.inf_list.mail,
              phone: item.inf_list.phone,
            });
          } else if(item.cid !== userlist.cid && !Cid.has(item.cid)){
            Cid.add(item.cid)
            CustomerList.push({
              key: `${index}_${userlistIndex}`,
              cid: item.cid,
              company: item.inf_list.company,
              contact: item.inf_list.contact,
              mail: item.inf_list.mail,
              phone: item.inf_list.phone,
            });
          }else{
            return
          }
          console.log(CustomerList);
        });
      });
      setClist(CustomerList);
    }
  }, [UserListResponse, CustInfoResponse]);

  useEffect(() => {
    if (Groupresponse) {
      let GroupList = [];
      Groupresponse.response.forEach((item, index) => {
        item.group_list.forEach((group, groupIndex) => {
          group["key"] = groupIndex;
        });
        GroupList.push({
          key: index,
          cid: item.cid,
          group: item.group_list,
        });
      });
      setGroupList(GroupList);
    }
  }, [Groupresponse]);

  // const originData = [];
  // const EditableCell = ({
  //   editing,
  //   dataIndex,
  //   title,
  //   inputType,
  //   record,
  //   index,
  //   children,
  //   ...restProps
  // }) => {
  //   const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
  //   return (
  //     <td {...restProps}>
  //       {editing ? (
  //         <Form.Item
  //           name={dataIndex}
  //           style={{
  //             margin: 0,
  //           }}
  //           rules={[
  //             {
  //               required: true,
  //               message: `Please Input ${title}!`,
  //             },
  //           ]}
  //         >
  //           {inputNode}
  //         </Form.Item>
  //       ) : (
  //         children
  //       )}
  //     </td>
  //   );
  // };

  // const [editingKey, setEditingKey] = useState("");

  // const isEditing = (record) => record.key === editingKey;

  // const edit = (record) => {
  //   form.setFieldsValue({
  //     name: "",
  //     age: "",
  //     address: "",
  //     ...record,
  //   });
  //   setEditingKey(record.key);
  // };

  // const deleteInfo = (record) => {
  //   const DeleteInfoUrl = `/scheme_mgnt?delete_scheme={"cid":"${record.cid}"}`;
  // };

  // const cancel = () => {
  //   setEditingKey("");
  // };

  // const save = async (key) => {
  //   try {
  //     setUploading(true);
  //     const row = await form.validateFields();
  //     const newData = [...Clist];
  //     // console.log(newData,key)
  //     const index = newData.findIndex((item) => key === item.key);
  //     const EditUserInfo = `/inf_mgnt?modify_inf={"cid":"${row.cid}", "inf_list":{"company":"${row.company}", "contact":"${row.contact}", "mail":"${row.mail}", "phone":"${row.phone}"}}`;
  //     console.log(EditUserInfo);
  //     axios
  //       .get(EditUserInfo)
  //       .then((res) => {
  //         console.log(res);
  //         setUploading(false);
  //         // setEditingKey("");
  //         message.success("update successfully.");
  //       })
  //       .catch((error) => {
  //         setUploading(false);
  //         console.log(error);
  //         // setEditingKey("");
  //         message.error("update fail.");
  //       });
  //   } catch (errInfo) {
  //     console.log("Validate Failed:", errInfo);
  //   }
  // };

  const deleteUserInfo = (record) => {
    console.log(record);
    setUploading(true);
    const DeleteUrl = `/inf_mgnt?delete_inf={"cid":"${record.cid}"}`;
    console.log(DeleteUrl);
    axios
      .get(DeleteUrl)
      .then((res) => {
        setUploading(false);
        message.success("Delete successfully.");
        console.log(res);
      })
      .catch((error) => {
        setUploading(false);
        message.error("Delete fail.");
        console.log(error);
      });
  };

  const expandedRowRender = (record, recordindex) => {
    const columns = [
      { title: "Name", dataIndex: ["name"], key: "name", width: "20%" },
      { title: "Level", dataIndex: ["level"], key: "level", width: "20%" },
      {
        title: "Group",
        dataIndex: [["gid"]],
        key: "[gid]",
        width: "15%",
        render: (_, record) => {
          // console.log(record)
          return record.gid.map((item, index) => {
            return (
              <Tag color="default" key={index}>
                {item}
              </Tag>
            );
          });
          // return(
          //   123
          // )
        },
      },
      {
        title: "Action",
        dataIndex: ["action"],
        key: "action",
        width: "20%",
        render: (text, record, index) => {
          return (
            <div>
              <Button
                loading={uploading}
                key={`${index}_${text}`}
                onClick={() => {
                  setEditVisible(true);
                  setUserEditRecord(record);
                  setOnEditcid(Clist[`${recordindex}`].cid);
                }}
              >
                Edit
              </Button>
              <Button
                key={index}
                onClick={() => {
                  setUploading(true);
                  const cid = Clist[`${recordindex}`].cid;
                  const deleteUserUrl = `/user_mgnt?delete_user={"cid":"${cid}", "user_list":[{"name":"${record.name}"}]}`;
                  console.log(deleteUserUrl);
                  axios
                    .get(deleteUserUrl)
                    .then((res) => {
                      console.log(res);
                      setUploading(false);
                      message.success("Delete successfully.");
                    })
                    .catch((error) => {
                      console.log(error);
                      setUploading(false);
                      message.error("Delete fail.");
                    });
                }}
              >
                Delete
              </Button>
            </div>
          );
        },
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={record.user_list}
        pagination={false}
        size={"middle"}
        className={styles.subHeader}
      />
    );
  };

  const columns = [
    // {
    //   title: Translator("ISMS.Customer"),
    //   width: "15%",
    //   dataIndex: "cid",
    //   key: "cid",
    //   editable: true,
    // },
    {
      title: Translator("ISMS.Customer"),
      // width: "10%",
      dataIndex: "company",
      key: "company",
      // editable: true,
    },
    // {
    //   title: Translator("ISMS.Contact"),
    //   width: "15%",
    //   dataIndex: "contact",
    //   key: "contact",
    //   editable: true,
    // },
    // {
    //   title: Translator("ISMS.Email"),
    //   width: "15%",
    //   dataIndex: "mail",
    //   key: "mail",
    //   editable: true,
    // },
    // {
    //   title: Translator("ISMS.Phone"),
    //   width: "15%",
    //   dataIndex: "phone",
    //   key: "phone",
    //   editable: true,
    // },
    {
      title: Translator("ISMS.Operation"),
      dataIndex: "information",
      key: "information",
      render: (_, record) => {
        // const editable = isEditing(record);
        const show =
          localStorage.getItem("authUser.cid") === "proscend" &&
          state.Login.Cid === "";
        // return editable ?
        return (
          //   <span>
          //     <a
          //       href="/#"
          //       onClick={(e) => {
          //         e.preventDefault();
          //         save(record.key);
          //       }}
          //       style={{
          //         marginRight: 8,
          //       }}
          //     >
          //       Save
          //     </a>
          //     <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
          //       <a href="/#">Cancel</a>
          //     </Popconfirm>
          //   </span>
          // ) : (
          <div className={styles.InformationBtnWrapper}>
            <Tooltip title="Information">
              <a
                href="/#"
                // disabled={editingKey !== ""}
                onClick={(e) => {
                  e.preventDefault();
                  // edit(record);
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
                <FcViewDetails className={styles.ViewSchemeIcon} />
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
                {/* <FaUserPlus className={styles.CreateUserIcon} /> */}
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
            {show && (
              <Tooltip title="Delete Customer">
                <Popconfirm
                  title="Sure to Delete?"
                  onConfirm={() => {
                    deleteUserInfo(record);
                  }}
                >
                  <FcDeleteDatabase className={styles.DeleteIcon} />
                </Popconfirm>
              </Tooltip>
            )}
          </div>
        );
      },
    },
  ];

  // const mergedColumns = columns.map((col) => {
  //   if (!col.editable) {
  //     return col;
  //   }

  //   return {
  //     ...col,
  //     onCell: (record) => ({
  //       record,
  //       inputType: col.dataIndex === "age" ? "number" : "text",
  //       dataIndex: col.dataIndex,
  //       title: col.title,
  //       // editing: isEditing(record),
  //     }),
  //   };
  // });

  return (
    <div>
      <CreateUserModalMC
        data={Clist}
        GroupList={GroupList}
        onEditcid={onEditcid}
        record={CreateUserRecord}
        setUploading={setUploading}
        CreateUservisible={CreateUservisible}
        setCreateUservisible={setCreateUservisible}
      />

      <CreateInfoModalMC
        setUploading={setUploading}
        CreateVisible={CreateVisible}
        setCreateVisible={setCreateVisible}
      />

      <EditUserInfoMC
        setUploading={setUploading}
        EditCustomerInfovisible={EditCustomerInfovisible}
        setEditCustomerInfovisible={setEditCustomerInfovisible}
      />

      <EditUserModalMC
        GroupList={GroupList}
        UserEditRecord={UserEditRecord}
        onEditcid={onEditcid}
        setUploading={setUploading}
        uploading={uploading}
        EditVisible={EditVisible}
        setEditVisible={setEditVisible}
      />

      <NotifiModalMC
        NotifiModalvisible={NotifiModalvisible}
        setNotifiModalvisible={setNotifiModalvisible}
        record={NotifiRecord}
      />

      <SchemeModalC
        SchemeModalvisible={SchemeModalvisible}
        setSchemeModalvisible={setSchemeModalvisible}
        record={SchemeRecord}
      />

      {EditGroupRecord && (
        <EditGroupModalMC
          GroupModalvisible={GroupModalvisible}
          setGroupModalvisible={setGroupModalvisible}
          record={EditGroupRecord}
          uploading={uploading}
          setUploading={setUploading}
        />
      )}

      <TokenModelC
        Tokenvisible={Tokenvisible}
        setTokenvisible={setTokenvisible}
        record={TokenRecord}
      />

      <Card>
        {state.Login.Cid === "" && cid === "proscend" && (
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
            loading={CustInfoLoading || UserListloading || uploading}
            columns={columns}
            dataSource={Clist}
            expandable={{ expandedRowRender }}
            // components={{
            //   body: {
            //     cell: EditableCell,
            //   },
            // }}
            // rowClassName="editable-row"
            // pagination={{
            //   onChange: cancel,
            // }}
          />
        </Form>
      </Card>
    </div>
  );
};

export default UserC;
