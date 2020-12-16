import React, { useEffect, useState, Fragment, useContext } from "react";
import {
  Modal,
  Descriptions,
  Form,
  Input,
  message,
  Button,
  Spin,
  Alert,
  Popconfirm,
  Tooltip
} from "antd";
import styles from "../management.module.scss";
import axios from "axios";
// import { Translator } from "../../../../i18n/index";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { ImCross } from "react-icons/im";

export const TokenModelC = ({
  Tokenvisible,
  setTokenvisible,
  record,
  setRecord,
}) => {
  const [form] = Form.useForm();
  const [TokenList, setTokenList] = useState([]);
  const [Editable, setEditable] = useState(false);
  const level = localStorage.getItem("authUser.level");
  const [uploading, setUploading] = useState(false);
  const [IsUpdate, setIsUpdate] = useState(false);
  const history = useHistory();
  const { state, dispatch } = useContext(Context);

  useEffect(() => {
    if (record.cid) {
      setUploading(true);
      // const GetTokenUrl = `/device_mgnt/token?list_token={"cid":"${record.cid}"}`;
      const config = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        url: '/device_mgnt/token',
        data: JSON.parse(`{"list_token":{"cid":"${record.cid}"}}`),
      }
      axios
        (config)
        .then((res) => {
          setTokenList(res.data.response[0].token_list);
          form.setFieldsValue({ token: res.data.response[0].token_list });
          setUploading(false);
        })
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            dispatch({ type: "setLogin", payload: { IsLogin: false } });
            UserLogOut();
            history.push("/userlogin");
          }
          console.log(error);
          setUploading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.cid, IsUpdate]);

  const TokenOnFinish = (values) => {
    console.log(values);
    setUploading(true);
    let token_list = "";
    for (let i = 0; i < values.token.length; i++) {
      if (values.token[i] !== undefined) {
        token_list += `{"old_token":"${TokenList[i]}","new_token":"${values.token[i]}"},`;
      }
    }
    // const ModifyTokeUrl = `/device_mgnt/token?modify_token={"cid":"${
    //   record.cid
    // }", "token_list":[${token_list.substring(0, token_list.length - 1)}]}`;

    const config = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      url: '/device_mgnt/token',
      data: JSON.parse(`{"modify_token":{"cid":"${
        record.cid
      }", "token_list":[${token_list.substring(0, token_list.length - 1)}]}}`),
    }


    axios(config)
      .then((res) => {
        console.log(res);
        setUploading(false);
        message.success("modify successfully");
        form.resetFields();
        // setTokenvisible(false);
        setEditable(false);
        setIsUpdate(!IsUpdate);
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
        setUploading(false);
        message.success("modify fail");
        form.resetFields();
        setEditable(false);
      });
  };

  const CreateToken = async () => {
    setUploading(true);
    // const generateTokenUrl = `/device_mgnt/token?generate_token={}`;
    let newToken;
    const config1 = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      url: '/device_mgnt/token',
      data: JSON.parse(`{"generate_token":{}}`),
    }   
    await axios(config1).then((res) => {
      newToken = res.data.response.token;
    });
    const config2 = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      url: '/device_mgnt/token',
      data: JSON.parse(`{"create_token":{"cid":"${record.cid}", "token_list":["${newToken}"]}}`),
    }
    axios(config2)
      .then((resu) => {
        console.log(resu);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("Create successfully");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
        setUploading(false);
        message.error("Create fail");
      });
  };

  const DeleteToken = (item) => {
    setUploading(true);
    // const deleteTokenUrl = `/device_mgnt/token?delete_token={"cid":"${record.cid}", "token_list":["${item}"]}`;
    const config = {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      url: '/device_mgnt/token',
      data: JSON.parse(`{"delete_token":{"cid":"${record.cid}", "token_list":["${item}"]}}`),
    }
    axios(config)
      .then((resu) => {
        console.log(resu);
        setUploading(false);
        setIsUpdate(!IsUpdate);
        message.success("Delete successfully");
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");
        }
        console.log(error);
        setUploading(false);
        message.error("Delete fail");
      });
  };

  return (
    <Modal
      visible={Tokenvisible}
      // onOk={() => setTokenvisible(false)}
      onCancel={() => {
        setTokenvisible(false);
        setRecord({ cid: null });
        setEditable(false);
      }}
      centered={true}
      className={styles.modal}
      destroyOnClose={true}
      title="Token"
      footer={[
        level === "super_super" && Editable && (
          <Button
            key="Submit"
            loading={uploading}
            onClick={() => {
              form.submit();
            }}
          >
            Submit
          </Button>
        ),
        !Editable && (
          <Button
            key="Confirm"
            type="primary"
            loading={uploading}
            onClick={() => {
              setTokenvisible(false);
            }}
          >
            Confirm
          </Button>
        ),
      ]}
    >
      {!uploading ? (
        <Fragment>
          {level === "super_super" && state.Login.Cid === "" && (
            <Fragment key="123">
              {
                <Button
                  key="Edit"
                  loading={uploading}
                  onClick={() => {
                    setEditable(!Editable);
                  }}
                  style={{ marginRight: "5px", marginBottom: "10px" }}
                  disabled={!TokenList.length}
                >
                  Edit
                </Button>
              }
              {!Editable && (
                <Button
                  key="Create"
                  loading={uploading}
                  onClick={() => {
                    CreateToken();
                  }}
                >
                  Create
                </Button>
              )}
            </Fragment>
          )}
          <Form onFinish={TokenOnFinish} form={form}>
            <Descriptions bordered className={styles.desc}>
              <Descriptions.Item label="Token">
                {TokenList.map((item, index) => {
                  return Editable ? (
                    <Form.Item name={["token", index]} key={index}>
                      <Input />
                    </Form.Item>
                  ) : (
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      key={index}
                    >
                      <p key={index}>{item}</p>
                      {level === "super_super" && state.Login.Cid === "" && (
                        <Tooltip title="Delete Token">
                          <Popconfirm
                            title="Sure to Delete?"
                            onConfirm={() => {
                              DeleteToken(item);
                            }}
                          >
                            <ImCross className={styles.trashIcon} />
                          </Popconfirm>
                        </Tooltip>
                      )}
                    </div>
                  );
                })}
                <br />
              </Descriptions.Item>
            </Descriptions>
          </Form>
        </Fragment>
      ) : (
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
      )}
    </Modal>
  );
};

// const layout = {
//   labelCol: { span: 8 },
//   wrapperCol: { span: 16 },
// };

// const EditTokenForm = ({
//   record,
//   EdieTokenvisible,
//   setEdieTokenvisible,
//   uploading,
//   setUploading,
// }) => {
//   const [form] = Form.useForm();

//   useEffect(() => {
//     form.setFieldsValue({
//       token_list: record.token_list,
//     });
//   }, [record]);

//   const columns = [
//     {
//       title: "Token",
//       dataIndex: "token_list",
//       key: "token_list",
//       width: "20%",
//       render: (_, EditTokenRecord, index) => {
//         return (
//           <Form.Item name={["token_list", index]} className={styles.EditTokenFormItem}>
//             <Input disabled/>
//           </Form.Item>
//         );
//       },
//     },
//     {
//       title: "Rename",
//       dataIndex: "rename",
//       key: "rename",
//       width: "20%",
//       render: (_, EditTokenRecord, index) => {
//         return (
//           <Form.Item name={["rename", index]} className={styles.EditTokenFormItem}>
//             <Input />
//           </Form.Item>
//         );
//       },
//     },
//     {
//       title: "Delete",
//       dataIndex: "delete",
//       key: "delete",
//       width: "20%",
//       render: (_, EditTokenRecord) => {
//         return (
//           <Tooltip title="Delete Token">
//             <Popconfirm
//               title="Sure to Delete?"
//               onConfirm={() => {
//                 deleteToken(EditTokenRecord);
//                 setEdieTokenvisible(false);
//               }}
//             >
//               <FcDeleteDatabase className={styles.DeleteIcon} />
//             </Popconfirm>
//           </Tooltip>
//         );
//       },
//     },
//   ];

//   const ModifyTokenonFinish = (values) => {
//     console.log(values);
//     setUploading(true);
//     let token_list = "";
//     for (let i = 0; i < values.token_list.length; i++) {
//       if (values.rename[i] !== undefined) {
//         token_list += `{"old_token":"${values.token_list[i]}","new_token":"${values.rename[i]}"},`;
//       }
//     }
//     const ModifyTokeUrl = `/device_mgnt/token?modify_token={"cid":"${
//       record.cid
//     }", "token_list":[${token_list.substring(0, token_list.length - 1)}]}`;
//     axios
//       .get(ModifyTokeUrl)
//       .then((res) => {
//         console.log(res);
//         setUploading(false);
//         message.success("modify successfully");
//         form.resetFields(['rename'])
//         setEdieTokenvisible(false);
//       })
//       .catch((error) => {
//         console.log(error);
//         setUploading(false);
//         message.success("modify fail");
//         form.resetFields(['rename'])
//       });
//   };

//   const deleteToken = (EditTokenRecord) => {
//     setUploading(true);
//     console.log(EditTokenRecord);
//     const deleteTokenUrl = `/device_mgnt/token?delete_token={"cid":"${record.cid}", "token_list":["${EditTokenRecord}"]}`;
//     axios
//       .get(deleteTokenUrl)
//       .then((res) => {
//         console.log(res);
//         setUploading(false);
//         message.success("delete successfully");
//       })
//       .catch((error) => {
//         console.log(error);
//         setUploading(false);
//         message.error("delete fail");
//       });
//   };

//   return (
//     <Modal
//       title="Edit Token"
//       visible={EdieTokenvisible}
//       onCancel={() => {setEdieTokenvisible(false);}}
//       okButtonProps={{
//         form: "EditToken",
//         key: "submit",
//         htmlType: "submit",
//       }}
//       W
//       className={styles.modal}
//       destroyOnClose={true}
//       footer={[
//         <Button
//           key="submit"
//           type="primary"
//           loading={uploading}
//           onClick={() => {
//             form.submit();
//           }}
//         >
//            {Translator("ISMS.Submit")}
//         </Button>,
//       ]}
//     >
//       <Form
//         {...layout}
//         name="TokenForm"
//         autoComplete="off"
//         onFinish={ModifyTokenonFinish}
//         // onFinishFailed={onFinishFailed}
//         form={form}
//       >
//         <Table
//           columns={columns}
//           dataSource={record.token_list}
//           pagination={false}
//           loading={uploading}
//           rowKey={(record) => record}
//         />
//       </Form>
//     </Modal>
//   );
// };

// export const TokenManagementC = () => {
//   const [uploading, setUploading] = useState(false);
//   const TokenUrl = `/device_mgnt/token?list_token={}`;
//   const [TokenLoading, TokenResponse] = useURLloader(TokenUrl, uploading);
//   const [TokenList, setTokenList] = useState([]);
//   const [record, setRecord] = useState("");
//   const [EdieTokenvisible, setEdieTokenvisible] = useState(false);

//   useEffect(() => {
//     if (TokenResponse) {
//       let TokenList = [];
//       TokenResponse.response.forEach((item, index) => {
//         TokenList.push({
//           key: index,
//           cid: item.cid,
//           token_list: item.token_list,
//         });
//       });
//       // console.log(TokenList);
//       setTokenList(TokenList);
//     }
//   }, [TokenResponse]);

//   async function CreateToken(TokenTablerecord) {
//     setUploading(true);
//     const generateTokenUrl = `/device_mgnt/token?generate_token={}`;
//     let newToken;

//     await axios.get(generateTokenUrl).then((res) => {
//       newToken = res.data.response.token;
//     });
//     axios
//       .get(
//         `/device_mgnt/token?create_token={"cid":"${TokenTablerecord.cid}", "token_list":["${newToken}"]}`
//       )
//       .then((resu) => {
//         console.log(resu);
//         setUploading(false);
//         message.success("Create successfully");
//       })
//       .catch((error) => {
//         console.log(error);
//         setUploading(false);
//         message.error("Create fail");
//       });
//   }

//   const columns = [
//     { title: Translator("ISMS.Customer"), dataIndex: "cid", key: "cid", width: "20%" },
//     {
//       title: Translator("ISMS.TokenList"),
//       dataIndex: "token_list",
//       key: "token_list",
//       width: "20%",
//       render: (_, TokenTablerecord) => {
//         // console.log(TokenTablerecord)
//         return TokenTablerecord.token_list.map((item, index) => {
//           return (
//             <Tag color="default" key={index}>
//               {item}
//             </Tag>
//           );
//         });
//       },
//     },
//     {
//       title: Translator("ISMS.Action"),
//       dataIndex: "action",
//       key: "action",
//       width: "20%",
//       render: (_, TokenTablerecord) => {
//         // setRecord(record)
//         return (
//           <div className={styles.InformationBtnWrapper}>
//             <Tooltip title="Edit Token">
//               <a
//                 href="/#"
//                 disabled={TokenList.length === 0}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   setEdieTokenvisible(true);
//                   setRecord(TokenTablerecord);
//                 }}
//               >
//                 <RiEdit2Fill className={styles.EditIcon} />
//               </a>
//             </Tooltip>
//             <Tooltip title="Create Token">
//               <Popconfirm
//                 title="Sure to add a token?"
//                 onConfirm={() => {
//                   CreateToken(TokenTablerecord);
//                 }}
//               >
//                 <a
//                   href="/#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                   }}
//                 >
//                   <FcAddDatabase className={styles.CreateUserIcon} />
//                 </a>
//               </Popconfirm>
//             </Tooltip>
//           </div>
//         );
//       },
//     },
//   ];

//   return (
//     <div>
//       <EditTokenForm
//         TokenList={TokenList}
//         EdieTokenvisible={EdieTokenvisible}
//         setEdieTokenvisible={setEdieTokenvisible}
//         // onFinish={onFinish}
//         // onEditcid={onEditcid}
//         uploading={uploading}
//         setUploading={setUploading}
//         record={record}
//       />
//       <Card>
//         <Table
//           columns={columns}
//           dataSource={TokenList}
//           pagination={false}
//           loading={TokenLoading || uploading}
//           style={{ overflowX: "auto" }}
//         />
//       </Card>
//     </div>
//   );
// };
