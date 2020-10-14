import React, { useState, useEffect, useContext } from "react";
import {
  Modal,
  message,
  Input,
  Table,
  Form,
  Popconfirm,
  Button,
  InputNumber,
  Tag,
  Tooltip,
  Card
} from "antd";
import Context from "../../../../Utility/Reduxx";
import styles from "../management.module.scss";
import useURLloader from "../../../../hook/useURLloader";
import axios from "axios";
import { RiEdit2Fill } from "react-icons/ri";
import { FcDeleteDatabase, FcKey, FcViewDetails, FcConferenceCall, FcSpeaker, FcGoodDecision } from "react-icons/fc";
import { NotifiModalC } from './NotificationC'
import { SchemeModalC } from './SchemeC'
import { GroupModalC } from './GroupC'
import { TokenModelC } from './TokenC'
import { CreateInfoForm, EditUserForm, CreateUserForm } from './UserF'


const UserC = () => {
  const { state } = useContext(Context);
  const [form] = Form.useForm();
  const cid = localStorage.getItem("authUser.cid");
  const [Clist, setClist] = useState([]);
  const [CreateVisible, setCreateVisible] = useState(false);
  const [CreateUservisible, setCreateUservisible] = useState(false);
  const [EditVisible, setEditVisible] = useState(false);
  const [GroupList, setGroupList] = useState([]);
  const getGroupUrl =
    cid === "proscend"
      ? `/device_mgnt/group?list_group={${state.Login.Cid}}`
      : `/device_mgnt/group?list_group={"cid":"${cid}"}`;
  const [Grouploading, Groupresponse] = useURLloader(getGroupUrl);
  const [uploading, setUploading] = useState(false);
  const [record, setRecord] = useState("");
  const [UserEditRecord, setUserEditRecord] = useState('')
  const [onEditcid, setOnEditcid] = useState("");
  const [NotifiModalvisible, setNotifiModalvisible] = useState(false)
  const [SchemeModalvisible, setSchemeModalvisible] = useState(false)
  const [GroupModalvisible, setGroupModalvisible] = useState(false)
  const [Tokenvisible, setTokenvisible] = useState(false)
  const [TokenRecord,setTokenRecord] = useState('')
  const [NotifiRecord,setNotifiRecord] = useState('')
  const [EditGroupRecord,setEditGroupRecord] = useState('')
  const [CreateUserRecord,setCreateUserRecord] = useState('')
  const [SchemeRecord,setSchemeRecord] = useState('')
  
       
  const UserList =
    cid === "proscend"
      ? `/user_mgnt?list_user={${state.Login.Cid}}`
      : `/user_mgnt?list_user={"cid":"${cid}"}`;
  const [UserListloading, UserListResponse] = useURLloader(UserList, uploading);
  const CustInfoUrl = `/inf_mgnt?list_inf={} `;
  const [CustInfoLoading, CustInfoResponse] = useURLloader(
    CustInfoUrl, uploading
  );

  useEffect(() => {
    if (UserListResponse && CustInfoResponse) {
      let CustomerList = [];
      UserListResponse.response.forEach((item, index) => {
        item.user_list.forEach((user, userIndex) => {
          user["key"] = userIndex;
        });
        CustInfoResponse.response.forEach((info) => {
          if (item.cid === info.cid) {
            CustomerList.push({
              key: index,
              cid: item.cid,
              user_list: item.user_list,
              company: info.inf_list.company,
              contact: info.inf_list.contact,
              mail: info.inf_list.mail,
              phone: info.inf_list.phone,
            });
          }
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
  const EditableCell = ({
    editing,
    dataIndex,
    title,
    inputType,
    record,
    index,
    children,
    ...restProps
  }) => {
    const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item
            name={dataIndex}
            style={{
              margin: 0,
            }}
            rules={[
              {
                required: true,
                message: `Please Input ${title}!`,
              },
            ]}
          >
            {inputNode}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  const [editingKey, setEditingKey] = useState("");

  const isEditing = (record) => record.key === editingKey;

  const edit = (record) => {
    form.setFieldsValue({
      name: "",
      age: "",
      address: "",
      ...record,
    });
    setEditingKey(record.key);
  };

  // const deleteInfo = (record) => {
  //   const DeleteInfoUrl = `/scheme_mgnt?delete_scheme={"cid":"${record.cid}"}`;
  // };

  const cancel = () => {
    setEditingKey("");
  };

  const save = async (key) => {
    try {
      setUploading(true);
      const row = await form.validateFields();
      const newData = [...Clist];
      // console.log(newData,key)
      const index = newData.findIndex((item) => key === item.key);
      const EditUserInfo = `/inf_mgnt?modify_inf={"cid":"${row.cid}", "inf_list":{"company":"${row.company}", "contact":"${row.contact}", "mail":"${row.mail}", "phone":"${row.phone}"}}`;
      console.log(EditUserInfo);
      axios
        .get(EditUserInfo)
        .then((res) => {
          console.log(res);
          setUploading(false);
          setEditingKey("");
          message.success("update successfully.");
        })
        .catch((error) => {
          setUploading(false);
          console.log(error);
          setEditingKey("");
          message.error("update fail.");
        });

    } catch (errInfo) {
      console.log("Validate Failed:", errInfo);
    }
  };

  const onFinish = (values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    const userlist = JSON.stringify(values.users);
    console.log(userlist);
    const url = `/user_mgnt?create_user={"cid":"${values.cid}", "user_list":${userlist}}`;
    console.log(url);
    axios
      .get(url)
      .then((res) => {
        setUploading(false);
        message.success("Create successfully.");
        console.log(url);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("Create fail.");
      });
  };

  const CreateInfoonFinish = (values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    const url = ` /inf_mgnt?create_inf={"cid":"${values.cid}", "inf_list":{"company":"${values.company}", "contact":"${values.contact}", "mail":"${values.mail}", "phone":"${values.phone}"}}`;
    console.log(url);
    axios
      .get(url)
      .then((res) => {
        setUploading(false);
        message.success("update successfully.");
        console.log(url);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
        message.error("update fail.");
      });
  };



  const deleteUserInfo = (record) => {
    setUploading(true)
    const DeleteUrl = `/inf_mgnt?delete_inf={"cid":"${record.cid}"}`;
    console.log(DeleteUrl);
    axios
      .get(DeleteUrl)
      .then((res) => {
        setUploading(false)
        message.success("Delete successfully.");
        console.log(res);
      })
      .catch((error) => {
        setUploading(false)
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
                  setUploading(true)
                  const cid = Clist[`${recordindex}`].cid
                  const deleteUserUrl = `/user_mgnt?delete_user={"cid":"${cid}", "user_list":[{"name":"${record.name}"}]}`
                  console.log(deleteUserUrl);
                  axios.get(deleteUserUrl).then((res) => {
                    console.log(res);
                    setUploading(false)
                    message.success("Delete successfully.");

                  }).catch((error)=>{
                    console.log(error)
                    setUploading(false)
                    message.error("Delete fail.");
                  })
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
    {
      title: "Customer",
      width: "15%",
      dataIndex: "cid",
      key: "cid",
      editable: true,
    },
    {
      title: "Company",
      width: "10%",
      dataIndex: "company",
      key: "company",
      editable: true,
    },
    {
      title: "Contact",
      width: "15%",
      dataIndex: "contact",
      key: "contact",
      editable: true,
    },
    {
      title: "Email",
      width: "15%",
      dataIndex: "mail",
      key: "mail",
      editable: true,
    },
    {
      title: "Phone",
      width: "15%",
      dataIndex: "phone",
      key: "phone",
      editable: true,
    },
    {
      title: "Operation",
      width: "30%",
      dataIndex: "information",
      key: "information",
      render: (_, record) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            <a
              href="/#"
              onClick={(e) => {
                e.preventDefault();
                save(record.key);
              }}
              style={{
                marginRight: 8,
              }}
            >
              Save
            </a>
            <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
              <a href="/#">Cancel</a>
            </Popconfirm>
          </span>
        ) : (
          <div className={styles.InformationBtnWrapper}>
            <Tooltip title="Edit Info">
              <a
              href="/#"
                disabled={editingKey !== ""}
                onClick={(e) => {
                  e.preventDefault();
                  edit(record);
                }}
              >
                <RiEdit2Fill className={styles.EditIcon} />
              </a>
            </Tooltip>
            <Tooltip title="Delete Info">
            <Popconfirm title="Sure to Delete?" onConfirm={()=>{deleteUserInfo(record);}}>
                <FcDeleteDatabase className={styles.DeleteIcon} />
              </Popconfirm>
            </Tooltip>
            <Tooltip title="Create User">
              <a
              href="/#"
                onClick={(e) => {
                
                  e.preventDefault();
                  setCreateUservisible(true);
                  setCreateUserRecord(record)
                }}
              >
                {/* <FaUserPlus className={styles.CreateUserIcon} /> */}
                <FcGoodDecision className={styles.CreateUserIcon}/>
              </a>
            </Tooltip>
            

            <Tooltip title="Edit Group">
              <a
              href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setEditGroupRecord(record)
                  setGroupModalvisible(true)
                }}
              >
                <FcConferenceCall className={styles.EditGroupIcon} />
              </a>
            </Tooltip>
            <Tooltip title="Notification">
              <a
              href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setNotifiRecord(record)
                  setNotifiModalvisible(true)
                }}
              >
                <FcSpeaker className={styles.NotificationIcon} />
              </a>
            </Tooltip>
            
            <Tooltip title="Token">
              <a
              href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setTokenRecord(record)
                  setTokenvisible(true)
                }}
              >
                <FcKey className={styles.TokenIcon} />
              </a>
            </Tooltip>
            <Tooltip title="View Scheme">
              <a
              href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  setSchemeRecord(record)
                  setSchemeModalvisible(true)
                }}
              >
                <FcViewDetails className={styles.ViewSchemeIcon} />
              </a>
            </Tooltip>
            
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }

    return {
      ...col,
      onCell: (record) => ({
        record,
        inputType: col.dataIndex === "age" ? "number" : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

      
  return (
    <div>
      <Modal
        title="Create User Account"
        visible={CreateUservisible}
        onOk={() => setCreateUservisible(false)}
        onCancel={() => setCreateUservisible(false)}
        okButtonProps={{
          form: "CreateUser",
          key: "submit",
          htmlType: "submit",
        }}
        okText="Create"
        cancelText="Cancel"
        width='60%'
        destroyOnClose={true}
      >
        <CreateUserForm
          data={Clist}
          GroupList={GroupList}
          onFinish={onFinish}
          onEditcid={onEditcid}
          record={CreateUserRecord}
        />
      </Modal>
      <div className={styles.NewUserBtnWrapper}>
        {state.Login.Cid === "" && cid === "proscend" && (
          <Button
            type="primary"
            onClick={() => setCreateVisible(true)}
            className={styles.NewUserInfoBtn}
            loading= {uploading}
          >
            New User Info
          </Button>
        )}
      </div>

      <Modal
        title="Create User Infomation"
        visible={CreateVisible}
        onOk={() => setCreateVisible(false)}
        onCancel={() => setCreateVisible(false)}
        okButtonProps={{
          form: "CreateInfo",
          key: "submit",
          htmlType: "submit",
        }}
        okText="Create"
        cancelText="Cancel"
      >
        <CreateInfoForm onFinish={CreateInfoonFinish} />
      </Modal>

      <Modal
        title="EditUser"
        visible={EditVisible}
        onOk={() => setEditVisible(false)}
        okButtonProps={{ form: "EditUser", key: "submit", htmlType: "submit" }}
        onCancel={() => setEditVisible(false)}
        okText="Submit"
        cancelText="Cancel"
        destroyOnClose={true}
      >
        <EditUserForm
          GroupList={GroupList}
          UserEditRecord={UserEditRecord}
          onEditcid={onEditcid}
          setUploading={setUploading}
        />
      </Modal>

      <NotifiModalC NotifiModalvisible={NotifiModalvisible} setNotifiModalvisible={setNotifiModalvisible} record={NotifiRecord}/>

      <SchemeModalC SchemeModalvisible={SchemeModalvisible} setSchemeModalvisible={setSchemeModalvisible} record={SchemeRecord}/>

      {EditGroupRecord && <GroupModalC GroupModalvisible={GroupModalvisible} setGroupModalvisible={setGroupModalvisible} record={EditGroupRecord}/>}

      <TokenModelC Tokenvisible={Tokenvisible} setTokenvisible={setTokenvisible} record={TokenRecord}/>
      <Card loading={uploading}>
      <Form form={form} component={false}>
        <Table
          loading={CustInfoLoading}
          columns={mergedColumns}
          dataSource={Clist}
          expandable={{ expandedRowRender }}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          rowClassName="editable-row"
          pagination={{
            onChange: cancel,
          }}
        />
      </Form>
      </Card> 
    </div>
  );
};

export default UserC;
   
// /user_mgnt?create_user={"cid":"12345678901234567890123456789011", "user_list":[{"name":"a1@a1.com", "password":"a1", "level":"super", "gid":[]}, {"name":"a2@a2.com","password":"a2", "level":"admin", "gid":["g1"]}, {"name":"a3@a3.com","password":"a3", "level":"get", "gid":["g2"]}]}
// /user_mgnt?modify_user={"cid":"12345678901234567890123456789011", "user_list":[{"name":"a1@a1.com", "password":"a11", "level":"super", "gid":[]}, {"name":"a2@a2.com","password":"a2", "level":"set", "gid":["g2"]}]}
// /user_mgnt?delete_user={"cid":"12345678901234567890123456789011", "user_list":[{"name":"a2@a2.com"}, {"name":"a3@a3.com"}]}
// /user_mgnt?list_user={} # {"response": {"cid":"12345678901234567890123456789011", "user_list":[{"name":"a1@a1.com", "level":"super", "gid":[]}]}}

// /inf_mgnt?create_inf={"cid":"12345678901234567890123456789011", "inf_list":{"company":"customer_1", "contact":"abc", "mail":"c1@company.com", "phone":"123456789012345"}}
// /inf_mgnt?modify_inf={"cid":"12345678901234567890123456789011", "inf_list":{"company":"customer_1", "contact":"abc", "mail":"c1@company.com", "phone":"123456789012345"}}
// /inf_mgnt?delete_inf={"cid":"12345678901234567890123456789011"}
//   # {"response": [{"cid":"12345678901234567890123456789011", "inf_list": {"company":"customer_1", "contact":"abc", "mail":"c1@company.com", "phone":"123456789012345"}}, {"cid":"12345678901234567890123456789022", "inf_list": {"company":"customer_2", "contact":"def", "mail":"c2@company.com", "phone":"123456789012345"}}]}

// /scheme_mgnt?create_scheme={"cid":"12345678901234567890123456789011","user":10,"group":10,"device":1024,"expire":null,"tracking":100,"tracking_pool":10000000,"iot":10,"iot_poor":10000000}
// /scheme_mgnt?modify_scheme={"cid":"12345678901234567890123456789011","user":10,"group":10,"device":1024,"expire":null,"tracking":100,"tracking_pool":10000000,"iot":10,"iot_poor":10000000}
// /scheme_mgnt?delete_scheme={"cid":"12345678901234567890123456789011"}
// /scheme_mgnt?list_scheme={}  # {"response": [{"cid": "proscend_2", "user": 10, "group": 10, "device": 1024, "expiry": 1640966399, "tracking": 100, "tracking_pool": 10000000, "iot": 10, "iot_poor": 10000000, "users": 10, "groups": 10, "devices": 1024, "expires": 467, "trackings": 100, "tracking_pools": 10000000, "iots": 10, "iot_poors": 10000000}]}


