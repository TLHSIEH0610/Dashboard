import React, { useEffect, useState, useContext, Fragment } from "react";
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
  Col,
  Row,
  Divider
} from "antd";
import styles from "../management.module.scss";
import axios from "axios";
import { UserLogOut } from "../../../../Utility/Fetch";
import { useHistory } from "react-router-dom";
import Context from "../../../../Utility/Reduxx";
import { RiEdit2Fill } from "react-icons/ri";
import { ImCross } from "react-icons/im";
import { useTranslation } from 'react-i18next';

const { TabPane } = Tabs;
const { Option } = Select;

const EditGroupModalC = ({
  GroupModalvisible,
  setGroupModalvisible,
  record,
  setRecord,
}) => {
  const { dispatch } = useContext(Context);
  const [EditGroupform] = Form.useForm();
  const [CreateGroupform] = Form.useForm();
  const [uploading, setUploading] = useState(false);
  const [IsUpdate, setIsUpdate] = useState(false);
  const [GroupData, setGroupData] = useState([{ name: "", node_list: [] }]);
  const [NodeList, setNodeList] = useState([]);
  const [FilterNodeList, setFilterNodeList] = useState(undefined);
  const [currentPage, setCurrentPage] = useState("1");
  const [CityList, setCityList] = useState(undefined);
  const history = useHistory();
  const { t } = useTranslation();

  useEffect(() => {
    if (record.cid) {
      setUploading(true);
      const config1 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/cmd",
        data: JSON.parse(
          `{"get":{"nodeInf":{"filter":{"cid":"${record.cid}"},"nodeInf":{"city":{},"id":{}}}}}`
        ),
      };
      const config2 = {
        method: "post",
        headers: { "Content-Type": "application/json" },
        url: "/device_mgnt/group",
        data: JSON.parse(`{"list_group":{"cid":"${record.cid}"}}`),
      };

      function NodeUrl() {
        return axios(config1);
      }
      function getGroupUrl() {
        return axios(config2);
      }
      axios
        .all([NodeUrl(), getGroupUrl()])
        .then(
          axios.spread((acct, perms) => {
            if (acct.data?.response?.nodeInf) {
              let NodeList = [];
              let CityList = new Set();
              acct.data.response.nodeInf.map((item, index) => {
                CityList.add(
                  item.nodeInf.city
                    ? item.nodeInf.city
                    : null
                );
                NodeList.push({
                  key: index,
                  id: item.nodeInf.id,
                  city: item.nodeInf.city,
                });
              });
              CityList = Array.from(CityList);
              setCityList(CityList);
              // console.log(CityList)
              if(CityList?.[0]!==null){
                CreateGroupform.setFieldsValue({city: CityList})
              }
              
              setNodeList(NodeList);
              setFilterNodeList(NodeList);
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
            } else {
              setCityList([])
              setGroupData([]);
              setNodeList([]);
              setFilterNodeList([])
            }

            setUploading(false);
          })
        )
        .catch((error) => {
          console.error(error);
          if (error.response && error.response.status === 401) {
            dispatch({ type: "setLogin", payload: { IsLogin: false } });
            UserLogOut();
            history.push("/userlogin");
          }
          setUploading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [record.cid, IsUpdate]);

  function callback(page) {
    setCurrentPage(page);
  }

  function SelectAll(){
    // console.log(FilterNodeList)
    let SelectAllList = FilterNodeList.map(item=>item.id)
    CreateGroupform.setFieldsValue({
      Device_ID: SelectAllList
    })
  }

  function ClearAll(){
    CreateGroupform.setFieldsValue({
      Device_ID: []
    })
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
        setIsUpdate(!IsUpdate);
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
    // console.log(values);
    setUploading(true);
    const EditGroupUrl = `/device_mgnt/group?modify_group={"cid":"${
      record.cid
    }","group_list":${JSON.stringify(values.Group)}}`;
    // console.log(EditGroupUrl);

    axios
      .post(EditGroupUrl)
      .then(() => {
        message.success("Update successfully.");
        setUploading(false);
        setIsUpdate(!IsUpdate);
        setCurrentPage('2')
        setEditingKey("");
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
        setIsUpdate(!IsUpdate);
        setCurrentPage('2')
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

    /////////////////////////////////////////////////////////////////////////////////////////////////////////


    const [editingKey, setEditingKey] = useState("");

    const edit = (index) => {
      setEditingKey(index);
    };
  
    const cancel = () => {
      setEditingKey("");
    };

  const columns = [
    {
      title:  t("ISMS.Group"),
      dataIndex: "name",
      render: (text, record, index) => {
        return (
          <Fragment>
            {text} 
            <Form.Item
              style={{ display:'none' }}
              className={styles.formitem}
              name={["Group", index, "name"]}
              initialValue={record.name}
            >
              <Input disabled={true} />
            </Form.Item>
          </Fragment>
        );
      },
    },
    {
      title:  t("ISMS.Device"),
      dataIndex: "node_list",
      render: (_, record, index) => {
        return (
          <Fragment>
            {index !== editingKey && record.node_list.map((item,index)=> <Tag  key={index}>{item}</Tag > )}
          <Form.Item
            className={styles.formitem}
            style={index !== editingKey ? {display:'none'}: { marginBottom:0 } } 
            name={["Group", index, "node_list"]}
            rules={[{ required: true, message: "Deivce Id is required!" }]}
            initialValue={record.node_list}
          >
            <Select
              mode="multiple"
              placeholder= {t("ISMS.Select")}
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
          </Fragment>
        );
      },
    },
    {
      title: t("ISMS.Operation"),
      dataIndex: "Operation",
      render: (_, record, index) => {
        return index === editingKey ? (
              <a  href="/#" onClick={(e)=>{
                e.preventDefault();
                EditGroupform.setFieldsValue({
                  Group: GroupData,
                })
                cancel(index)
              }}>Cancel</a>
        ) : (
          <Fragment>
            <Tooltip title={t("ISMS.Edit")}>
              <a
                href="/#"
                onClick={(e) => {
                  e.preventDefault();
                  edit(index);
                }}
              >
                <RiEdit2Fill className={styles.EditIcon} />
              </a>
            </Tooltip>

            <Tooltip title= {t("ISMS.DeleteGroup")}>
              <Popconfirm
              title={t("ISMS.Suretodelete")}
              okText={t("ISMS.OK")}
              cancelText={t("ISMS.Cancel")}
                onConfirm={() => {
                  deleteGroup(record);
                }}
              >
                <ImCross className={styles.DeleteIcon} />
              </Popconfirm>
            </Tooltip> 
          </Fragment>
        );
      },
    },
  ];

  return (
    <Modal
      visible={GroupModalvisible}
      // onOk={() => setGroupModalvisible(false)}
      onCancel={() => {
        setGroupModalvisible(false);
        setRecord({ cid: null });
        CreateGroupform.resetFields();
        setCurrentPage('1')
        setEditingKey('')
      }}
      centered={true}
      className={styles.modal}
      destroyOnClose={true}
      footer={[
        currentPage === "1" && (
          <Button
            loading={uploading}
            key="back"
            type="primary"
            onClick={() => CreateGroupform.submit()}
          >
             {t("ISMS.Submit")}
          </Button>
        ),
        currentPage === "2" && (
          <Button
            key="ok"
            type="primary"
            loading={uploading}
            onClick={() => {
              if(editingKey!==''){
                EditGroupform.submit();
              }else{
                setGroupModalvisible(false);
                setCurrentPage('1')
              }
              
            }}
          >
             {/* {t("ISMS.Submit")} */}
             {editingKey!=='' ? t("ISMS.Submit") : t("ISMS.Confirm")}
          </Button>
        ),
      ]}
    >
      {/* <Card > */}
      <Tabs defaultActiveKey="1" onChange={callback} activeKey={currentPage}>
        <TabPane tab={t("ISMS.Create Group")} key="1">
          {/* <Card loading={Nodeloading || Grouploading} bordered={false}> */}
          <Form
            name="CreateGroup"
            onFinish={CreateGrouponFinish}
            autoComplete="off"
            form={CreateGroupform}
            className={styles.Form}
            layout="vertical"
          >
            <div className={styles.formwrap}>
              <Row gutter={24} justify="flex-start">
                <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                  <Form.Item label={t("ISMS.Location")} name="city">
                    <Select
                      loading={uploading}
                      mode="multiple"
                      placeholder={t("ISMS.Select")}
                      showArrow
                      tagRender={tagRender}
                      maxTagCount={1}
                      onChange={(value) => {
                        console.log(value);
                        let FilterNodeList = NodeList;
                        FilterNodeList = FilterNodeList?.filter((item) =>
                          value.includes(item.city)
                        );
                        setFilterNodeList(FilterNodeList);
                      }}
                    >
                      {CityList?.map((item, index) => {
                        return (
                          <Option key={index} value={item}>
                            {item}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={9} xl={9}>
                  <Form.Item
                    label={t("ISMS.Device")}
                    name="Device_ID"
                    rules={[{ required: true, message: "Deivce is required!" }]}
                  >
                    <Select
                      loading={uploading}
                      mode="multiple"
                      placeholder={t("ISMS.Select")}
                      showArrow
                      tagRender={tagRender}
                      maxTagCount={1}
                      dropdownRender={(menu) => (
                        <Fragment>
                          {menu}
                          <Divider style={{ margin: "4px 0" }} />
                          <Button
                            onClick={() => SelectAll()}
                            style={{ margin: "5px", padding: "3px 5px" }}
                          >
                             {t("ISMS.SelectAll")}
                          </Button>
                          <Button
                            onClick={() => ClearAll()}
                            style={{ margin: "5px", padding: "3px 5px" }}
                          >
                            {t("ISMS.ClearAll")}
                          </Button>
                        </Fragment>
                      )}
                    >
                      {FilterNodeList?.map((item, index) => {
                        return (
                          <Option key={index} value={item.id}>
                            {item.id}
                          </Option>
                        );
                      })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={24} lg={7} xl={7}>
                  <Form.Item
                    label={t("ISMS.GroupName")}
                    name="groupName"
                    rules={[
                      { required: true, message: "Group name is required" },
                    ]}
                  >
                    <Input placeholder={t("ISMS.InputGroupName")} />
                  </Form.Item>
                </Col>
              </Row>
            </div>
          </Form>
        </TabPane>
        <TabPane tab={t("ISMS.EditGroup")} key="2" className={styles.groupPane}>
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
              className={styles.table}
              rowKey={(record)=>record.name}
              rowClassName="editable-row"
            />
          </Form>
        </TabPane>
      </Tabs>
      {/* </Card> */}
    </Modal>
  );
};

export const EditGroupModalMC = React.memo(EditGroupModalC);

