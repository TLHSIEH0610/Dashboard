import React, { useEffect, useState, useContext } from "react";
import {
  Select,
  Card,
  Form,
  Input,
  Tag,
  Button,
  Collapse,
  Modal,
  Table,
  Transfer,
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

const { TabPane } = Tabs;
const { Option } = Select;
const { Panel } = Collapse;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const EditGroupForm = ({ onFinish, record, NodeList }) => {
  console.log(onFinish);
  const [form] = Form.useForm();
  const [mockData, setmockData] = useState([]);
  const [targetKeys, settargetKeys] = useState([]);

  useEffect(() => {
    if (record) {
      console.log(record, NodeList);
      let targetKeys = [];
      let mockData = [];
      console.log(typeof record.node_list);
      if (typeof record.node_list === "string") {
        const data = {
          key: record.node_list,
          title: `${record.node_list}`,
          description: `${record.node_list}`,
        };
        targetKeys.push(data.key);
      } else {
        record.node_list.forEach((item) => {
          const data = {
            key: item,
            title: `${item}`,
            description: `${item}`,
          };
          targetKeys.push(data.key);
          // mockData.push(data);
        });
      }
      NodeList.forEach((item) => {
        mockData.push({
          key: item.id,
          title: `${item.id}`,
          description: `${item.id}`,
        });
      });
      setmockData(mockData);
      settargetKeys(targetKeys);
    }
  }, []);

  const filterOption = (inputValue, option) =>
    option.description.indexOf(inputValue) > -1;

  const handleChange = (targetKeys) => {
    settargetKeys(targetKeys);
  };

  const handleSearch = (dir, value) => {
    console.log("search:", dir, value);
  };

  return (
    <Form
      {...layout}
      name="EditGroup"
      onFinish={onFinish}
      form={form}
    >
      <Form.Item name={"EditDevice"}>
        <Transfer
          dataSource={mockData}
          showSearch
          filterOption={filterOption}
          targetKeys={targetKeys}
          onChange={handleChange}
          onSearch={handleSearch}
          render={(item) => item.title}
          listStyle={{
            width: "100%",
            height: 300,
          }}
          operations={["Add", "Remove"]}
        />
      </Form.Item>
    </Form>
  );
};

export const GroupManagementC = () => {
  const [form] = Form.useForm();
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
  const [EditGroupVisible, setEditGroupVisible] = useState(false);
  const [record, setRecord] = useState([]);
  console.log('渲染了 GroupManagementC')
  useEffect(() => {
    
    if (Noderesponse) {
      console.log(Noderesponse);
      let NodeList = [];
      Noderesponse.response.nodeInf.forEach((item, index) => {
        NodeList.push({ key: index, id: item.nodeInf.id });
      });
      console.log(NodeList);
      setNodeList(NodeList);
    }
  }, [Noderesponse]);

  useEffect(() => {
    if (Groupresponse) {
      let GroupList = [];
      console.log(Groupresponse);
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
      console.log(GroupList);
      setGroupList(GroupList);
    }
  }, [Groupresponse]);

  function callback(key) {
    console.log(key);
  }
  const EditGrouponFinish = (values) => {
    console.log(values);
    setUploading(true);
    const cid = localStorage.getItem("authUser.cid");
    const proscendCid = state.Login.Cid;
    const EditGroupUrl =
      cid === "proscend" && proscendCid !== ""
        ? `/device_mgnt/group?modify_group={${proscendCid}, "group_list":[{"name":"${
            record.gid
          }","node_list":${JSON.stringify(values.EditDevice)}}]}`
        : `/device_mgnt/group?modify_group={"cid":"${cid}","group_list":[{"name":"${
            record.gid
          }","node_list":${JSON.stringify(values.EditDevice)}}]}`;
    console.log(EditGroupUrl);
    axios
      .get(EditGroupUrl)
      .then((res) => {
        console.log(res);
        setUploading(false);
      })
      .catch((erro) => {
        console.log(erro);
        setUploading(false);
      });
  };

  const onFinish = (values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    const cid = localStorage.getItem("authUser.cid");
    const user = state.Login.Cid;
    const CreateGroupUrl =
      cid === "proscend" && user !== ""
        ? `/device_mgnt/group?create_group={${
            state.Login.Cid
          }, "group_list":[{"name":"${
            values.groupName
          }","node_list":${JSON.stringify(values.Device_ID)}}]}`
        : `/device_mgnt/group?create_group={"cid":"${cid}", "group_list":[{"name":"${
            values.groupName
          }","node_list":${JSON.stringify(values.Device_ID)}}]}`;
    console.log(CreateGroupUrl);
    form.resetFields(["Device_ID", "groupName"]);
    axios
      .get(CreateGroupUrl)
      .then((res) => {
        setUploading(false);
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        setUploading(false);
      });
  };

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
      dataIndex: ["gid"],
      key: "gid",
      width: "10%%",
    },
    {
      title: "Device",
      dataIndex: ["node_list"],
      key: "node_list",
      width: "70%",
      render: (_, record) => {
        if (typeof record.node_list === "object") {
          return record.node_list.map((item, index) => {
            return (
              <Tag key={index} color="default">
                {item}
              </Tag>
            );
          });
        } else {
          return <Tag color="default">{record.node_list}</Tag>;
        }
      },
    },
    {
      title: "Action",
      dataIndex: "action",
      width: "20%",
      render: (_, record) => {
        return (
          <div>
            <Button
              onClick={() => {
                setEditGroupVisible(true);
                setRecord(record);
              }}
            >
              Edit
            </Button>
            <Button
              onClick={() => {
                const cid = localStorage.getItem("authUser.cid");
                const deleteUrl =
                  cid === "proscend" && state.Login.Cid !== ""
                    ? `/device_mgnt/group?delete_group={${state.Login.Cid},"group_list":[{"name":"${record.gid}"}]}`
                    : `/device_mgnt/group?delete_group={"cid":"${cid}","group_list":[{"name":"${record.gid}"}]}`;
                console.log(deleteUrl);
                setUploading(true);
                axios
                  .get(deleteUrl)
                  .then((res) => {
                    setUploading(false);
                    console.log(res);
                  })
                  .catch((error) => {
                    setUploading(false);
                    console.log(error);
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
    <div>
      <Card>
        <Form
          // loading={uploading}
          name="dynamic_form_nest_item"
          onFinish={onFinish}
          autoComplete="off"
          form={form}
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
                rules={[{ required: true, message: "Deivce Id is required!" }]}
              >
                <Select
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
                rules={[{ required: true, message: "Group name is required" }]}
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
      </Card>
      <Card loading={Grouploading}>
        <Modal
          title="Edit Group"
          visible={EditGroupVisible}
          onOk={() => setEditGroupVisible(false)}
          onCancel={() => setEditGroupVisible(false)}
          width={700}
          okButtonProps={{
            form: "EditGroup",
            key: "submit",
            htmlType: "submit",
          }}
          okText="Submit"
          cancelText="Cancel"
        >
          <EditGroupForm
            form={form}
            record={record}
            onFinish={EditGrouponFinish}
            NodeList={NodeList}
          />
        </Modal>
        <Collapse defaultActiveKey={["0"]} onChange={callback}>
          {GroupList.map((item, index) => {
            //   console.log(item)
            return (
              <Panel key={index} header={item.cid}>
                <Table
                  loading={uploading}
                  key={index}
                  columns={columns}
                  dataSource={item.group}
                  pagination={false}
                />
              </Panel>
            );
          })}
        </Collapse>
      </Card>
    </div>
  );
};

export default GroupManagementC;

const EditGroupModalC = ({
  GroupModalvisible,
  setGroupModalvisible,
  record,
  setUploading
}) => {
  const [form] = Form.useForm();
  const [Createform] = Form.useForm();
  const [Btnuploading, setBtnuploading] = useState(false);
  const getGroupUrl = `/device_mgnt/group?list_group={"cid":"${record.cid}"}`;
  const [Grouploading, Groupresponse] = useURLloader(
    getGroupUrl, Btnuploading
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
    setBtnuploading(true)
    axios
      .get(deleteUrl)
      .then((res) => {
        setUploading(false);
        setBtnuploading(false)
        message.success("Delete successfully.");
        console.log(res);
      })
      .catch((error) => {
        setUploading(false);
        setBtnuploading(false)
        message.error("Delete fail.");
        console.log(error);
      });
  };
  const UpdateGrouponFinish = (values) => {
    console.log(values);
    setUploading(true);
    setBtnuploading(true)
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


    console.log(group_list);
    const EditGroupUrl = `/device_mgnt/group?modify_group={"cid":"${record.cid}","group_list":[${group_list}]}`;
    console.log(EditGroupUrl);
    axios
      .get(EditGroupUrl)
      .then((res) => {
        console.log(res);
        message.success("Update successfully.");
        setUploading(false);
        setBtnuploading(false)
      })
      .catch((erro) => {
        console.log(erro);
        message.error("Update fail.");
        setUploading(false);
        setBtnuploading(false)
      });
  };

  const CreateGrouponFinish = (values) => {
    console.log("Received values of form:", values);
    setUploading(true);
    setBtnuploading(true)
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
        setBtnuploading(false)
        message.success("Create completely.");
        console.log(res);
      })
      .catch((error) => {
        console.log(error);
        message.error("Create fail.");
        setUploading(false);
        setBtnuploading(false)
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
      Noderesponse.response.nodeInf.forEach((item, index) => {
        NodeList.push({ key: index, id: item.nodeInf.id });
      });
      setNodeList(NodeList);
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
      width: "10%",
      dataIndex: "gid",
      key: "gid",
      render: (_, grouprecord, index) => {
        return (
          <div style={{ display: "flex", flexDirection: "column", justifyContent:'center', alignItems:'center' }}>
            <Form
              // loading={uploading}
              name={["Group", index]}
              onFinish={UpdateGrouponFinish}
              autoComplete="off"
              form={form}
              className={styles.Form}
            >
              <Form.Item
                // label='Device'
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
                {/* <a
                onClick={(e) => {
                  e.preventDefault();

                }}
              > */}
                <FcDeleteRow className={styles.DeleteGroupIcon} style={{fontSize:'2rem', cursor:'pointer' }}/>
                {/* </a> */}
              </Popconfirm>
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: "Device",
      width: "90%",
      dataIndex: "node_list",
      key: "node_list",
      render: (_, record, index) => {
        return (
          <Form
            // loading={uploading}
            name={["GroupDevice", index]}
            onFinish={UpdateGrouponFinish}
            autoComplete="off"
            form={form}
            className={styles.Form}
          >
            <Form.Item
              // label='Device'
              // style={{ width: 250 }}
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
      width={"80%"}
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
            loading={Btnuploading}
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
          <Card loading={Nodeloading} bordered={false}>
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
                    loading={Btnuploading}
                    //   className={styles.clickBtn}
                  >
                    Submit
                  </Button>
                </Form.Item>
              </div>
            </Form>
          </Card>
        </TabPane>
        <TabPane tab="Edit Group" key="Edit Group" className={styles.groupPane}>
          <Table
            columns={columns}
            dataSource={GroupData}
            pagination={false}
            loading={Btnuploading}
            // scroll={{ x: 1500, y: 600 }}
          />
        </TabPane>
      </Tabs>
      {/* </Card> */}
    </Modal>
  );
};

export const EditGroupModalMC = React.memo( EditGroupModalC )