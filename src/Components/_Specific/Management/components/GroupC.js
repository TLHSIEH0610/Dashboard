import React, { useEffect, useState, useContext } from "react";
import {
  Select,
  Form,
  Input,
  Tag,
  Button,
  Modal,
  Table,
  Tabs,
  message,
  Tooltip,
  Popconfirm,
} from "antd";
import styles from "../management.module.scss";
import axios from "axios";
import { FcDeleteRow } from "react-icons/fc";
import { UserLogOut } from '../../../../Utility/Fetch'
import { useHistory } from 'react-router-dom'
import Context from "../../../../Utility/Reduxx";

const { TabPane } = Tabs;
const { Option } = Select;

const EditGroupModalC = ({
  GroupModalvisible,
  setGroupModalvisible,
  record,
  setRecord
}) => {
  const { dispatch } = useContext(Context);
  const [EditGroupform] = Form.useForm();
  const [CreateGroupform] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [IsUpdate, setIsUpdate] = useState(false)
  const [GroupData, setGroupData] = useState([{ name: "", node_list: [] }]);
  const [NodeList, setNodeList] = useState([]);
  const [currentPage, setCurrentPage] = useState("1");
  const history = useHistory()
  useEffect(()=>{
    if(record.cid){
      setUploading(true)
      const config1 = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        url: '/cmd',
        data: JSON.parse(`{"get":{"nodeInf":{"filter":{"cid":"${record.cid}"},"nodeInf":{"cid":{},"gid":{},"token":{},"id":{}}}}}`),
      }
      const config2 = {
        method: 'post',
        headers: { 'Content-Type': 'application/json' },
        url: '/device_mgnt/group',
        data: JSON.parse(`{"list_group":{"cid":"${record.cid}"}}`),
      }

      function NodeUrl() {
        return axios(config1)
      }
      function getGroupUrl() {
        return axios(config2)
      }
      axios.all([NodeUrl(), getGroupUrl()])
      .then(axios.spread((acct, perms) => {
        if(acct.data.response?.nodeInf){
          let NodeList = [];
          acct.data.response.nodeInf.forEach((item, index) => {
            NodeList.push({ key: index, id: item.nodeInf.id });
          });
          setNodeList(NodeList);
          let GroupData = [];
          perms.data.response[0].group_list.forEach((item, index) => {
            GroupData.push({
              key: index,
              name: item.gid,
              node_list: item.node_list,
            });
          });
          setGroupData(GroupData);
          EditGroupform.setFieldsValue({
            Group: GroupData,
          });
        }else{
          setGroupData([]);
          setNodeList([]);
        }

        setUploading(false)

      }))
      .catch((error) => { 
        console.error(error) 
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");                                                                         
        } 
        setUploading(false)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[record.cid, IsUpdate])


  function callback(page) {
    setCurrentPage(page);
  }

  const deleteGroup = (grouprecord) => {
    const deleteUrl = `/device_mgnt/group?delete_group={"cid":"${record.cid}","group_list":[{"name":"${grouprecord.name}"}]}`;
    console.log(deleteUrl);
    setUploading(true);
    axios
      .post(deleteUrl)
      .then(() => {
        setUploading(false);
        message.success("Delete successfully.");
        setIsUpdate(!IsUpdate)
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");                                                                         
        } 
        message.error("Delete fail.");
        setUploading(false);
        console.log(error);
      });
  };

  const UpdateGrouponFinish = (values) => {
    console.log(values);
    setUploading(true);
    const EditGroupUrl = `/device_mgnt/group?modify_group={"cid":"${record.cid}","group_list":${JSON.stringify(values.Group)}}`;
    console.log(EditGroupUrl);

    axios
      .post(EditGroupUrl)
      .then(() => {
        message.success("Update successfully.");
        setUploading(false);
        setIsUpdate(!IsUpdate)
      })
      .catch((error) => {
        console.log(error);
        message.error("Update fail.");
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");                                                                         
        } 
        setUploading(false);
      });
  };

  const CreateGrouponFinish = (values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    const CreateGroupUrl = `/device_mgnt/group?create_group={"cid":"${
      record.cid
    }", "group_list":[{"name":"${
      values.groupName
    }","node_list":${JSON.stringify(values.Device_ID)}}]}`;
    console.log(CreateGroupUrl);
    CreateGroupform.resetFields(["Device_ID", "groupName"]);
    axios
      .post(CreateGroupUrl)
      .then((res) => {
        setUploading(false);
        message.success("Create completely.");
        setIsUpdate(!IsUpdate)
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        if (error.response && error.response.status === 401) {
          dispatch({ type: "setLogin", payload: { IsLogin: false } });
          UserLogOut();
          history.push("/userlogin");                                                                         
        } 
        message.error("Create fail.");
        setUploading(false);
      });
  };


  function tagRender(props) {
    const { label, _, closable, onClose } = props; // eslint-disable-line no-unused-vars
    return (
      <Tag
        color="black"
        closable={closable}
        onClose={onClose}
        style={{ marginRight: 3 }}
      >
        {label}
      </Tag>
    );
  }

  const columns = [
    {
      title: "Group",
      width: "30%",
      dataIndex: "name",
      key: "name",
      render: (_, record, index) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", justifyContent:'center', alignItems:'center' }}>
              <Form.Item
                style={{ marginBottom:'10px' }}
                className={styles.formitem}
                name={["Group", index, "name"]}
                rules={[{ required: true, message: "Group is required!" }]}
                // initialValue={record.name}
              >
                <Input disabled={true} />
              </Form.Item>

            <Tooltip title="Delete Group">
              <Popconfirm
                title="Sure to delete?"
                onConfirm={()=>{deleteGroup(record)}}
              >
                <FcDeleteRow className={styles.DeleteGroupIcon} style={{fontSize:'2rem', cursor:'pointer' }}/>
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Device",
      width: "70%",
      dataIndex: "node_list",
      key: "node_list",
      render: (_, __, index) => {
        return (
            <Form.Item
              className={styles.formitem}
              name={["Group", index, "node_list"]}
              rules={[{ required: true, message: "Deivce Id is required!" }]}
              // initialValue={record.node_list}
            >
              <Select
                mode="multiple"
                placeholder="Select devices"
                showArrow
                tagRender={tagRender}
                style={{ width: "100%" }}
                className={styles.deviceinput}
                onFocus={() => {}}
              >
                {NodeList.map((item, index) => {
                  return (
                    <Option key={index} value={item.id}>
                      {item.id}
                    </Option>
                  );
                })}
              </Select>
            </Form.Item>
        );
      },
    },
  ];

  return (
    <Modal
      visible={GroupModalvisible}
      // onOk={() => setGroupModalvisible(false)}
      onCancel={() => {setGroupModalvisible(false); setRecord({cid:null}) }}
      centered={true}
      className={styles.modal}
      destroyOnClose={true}
      footer={[
        currentPage === "1" && (
          <Button loading={uploading} key="back" onClick={() => CreateGroupform.submit() }>
            Submit
          </Button>
        ),
        currentPage === "2" && (
          <Button
            key="ok"
            // type="primary"
            loading={uploading}
            onClick={() => {
              EditGroupform.submit();
            }}
          >
            Submit
          </Button>
        ),
      ]}
    >
      {/* <Card > */}
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Create Group" key="1">
          {/* <Card loading={Nodeloading || Grouploading} bordered={false}> */}
            <Form
              name="CreateGroup"
              onFinish={CreateGrouponFinish}
              autoComplete="off"
              form={CreateGroupform}
              className={styles.Form}
            >
              <div className={styles.formwrap}>
                <div className={styles.formDiv}>
                  <p>Device</p>
                  <Form.Item
                    // label='Device'
                    style={{ width: 250 }}
                    className={styles.formitem}
                    name="Device_ID"
                    rules={[
                      { required: true, message: "Deivce Id is required!" },
                    ]}
                  >
                    <Select
                      loading={uploading}
                      mode="multiple"
                      placeholder="Select devices"
                      showArrow
                      tagRender={tagRender}
                      // style={{ width: 230 }}
                      className={styles.deviceinput}
                      onFocus={() => {}}
                    >
                      {NodeList.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {item.id}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </div>
                <div className={styles.formDiv}>
                  <p>Group Name</p>
                  <Form.Item
                    // label='Action'
                    className={styles.formitem}
                    name="groupName"
                    rules={[
                      { required: true, message: "Group name is required" },
                    ]}
                  >
                    <Input />
                  </Form.Item>
                </div>
              </div>
            </Form>
          {/* </Card> */}
        </TabPane>
        <TabPane tab="Edit Group" key="2" className={styles.groupPane}>
        <Form
            name={["Group"]}
            onFinish={UpdateGrouponFinish}
            autoComplete="off"
            form={EditGroupform}
            className={styles.Form}
          >
          <Table
            columns={columns}
            dataSource={GroupData}
            pagination={false}
            loading={uploading}
          />
        </Form>
        </TabPane>
      </Tabs>
      {/* </Card> */}
    </Modal>
  );
};

export const EditGroupModalMC = React.memo( EditGroupModalC )



// export const GroupManagementC = () => {
//   // const [form] = Form.useForm();
//   const { state } = useContext(Context);
//   const NodeUrl = `/cmd?get={"nodeInf":{"nodeInf":{"cid":{},"gid":{},"token":{},"id":{}}}}`;
//   const [_, Noderesponse] = useURLloader(NodeUrl);
//   const [uploading, setUploading] = useState(false);
//   const cid = localStorage.getItem("authUser.cid");
//   const getGroupUrl =
//     cid === "proscend"
//       ? `/device_mgnt/group?list_group={${state.Login.Cid}}`
//       : `/device_mgnt/group?list_group={"cid":"${cid}"}`;
//   const [Grouploading, Groupresponse] = useURLloader(getGroupUrl, uploading);
//   const [NodeList, setNodeList] = useState([]);
//   const [GroupList, setGroupList] = useState([
//     { cid: "", gid: "", node_list: [""], key: "" },
//   ]);
//   // const [EditGroupVisible, setEditGroupVisible] = useState(false);
//   const [record, setRecord] = useState([]);
//   const [GroupModalvisible, setGroupModalvisible] = useState(false)

//   useEffect(() => {
//     if (Groupresponse) {
//       let GroupList = [];
//       Groupresponse.response.forEach((item, index) => {
//         if(!item.group_list.length){
//           GroupList.push(
//             {cid : item.cid, key: index, length: 2}
//           );
//         }
//         item.group_list.forEach((group, groupIndex) => {
//           group["key"] = `${groupIndex}_${index}`;
//           group["cid"] = item.cid;
//           group["length"] = item.group_list.length;
//           GroupList.push(
//             group
//           );
//         });

//       });
//       setGroupList(GroupList);
//     }
//   }, [Groupresponse]);
  

//   useEffect(() => {
    
//     if (Noderesponse) {
//       let NodeList = [];
//       Noderesponse.response.nodeInf.forEach((item, index) => {
//         NodeList.push({ key: index, id: item.nodeInf.id, cid: item.nodeInf.cid});
//       });
//       setNodeList(NodeList);
//     }
//   }, [Noderesponse]);
//   const cidList = new Set()
//   const cidList2 = new Set()
//   const columns = [
//     {
//       title: Translator("ISMS.Customer"),
//       dataIndex: ["cid"],
//       key: "cid",
//       width: "10%",
//       render: (value, row, index) => {
//         console.log(value, row, index)
        
//         const obj = {
//           children: value,
//           props: {},
//         };
        
//         if(!cidList.has(row.cid) && row.node_list ){
//           cidList.add(row.cid)
//           obj.props.rowSpan = row.length;
//         }else if(!row.node_list){
//           obj.props.rowSpan = 1;
//         }
//         else{
//           obj.props.rowSpan = 0;
//         }

//         return obj
//       }
//     },
//     {
//       title: Translator("ISMS.Group"),
//       dataIndex: ["gid"],
//       key: "gid",
//       width: "10%%",
//     },
//     {
//       title: Translator("ISMS.Device"),
//       dataIndex: ["node_list"],
//       key: "node_list",
//       width: "70%",
//       render: (_, record) => {
//         // console.log(record)
//         if(record.node_list){
//         return  record.node_list.map((node, nodeIndex)=>{
//               return (
//                 <Tag key={nodeIndex} color="default">
//                   {node}
//                 </Tag>
//             );
         
//           })
//         }
//       },
//     },
//     {
//       title: Translator("ISMS.Action"),
//       dataIndex: "action",
//       width: "20%",
//       render: (_, record) => {

//         const obj = {
//           children: <div>
//           <Tooltip title="Edit Info">
//             <a
//               href="/#"
//               onClick={(e) => {
//                 e.preventDefault()
//                 // setEditGroupVisible(true);
//                 setGroupModalvisible(true)
//                 setRecord(record);
//               }}
//             >
//               <RiEdit2Fill className={styles.EditIcon} />
//             </a>
//            </Tooltip>
//         </div>,
//           props: {},
//         };

//         if(!cidList2.has(record.cid) && record.node_list ){
//           cidList2.add(record.cid)
//           obj.props.rowSpan = record.length;
//         }else if(!record.node_list){
//           obj.props.rowSpan = 1;
//         }
//         else{
//           obj.props.rowSpan = 0;
//         }
//         return obj

//       },
//     },
//   ];

//   return (
//     <div>
//           <EditGroupModalC record={record} setGroupModalvisible={setGroupModalvisible} GroupModalvisible={GroupModalvisible} uploading={uploading} setUploading={setUploading}/>
//                 <Table
//                   loading={uploading || Grouploading}
//                   // key={index}
//                   columns={columns}
//                   // dataSource={item.group}
//                   dataSource={GroupList}
//                   pagination={false}
//                   style={{overflowX:'auto'}}
//                 />
//     </div>
//   );
// };

// export default GroupManagementC;