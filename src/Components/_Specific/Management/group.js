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
  Transfer
} from "antd";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
// import Swal from 'sweetalert2'
// import { useHistory } from "react-router-dom";
// import { UserLogin } from '../../../Utility/Fetch'
import Context from "../../../Utility/Reduxx";
import styles from "./management.module.scss";
import axios from "axios";
import useURLloader from "../../../hook/useURLloader";

const { Option } = Select;
const { Panel } = Collapse;
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not validate email!",
    number: "${label} is not a validate number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};

const EditGroupForm = ({ form, onFinish, record }) => {
    console.log(record)

    const [mockData, setmockData] = useState([])
    const [targetKeys, settargetKeys] = useState([])

    useEffect(()=>{
        if(record){
            let targetKeys = [];
            let mockData = []
            record.node_list.forEach((item, index)=>{
                const data = {
                    key: index,
                    title: `${item}`,
                    description: `${item}`,
                    chosen: Math.random() * 2 > 1,
                }
                if (item.chosen) {
                    targetKeys.push(item.key);
                  }
                  mockData.push(data);
            })
            console.log(mockData)
            setmockData(mockData)
            settargetKeys(targetKeys)
        }
    },[])

    const getMock = () => {
        const targetKeys = [];
        const mockData = [];
        for (let i = 0; i < 20; i++) {
          const data = {
            key: i.toString(),
            title: `content${i + 1}`,
            description: `description of content${i + 1}`,
            chosen: Math.random() * 2 > 1,
          };
          if (data.chosen) {
            targetKeys.push(data.key);
          }
          mockData.push(data);
        }
        
        setmockData(mockData)
        settargetKeys(targetKeys)
      };

      const filterOption = (inputValue, option) => option.description.indexOf(inputValue) > -1;

    const handleChange = targetKeys => {
        settargetKeys(targetKeys)
    };
  
    const handleSearch = (dir, value) => {
      console.log('search:', dir, value);
    };

  return (
    <Form
      {...layout}
      name="CreateInfo"
      onFinish={onFinish}
      validateMessages={validateMessages}
      form={form}
    >
      <Form.Item name={"cid"} rules={[{ required: true }]}>
        <Transfer
          dataSource={mockData}
          showSearch
          filterOption={filterOption}
          targetKeys={targetKeys}
          onChange={handleChange}
          onSearch={handleSearch}
          render={(item) => item.title}
        />
      </Form.Item>

      {/* <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item> */}
    </Form>
  );
};

const GroupManagementC = () => {
  const [form] = Form.useForm();
  const { state } = useContext(Context);
  const NodeUrl = `/cmd?get={"nodeInf":{"nodeInf":{"cid":{},"gid":{},"token":{},"id":{}}}}`;
  const [Nodeloading, Noderesponse] = useURLloader(NodeUrl);
  const cid = localStorage.getItem("authUser.cid");
  const getGroupUrl =
    cid === "proscend"
      ? `/device_mgnt/group?list_group={${state.Login.Cid}}`
      : `/device_mgnt/group?list_group={"cid":"${cid}"}`;
  const [Grouploading, Groupresponse] = useURLloader(getGroupUrl);
  const [NodeList, setNodeList] = useState([]);
  const [GroupList, setGroupList] = useState([
    { cid: "", gid: "", node_list: [""], key: "" },
  ]);
  const [EditGroupVisible, setEditGroupVisible] = useState(false);
  const [record, setRecord] = useState([]);

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
  const EditGrouponFinish = (values) => {};

  const onFinish = (values) => {
    console.log("Received values of form:", values);
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
    axios.get(CreateGroupUrl).then((res) => {
      console.log(res);
    });
  };

  function tagRender(props) {
    const { label, value, closable, onClose } = props;
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
    },
    {
      title: "Device",
      dataIndex: ["node_list"],
      key: "node_list",
      render: (text, record) => {
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
      render: (text, record) => {
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
            <Button>Delete</Button>
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <Modal
        title="Edit Group"
        visible={EditGroupVisible}
        onOk={() => setEditGroupVisible(false)}
        onCancel={() => setEditGroupVisible(false)}
        okButtonProps={{
          form: "EditGroup",
          key: "submit",
          htmlType: "submit",
        }}
        okText="Create"
        cancelText="Cancel"
      >
        <EditGroupForm
          form={form}
          record={record}
          onFinish={onFinish}
        />
      </Modal>
      <Card loading={Nodeloading}>
        <Form
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
                //   className={styles.clickBtn}
              >
                Submit
              </Button>
            </Form.Item>
          </div>
        </Form>
      </Card>
      <Card loading={Grouploading}>
        <Collapse defaultActiveKey={["0"]} onChange={callback}>
          {GroupList.map((item, index) => {
            //   console.log(item)
            return (
              <Panel key={index} header={item.cid}>
                <Table
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

// /device_mgnt/group?create_group={"cid":"12345678901234567890123456789011", "group_list":[{"name":"g1","node_list":["012C100000000001","012C100000000002"]}, {"name":"g2","node_list":["012C100000000001"]}]}
// /device_mgnt/group?modify_group={"cid":"12345678901234567890123456789011", "group_list":[{"name":"g1","node_list":["012C100000000003","012C100000000004"]}, {"name":"g2","node_list":[]}]}
// /device_mgnt/group?delete_group={"cid":"12345678901234567890123456789011", "group_list":[{"name":"g1"}, {"name":"g2"}]}
// /device_mgnt/group?list_group={} # {"response": {"cid":"12345678901234567890123456789011", "group_list":[{"name":"g1","node_list":["012C100000000003","012C100000000004"]}, {"name":"g2","node_list":[]}]}}
