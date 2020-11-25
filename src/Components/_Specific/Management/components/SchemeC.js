import React, { Fragment, useEffect, useState, useContext } from "react";
import {
  Form,
  Descriptions,
  Modal,
  Button,
  message,
  Input,
  Spin,
  Alert,
} from "antd";
import styles from "../management.module.scss";
import axios from "axios";
import { UserLogOut } from '../../../../Utility/Fetch'
import { useHistory } from 'react-router-dom'
import Context from "../../../../Utility/Reduxx";


export const SchemeModalC = ({
  SchemeModalvisible,
  setSchemeModalvisible,
  record,
  setRecord
}) => {
  const [form] = Form.useForm();
  const [SchemeData, setSchemeData] = useState({});
  const [Editable, setEditable] = useState(false);
  const level = localStorage.getItem("authUser.level");
  const [IsCreate, setIsCreate] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [IsUpdate, setIsUpdate] = useState(false)
  const history = useHistory()
  const { state, dispatch } = useContext(Context);
  useEffect(() => {

    if(record.cid){
      setUploading(true)
      const SchemeUrl = `/scheme_mgnt?list_scheme={"cid":"${record.cid}"}`;
      axios
      .post(SchemeUrl)
      .then((res) => {
        let SchemeData = res.data.response[0].scheme_list;
        let expire = new Date(SchemeData.expire * 1000);
        SchemeData.expire = `${expire.getFullYear()}-${
          expire.getMonth() + 1
        }-${expire.getDate()}`;
  
        let expires = new Date(SchemeData.expires * 1000);
        SchemeData.expires = `${expires.getFullYear()}-${
          expires.getMonth() + 1
        }-${expires.getDate()}`;
        setSchemeData(SchemeData);
        // console.log(SchemeData)
        form.setFieldsValue({
          user:SchemeData.user,
          device:SchemeData.device,
          group:SchemeData.group,
          iot:SchemeData.iot,
          iot_poor:SchemeData.iot_poor,
          tracking:SchemeData.tracking,
          tracking_pool:SchemeData.tracking_pool,
          period_alive:SchemeData.period_alive,
          period_status:SchemeData.period_status,
          period_iot:SchemeData.period_iot,
          period_gps:SchemeData.period_gps,
          alive_timeout:SchemeData.alive_timeout,
          expire:SchemeData.expire,
        })
        setUploading(false);
      })
      .catch((error) => {
        console.log(error);
        setUploading(false)
      });

    }
// eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.cid, IsUpdate]);

  const EditSchemeOnFinish = (values) =>{
    setUploading(true);

    function EditSchemeUrl() {
      return axios.post(
        `scheme_mgnt?${IsCreate? 'create' : 'modify'}_scheme={"cid":"${record.cid}","scheme_list":{"user":${values.user},"group":${values.group},"device":${values.device},"expire":${Date.parse(values.expire)/1000},"tracking":${values.tracking},"tracking_pool":${values.tracking_pool},"iot":${values.iot},"iot_poor":${values.iot_poor},"period_alive":${values.period_alive},"alive_timeout":${values.alive_timeout},"period_status":${values.period_status},"period_gps":${values.period_gps},"period_iot":${values.period_iot}}}`
      );
    }
    function setAllScheme() {
      return axios.post(`/cmd?set={"device_cfg":{"filter":{"cid":"${record.cid}"},"obj":{"report_period":{"alive":${values.period_alive},"timeout":${values.alive_timeout},
      "status":${values.period_status},"iot":${values.period_iot},"gps":${values.period_gps}}}}}`);
    }
    axios
      .post([EditSchemeUrl(), setAllScheme()])
      .then(
        axios.spread(() => {
          setUploading(false);
          message.success("update successfully.");
          setIsCreate(false)
          setEditable(false)
          setIsUpdate(!IsUpdate)
        })
      )
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");                                                                         
        } 
        setUploading(false);
        console.log(error);
        message.error("update fail.");
        setIsCreate(false)
        setEditable(false)
        form.resetFields()
      });
  }
  

  return (
    <Modal
      visible={SchemeModalvisible}
      // onOk={() => setSchemeModalvisible(false)}
      onCancel={() => {setSchemeModalvisible(false); setIsCreate(false);setRecord({cid:null});setEditable(false);form.resetFields() }}
      centered={true}
      className={styles.modal}
      title="Scheme"
      destroyOnClose={true}
      footer={[
        (level === "super_super" && Editable) &&
             (<Button
              key='Submit'
              loading={uploading}
              onClick={() => {
                form.submit();
              }}
            >
              Submit
            </Button>)
            ,
          !Editable && <Button
            key="Confirm"
            type="primary"
            loading={uploading}
            onClick={() => {
              setSchemeModalvisible(false);
            }}
          >
            Confirm
          </Button>
      ]}
    >
      {uploading ? (
        <Spin tip="Loading...">
          <Alert
            message="Getting Data"
            description="We are now getting data from server, please wait for a few seconds"
          />
        </Spin>
      ) : (
        SchemeData && (
          <Fragment>
            {(level === "super_super" && state.Login.Cid==='') &&
            <Fragment>
              {SchemeData.user!=='' && <Button
                key='Edit'
                loading={uploading}
                onClick={() => {
                  setEditable(!Editable);
                }}
                style={{marginRight:'5px',marginBottom:'10px'}}
              >
                Edit
              </Button>}
              {SchemeData.user==='' && <Button
                key='Create'
                loading={ uploading }
                onClick={() => {
                  setEditable(!Editable);
                  setIsCreate(true)
                }}
                style={{marginRight:'5px',marginBottom:'10px'}}
              >
                Create
              </Button>}
            </Fragment>
              }
          <Form onFinish={EditSchemeOnFinish} form={form}>
            <Descriptions
              bordered
              className={styles.desc}
              column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}
            >
              <Descriptions.Item key='user' label="user">
              {Editable ? (
                  <Form.Item name={"user"}  rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.user
                )}
                / {SchemeData.users}
              </Descriptions.Item>
              <Descriptions.Item key='device' label="device">
                {Editable ? (
                  <Form.Item name={"device"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.device
                )}
                / {SchemeData.devices}
              </Descriptions.Item>
              <Descriptions.Item key='group' label="group">
                {Editable ? (
                  <Form.Item name={"group"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.group
                )}
                / {SchemeData.groups}
              </Descriptions.Item>
              <Descriptions.Item key='IoT' label="IoT">
                {Editable ? (
                  <Form.Item name={"iot"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.iot
                )} / {SchemeData.iots}
              </Descriptions.Item>
              <Descriptions.Item key='IoT_poor' label="IoT_poor">
                {Editable ? (
                  <Form.Item name={"iot_poor"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.iot_poor
                )} / {SchemeData.iot_poors}
              </Descriptions.Item>
              <Descriptions.Item key='tracking' label="tracking">
                {Editable ? (
                  <Form.Item name={"tracking"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.tracking
                )} / {SchemeData.trackings}
              </Descriptions.Item>
              <Descriptions.Item key='tracking_pool' label="tracking_pool">
                {Editable ? (
                  <Form.Item name={"tracking_pool"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.tracking_pool
                )} / {SchemeData.tracking_pools}
              </Descriptions.Item>
              <Descriptions.Item key='period_alive' label="period_alive">
                {Editable ? (
                  <Form.Item name={"period_alive"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.period_alive
                )}
              </Descriptions.Item>
              <Descriptions.Item key='period_status' label="period_status">
                {Editable ? (
                  <Form.Item name={"period_status"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.period_status
                )}
              </Descriptions.Item>
              <Descriptions.Item key='period_iot' label="period_iot">
                {Editable ? (
                  <Form.Item name={"period_iot"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.period_iot
                )}
              </Descriptions.Item>
              <Descriptions.Item key='period_gps' label="period_gps">
                {Editable ? (
                  <Form.Item name={"period_gps"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.period_gps
                )}
              </Descriptions.Item>
              <Descriptions.Item key='alive_timeout' label="alive_timeout">
                {Editable ? (
                  <Form.Item name={"alive_timeout"} rules={[{ required: true, message: "required" }]}>
                    <Input className={styles.SchemeInput}/>
                  </Form.Item>
                ) : (
                  SchemeData.alive_timeout
                )}
              </Descriptions.Item>
              <Descriptions.Item key='expire' label="expire">
                {Editable ? (
                  <Form.Item name={"expire"} rules={[{ required: true, message: "required" }]}>
                    <Input style={{width:'130px'}}/>
                  </Form.Item>
                ) : (
                  SchemeData.expire
                )}
              </Descriptions.Item>
            </Descriptions>
          </Form>
          </Fragment>
        )
      )}
    </Modal>
  );
};


// export const SchemeManageC = () => {
//   const { state } = useContext(Context);
//   const [uploading, setUploading] = useState(false);
//   const [form] = Form.useForm();
//   const cid = localStorage.getItem("authUser.cid");
//   const SchemeUrl =
//     cid === "proscend"
//       ? `/scheme_mgnt?list_scheme={${state.Login.Cid}}`
//       : `/scheme_mgnt?list_scheme={"cid":"${cid}"}`;
//   const [loading, response] = useURLloader(SchemeUrl, uploading);
//   const [SchemeData, setSchemeData] = useState([]);
//   const [CreateSchemevisible, setCreateSchemevisible] = useState(false);

//   useEffect(() => {
//     if (response) {
//       // console.log(response)
//       let SchemeData = [];
//       response.response.forEach((item, index) => {
//         SchemeData.push({
//           key: index,
//           cid: item.cid,
//           device: item.scheme_list.device,
//           devices: item.scheme_list.devices,
//           expire: item.scheme_list.expire,
//           expires: item.scheme_list.expires,
//           group: item.scheme_list.group,
//           groups: item.scheme_list.group,
//           iot: item.scheme_list.iot,
//           iot_poor: item.scheme_list.iot_poor,
//           iot_poors: item.scheme_list.iot_poors,
//           iots: item.scheme_list.iots,
//           tracking: item.scheme_list.tracking,
//           trackings: item.scheme_list.trackings,
//           tracking_pools: item.scheme_list.tracking_pools,
//           tracking_pool: item.scheme_list.tracking_pool,
//           user: item.scheme_list.user,
//           users: item.scheme_list.users,
//           period_alive: item.scheme_list.period_alive,
//           period_status: item.scheme_list.period_status,
//           period_iot: item.scheme_list.period_iot,
//           period_gps: item.scheme_list.period_gps,
//           alive_timeout: item.scheme_list.alive_timeout,
//         });
//         setSchemeData(SchemeData);
//       });
//     }
//   }, [response]);

//   const EditableCell = ({
//     editing,
//     dataIndex,
//     title,
//     inputType,
//     record,
//     index,
//     children,
//     ...restProps
//   }) => {
//     const inputNode = inputType === "number" ? <InputNumber /> : <Input />;
//     return (
//       <td {...restProps}>
//         {editing ? (
//           <Form.Item
//             name={dataIndex}
//             style={{
//               margin: 0,
//             }}
//             rules={[
//               {
//                 required: true,
//                 message: `Please Input ${title}!`,
//               },
//             ]}
//           >
//             {inputNode}
//           </Form.Item>
//         ) : (
//           children
//         )}
//       </td>
//     );
//   };

//   const [editingKey, setEditingKey] = useState("");

//   const isEditing = (record) => record.key === editingKey;

//   const edit = (record) => {
//     form.setFieldsValue({
//       device: "",
//       devices: "",
//       expire: "",
//       expires: "",
//       group: "",
//       groups: "",
//       iot: "",
//       iot_poor: "",
//       iot_poors: "",
//       iots: "",
//       tracking: "",
//       trackings: "",
//       tracking_pools: "",
//       tracking_pool: "",
//       user: "",
//       users: "",
//       period_alive: "",
//       period_status: "",
//       period_iot: "",
//       period_gps: "",
//       alive_timeout: "",
//       ...record,
//     });
//     setEditingKey(record.key);
//   };

//   const cancel = () => {
//     setEditingKey("");
//   };

//   const save = async (record) => {
//     try {
//       setUploading(true);
//       const values = await form.validateFields();
//       function EditSchemeUrl() {
//         return axios.get(
//           `scheme_mgnt?modify_scheme={"cid":"${record.cid}","scheme_list":{"user":${values.user},"group":${values.group},"device":${values.device},"expire":${values.expire},"tracking":${values.tracking},"tracking_pool":${values.tracking_pool},"iot":${values.iot},"iot_poor":${values.iot_poor},"period_alive":${values.period_alive},"alive_timeout":${values.alive_timeout},"period_status":${values.period_status},"period_gps":${values.period_gps},"period_iot":${values.period_iot}}}`
//         );
//       }
//       function setAllScheme() {
//         return axios.get(`/cmd?set={"device_cfg":{"filter":{"cid":"${record.cid}"},"obj":{"report_period":{"alive":${values.period_alive},"timeout":${values.alive_timeout},
//         "status":${values.period_status},"iot":${values.period_iot},"gps":${values.period_gps}}}}}`);
//       }

//       // const EditSchemeUrl = `scheme_mgnt?modify_scheme={"cid":"${record.cid}","scheme_list":{"user":${values.user},"group":${values.group},"device":${values.device},"expire":${values.expire},"tracking":${values.tracking},"tracking_pool":${values.tracking_pool},"iot":${values.iot},"iot_poor":${values.iot_poor},"period_alive":${values.period_alive},"alive_timeout":${values.alive_timeout},"period_status":${values.period_status},"period_gps":${values.period_gps},"period_iot":${values.period_iot}}}`;
//       // const setAllScheme = `/cmd?set={"device_cfg":{"filter":{},"obj":{"report_period":{"alive":${values.period_alive},"timeout":${values.alive_timeout},
//       // "status":${values.period_status},"iot":${values.period_iot},"gps":${values.period_gps}}}}}`
//       axios
//         .get([EditSchemeUrl(), setAllScheme()])
//         .then(
//           axios.spread((acct, perms) => {
//             // axios 回傳的資料在 data 屬性
//             console.table("EditSchemeUrl 回傳結果", acct);
//             // fetch 資料可以先在 function 內作 json()
//             console.table("setAllScheme 回傳結果", perms);
//             setUploading(false);
//             setEditingKey("");
//             message.success("update successfully.");
//           })
//         )
//         .catch((error) => {
//           setUploading(false);
//           console.log(error);
//           setEditingKey("");
//           message.error("update fail.");
//         });
//     } catch (errInfo) {
//       console.log("Validate Failed:", errInfo);
//     }
//   };

//   const DeleteScheme = (record) => {
//     let DeleteSchemeUrl = `/scheme_mgnt?delete_scheme={"cid":"${record.cid}"}`;
//     setUploading(true);
//     axios
//       .get(DeleteSchemeUrl)
//       .then((res) => {
//         console.log(res);
//         setUploading(false);
//         message.success("delete successfully.");
//       })
//       .catch((error) => {
//         console.log(error);
//         setUploading(false);
//         message.error("delete fail.");
//       });
//   };

//   const columns = [
//     {
//       title: "CustomerID",
//       width: 150,
//       dataIndex: "cid",
//       key: "cid",
//       fixed: "left",
//       // editable: true,
//     },
//     {
//       title: "User",
//       dataIndex: "user",
//       key: "user",
//       width: 100,
//       // colSpan: 2,
//       editable: true,
//     },
//     {
//       title: "Users",
//       dataIndex: "users",
//       key: "users",
//       width: 100,
//       // colSpan: 0,
//     },
//     {
//       title: "Device",
//       width: 100,
//       dataIndex: "device",
//       key: "device",
//       editable: true,
//     },
//     {
//       title: "Devices",
//       dataIndex: "devices",
//       key: "devices",
//       width: 100,
//     },
//     {
//       title: "Group",
//       dataIndex: "group",
//       key: "group",
//       width: 100,
//       editable: true,
//     },
//     {
//       title: "Groups",
//       dataIndex: "groups",
//       key: "groups",
//       width: 100,
//     },
//     {
//       title: "IoT",
//       dataIndex: "iot",
//       key: "iot",
//       width: 100,
//       editable: true,
//     },
//     {
//       title: "IoTs",
//       dataIndex: "iots",
//       key: "iots",
//       width: 100,
//     },
//     {
//       title: "iot_poor",
//       dataIndex: "iot_poor",
//       key: "iot_poor",
//       width: 110,
//       editable: true,
//     },
//     {
//       title: "iot_poors",
//       dataIndex: "iot_poors",
//       key: "iot_poors",
//       width: 110,
//     },
//     {
//       title: "Tracking",
//       dataIndex: "tracking",
//       key: "trackings",
//       width: 100,
//       editable: true,
//     },
//     {
//       title: "Trackings",
//       dataIndex: "trackings",
//       key: "tracking",
//       width: 100,
//     },
//     {
//       title: "tracking_pool",
//       dataIndex: "tracking_pool",
//       key: "tracking_pool",
//       width: 110,
//       editable: true,
//     },
//     {
//       title: "tracking_pools",
//       dataIndex: "tracking_pools",
//       key: "tracking_pools",
//       width: 110,
//     },
//     {
//       title: "Expire",
//       dataIndex: "expire",
//       width: 100,
//       editable: true,
//     },
//     {
//       title: "Expires",
//       dataIndex: "expires",
//       width: 100,
//     },
//     {
//       title: "period_alive",
//       dataIndex: "period_alive",
//       key: "period_alive",
//       width: 100,
//       editable: true,
//     },
//     {
//       title: "period_status",
//       dataIndex: "period_status",
//       key: "period_status",
//       width: 100,
//       editable: true,
//     },
//     {
//       title: "period_iot",
//       dataIndex: "period_iot",
//       key: "period_iot",
//       width: 100,
//       editable: true,
//     },
//     {
//       title: "period_gps",
//       dataIndex: "period_gps",
//       key: "period_gps",
//       width: 100,
//       editable: true,
//     },
//     {
//       title: "alive_timeout",
//       dataIndex: "alive_timeout",
//       key: "period_gps",
//       width: 100,
//       editable: true,
//     },
//     {
//       title: "Action",
//       key: "action",
//       width: 160,
//       fixed: "right",
//       render: (_, record) => {
//         const editable = isEditing(record);
//         const show =
//           localStorage.getItem("authUser.cid") && state.Login.Cid === "";
//         return editable ? (
//           <span>
//             <a
//               href="/#"
//               onClick={(e) => {
//                 e.preventDefault();
//                 save(record);
//               }}
//               style={{
//                 marginRight: 8,
//               }}
//             >
//               Save
//             </a>
//             <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
//               <a href="/#">Cancel</a>
//             </Popconfirm>
//           </span>
//         ) : (
//           <div className={styles.InformationBtnWrapper}>
//             <Tooltip title="Edit Info">
//               <a
//                 href="/#"
//                 disabled={editingKey !== ""}
//                 onClick={(e) => {
//                   e.preventDefault();
//                   edit(record);
//                 }}
//               >
//                 <RiEdit2Fill className={styles.EditIcon} />
//               </a>
//             </Tooltip>
//             {show && (
//               <Tooltip title="Delete Info">
//                 <Popconfirm
//                   title="Sure to Delete?"
//                   onConfirm={() => {
//                     DeleteScheme(record);
//                   }}
//                 >
//                   <FcDeleteDatabase className={styles.DeleteIcon} />
//                 </Popconfirm>
//               </Tooltip>
//             )}
//           </div>
//         );
//       },
//     },
//   ];

//   const mergedColumns = columns.map((col) => {
//     if (!col.editable) {
//       return col;
//     }
//     return {
//       ...col,
//       onCell: (record) => ({
//         record,
//         inputType: col.dataIndex === "number",
//         dataIndex: col.dataIndex,
//         title: col.title,
//         editing: isEditing(record),
//       }),
//     };
//   });

//   return (
//     <Card>
//       <div>
//         <Button
//           type="primary"
//           onClick={() => {
//             setCreateSchemevisible(true);
//           }}
//         >
//           New Scheme
//         </Button>
//         <Modal
//           title="New Scheme"
//           visible={CreateSchemevisible}
//           className={styles.modal}
//           onOk={() => setCreateSchemevisible(false)}
//           onCancel={() => setCreateSchemevisible(false)}
//           okButtonProps={{
//             form: "CreateScheme",
//             key: "submit",
//             htmlType: "submit",
//           }}
//           okText="Create"
//           cancelText="Cancel"
//         >
//           <CreateSchemeMF
//             CreateSchemevisible={CreateSchemevisible}
//             setCreateSchemevisible={setCreateSchemevisible}
//             uploading={uploading}
//             setUploading={setUploading}
//           />
//         </Modal>
//       </div>
//       <Form form={form} component={false}>
//         <Table
//           columns={columns}
//           dataSource={SchemeData}
//           columns={mergedColumns}
//           style={{ overflowX: "auto" }}
//           loading={loading || uploading}
//           components={{
//             body: {
//               cell: EditableCell,
//             },
//           }}
//           rowClassName="editable-row"
//         />
//       </Form>
//     </Card>
//   );
// };
