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
import Context from "../../../../Utility/Reduxx";
import styles from "../management.module.scss";
import axios from "axios";
import useURLloader from "../../../../hook/useURLloader";
import { FcDeleteRow } from "react-icons/fc";
import { RiEdit2Fill } from 'react-icons/ri'
import { Translator } from '../../../../i18n/index'


const { TabPane } = Tabs;
const { Option } = Select;

export const GroupManagementC = () => {
  // const [form] = Form.useForm();
  const { state } = useContext(Context);
  const NodeUrl = `/cmd?get={"nodeInf":{"nodeInf":{"cid":{},"gid":{},"token":{},"id":{}}}}`;
  const [_, Noderesponse] = useURLloader(NodeUrl);
  const [uploading, setUploading] = useState(false);
  const cid = localStorage.getItem("authUser.cid");
  const getGroupUrl =
    cid === "proscend"
      ? `/device_mgnt/group?list_group={${state.Login.Cid}}`
      : `/device_mgnt/group?list_group={"cid":"${cid}"}`;
  const [Grouploading, Groupresponse] = useURLloader(getGroupUrl, uploading);
  const [NodeList, setNodeList] = useState([]);
  const [GroupList, setGroupList] = useState([
    { cid: "", gid: "", node_list: [""], key: "" },
  ]);
  // const [EditGroupVisible, setEditGroupVisible] = useState(false);
  const [record, setRecord] = useState([]);
  const [GroupModalvisible, setGroupModalvisible] = useState(false)

  useEffect(() => {
    if (Groupresponse) {
      let GroupList = [];
      Groupresponse.response.forEach((item, index) => {
        if(!item.group_list.length){
          GroupList.push(
            {cid : item.cid, key: index, length: 2}
          );
        }
        item.group_list.forEach((group, groupIndex) => {
          group["key"] = `${groupIndex}_${index}`;
          group["cid"] = item.cid;
          group["length"] = item.group_list.length;
          GroupList.push(
            group
          );
        });

      });
      setGroupList(GroupList);
    }
  }, [Groupresponse]);
  

  useEffect(() => {
    
    if (Noderesponse) {
      let NodeList = [];
      Noderesponse.response.nodeInf.forEach((item, index) => {
        NodeList.push({ key: index, id: item.nodeInf.id, cid: item.nodeInf.cid});
      });
      setNodeList(NodeList);
    }
  }, [Noderesponse]);
  const cidList = new Set()
  const cidList2 = new Set()
  const columns = [
    {
      title: Translator("ISMS.Customer"),
      dataIndex: ["cid"],
      key: "cid",
      width: "10%%",
      render: (value, row, index) => {
        console.log(value, row, index)
        
        const obj = {
          children: value,
          props: {},
        };
        
        if(!cidList.has(row.cid) && row.node_list ){
          cidList.add(row.cid)
          obj.props.rowSpan = row.length;
        }else if(!row.node_list){
          obj.props.rowSpan = 1;
        }
        else{
          obj.props.rowSpan = 0;
        }

        return obj
      }
    },
    {
      title: Translator("ISMS.Group"),
      dataIndex: ["gid"],
      key: "gid",
      width: "10%%",
    },
    {
      title: Translator("ISMS.Device"),
      dataIndex: ["node_list"],
      key: "node_list",
      width: "70%",
      render: (_, record) => {
        // console.log(record)
        if(record.node_list){
        return  record.node_list.map((node, nodeIndex)=>{
              return (
                <Tag key={nodeIndex} color="default">
                  {node}
                </Tag>
            );
         
          })
        }
      },
    },
    {
      title: Translator("ISMS.Action"),
      dataIndex: "action",
      width: "20%",
      render: (_, record) => {

        const obj = {
          children: <div>
          <Tooltip title="Edit Info">
            <a
              href="/#"
              onClick={(e) => {
                e.preventDefault()
                // setEditGroupVisible(true);
                setGroupModalvisible(true)
                setRecord(record);
              }}
            >
              <RiEdit2Fill className={styles.EditIcon} />
            </a>
           </Tooltip>
        </div>,
          props: {},
        };

        if(!cidList2.has(record.cid) && record.node_list ){
          cidList2.add(record.cid)
          obj.props.rowSpan = record.length;
        }else if(!record.node_list){
          obj.props.rowSpan = 1;
        }
        else{
          obj.props.rowSpan = 0;
        }
        return obj

      },
    },
  ];

  return (
    <div>
          <EditGroupModalC record={record} setGroupModalvisible={setGroupModalvisible} GroupModalvisible={GroupModalvisible} uploading={uploading} setUploading={setUploading}/>
                <Table
                  loading={uploading || Grouploading}
                  // key={index}
                  columns={columns}
                  // dataSource={item.group}
                  dataSource={GroupList}
                  pagination={false}
                  style={{overflowX:'auto'}}
                />
    </div>
  );
};

export default GroupManagementC;

const EditGroupModalC = ({
  GroupModalvisible,
  setGroupModalvisible,
  record,
  uploading,
  setUploading
}) => {

  const [form] = Form.useForm();
  const [Createform] = Form.useForm();
  // const [uploading, setUploading] = useState(false);
  const getGroupUrl = `/device_mgnt/group?list_group={"cid":"${record.cid}"}`;
  const [Grouploading, Groupresponse] = useURLloader(
    getGroupUrl, uploading
  );
  const [GroupData, setGroupData] = useState([{ gid: "", node_list: [] }]);
  // const NodeUrl = `/cmd?get={"nodeInf":{"nodeInf":{"cid":{},"gid":{},"token":{},"id":{}}}}`;
  const NodeUrl = `/cmd?get={"nodeInf":{"filter":{"cid":"${record.cid}"},"nodeInf":{"cid":{},"gid":{},"token":{},"id":{}}}}`;
  const [Nodeloading, Noderesponse] = useURLloader(NodeUrl);
  const [NodeList, setNodeList] = useState([]);
  const [currentPage, setCurrentPage] = useState("");

  function callback(key) {
    setCurrentPage(key);
  }

  const deleteGroup = (grouprecord) => {
    const deleteUrl = `/device_mgnt/group?delete_group={"cid":"${record.cid}","group_list":[{"name":"${grouprecord.gid}"}]}`;
    console.log(deleteUrl);
    setUploading(true);
    setUploading(true)
    axios
      .get(deleteUrl)
      .then((res) => {
        setUploading(false);
        setUploading(false)
        message.success("Delete successfully.");
        console.log(res);
      })
      .catch((error) => {
        setUploading(false);
        setUploading(false)
        message.error("Delete fail.");
        console.log(error);
      });
  };
  const UpdateGrouponFinish = (values) => {
    console.log(values);
    setUploading(true);
    setUploading(true)
    let group_list = "";
    for (let i = 0; i < values.Group.length; i++) {
      if (i === values.Group.length - 1) {
        group_list += `{"name":"${
          values.Group[i].gid
        }","node_list":${JSON.stringify(values.GroupDevice[i].node_list)}}`;
      } else {
        group_list += `{"name":"${
          values.Group[i].gid
        }","node_list":${JSON.stringify(values.GroupDevice[i].node_list)}},`;
      }
    }


    // console.log(group_list);
    const EditGroupUrl = `/device_mgnt/group?modify_group={"cid":"${record.cid}","group_list":[${group_list}]}`;
    // console.log(EditGroupUrl);
    axios
      .get(EditGroupUrl)
      .then((res) => {
        console.log(res);
        message.success("Update successfully.");
        setUploading(false);
        setUploading(false)
      })
      .catch((erro) => {
        console.log(erro);
        message.error("Update fail.");
        setUploading(false);
        setUploading(false)
      });
  };

  const CreateGrouponFinish = (values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    setUploading(true)
    const CreateGroupUrl = `/device_mgnt/group?create_group={"cid":"${
      record.cid
    }", "group_list":[{"name":"${
      values.groupName
    }","node_list":${JSON.stringify(values.Device_ID)}}]}`;
    console.log(CreateGroupUrl);
    Createform.resetFields(["Device_ID", "groupName"]);
    axios
      .get(CreateGroupUrl)
      .then((res) => {
        setUploading(false);
        setUploading(false)
        message.success("Create completely.");
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        message.error("Create fail.");
        setUploading(false);
        setUploading(false)
      });
  };
  useEffect(() => {
    if (Groupresponse) {
      let GroupData = [];
      Groupresponse.response[0].group_list.forEach((item, index) => {
        GroupData.push({
          key: index,
          gid: item.gid,
          node_list: item.node_list,
        });
      });
      setGroupData(GroupData);
      form.setFieldsValue({
        Group: GroupData,
        GroupDevice: GroupData,
      });
    }
  }, [Groupresponse]);

  useEffect(() => {
    if (Noderesponse) {
      console.log(Noderesponse)
      let NodeList = [];
      Noderesponse.response && Noderesponse.response.nodeInf.forEach((item, index) => {
        NodeList.push({ key: index, id: item.nodeInf.id });
      });
      setNodeList(NodeList);
      console.log(NodeList)
    }
  }, [Noderesponse]);

  function tagRender(props) {
    const { label, _, closable, onClose } = props;
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
      dataIndex: "gid",
      key: "gid",
      render: (_, grouprecord, index) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", justifyContent:'center', alignItems:'center' }}>
            <Form
              name={["Group", index]}
              onFinish={UpdateGrouponFinish}
              autoComplete="off"
              form={form}
              className={styles.Form}
            >
              <Form.Item
                style={{ marginBottom:'10px' }}
                className={styles.formitem}
                name={["Group", index, "gid"]}
                rules={[{ required: true, message: "Group is required!" }]}
              >
                <Input disabled={true} />
              </Form.Item>
            </Form>

            <Tooltip title="Delete Group">
              <Popconfirm
                title="Sure to delete?"
                onConfirm={()=>{deleteGroup(grouprecord)}}
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
          <Form
            name={["GroupDevice", index]}
            onFinish={UpdateGrouponFinish}
            autoComplete="off"
            form={form}
            className={styles.Form}
          >
            <Form.Item
              className={styles.formitem}
              name={["GroupDevice", index, "node_list"]}
              rules={[{ required: true, message: "Deivce Id is required!" }]}
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
          </Form>
        );
      },
    },
  ];

  return (
    <Modal
      visible={GroupModalvisible}
      onOk={() => setGroupModalvisible(false)}
      onCancel={() => setGroupModalvisible(false)}
      centered={true}
      className={styles.modal}
      destroyOnClose={true}
      footer={[
        currentPage !== "Edit Group" && (
          <Button key="back" onClick={() => setGroupModalvisible(false)}>
            confirm
          </Button>
        ),
        currentPage === "Edit Group" && (
          <Button
            key="ok"
            type="primary"
            loading={uploading}
            onClick={() => {
              form.submit();
            }}
          >
            Submit
          </Button>
        ),
      ]}
    >
      {/* <Card > */}
      <Tabs defaultActiveKey="1" onChange={callback}>
        <TabPane tab="Create Group" key="Create Group">
          {/* <Card loading={Nodeloading || Grouploading} bordered={false}> */}
            <Form
              name="CreateGroup"
              onFinish={CreateGrouponFinish}
              autoComplete="off"
              form={Createform}
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
                      loading={Nodeloading || Grouploading || uploading}
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
                <Form.Item className={styles.submitBtn}>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={uploading}
                    //   className={styles.clickBtn}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          {/* </Card> */}
        </TabPane>
        <TabPane tab="Edit Group" key="Edit Group" className={styles.groupPane}>
          <Table
            columns={columns}
            dataSource={GroupData}
            pagination={false}
            loading={uploading}
            // scroll={{ x: 1500, y: 600 }}
          />
        </TabPane>
      </Tabs>
      {/* </Card> */}
    </Modal>
  );
};

export const EditGroupModalMC = React.memo( EditGroupModalC )