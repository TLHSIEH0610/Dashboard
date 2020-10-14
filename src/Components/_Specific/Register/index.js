import React, { useState, Fragment } from "react";
import {
  Card,
  Steps,
  Button,
  message,
  Result,
  Form,
  Input,
  Col,
  Row,
  Rate,
  List,
} from "antd";
import styles from "./register.module.scss";
import { GoVerified } from "react-icons/go";
import { FaFly, FaCrown } from 'react-icons/fa'
import { IoIosRocket } from 'react-icons/io'
const { Step } = Steps;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 8,
    },
    sm: {
      span: 6,
    },
  },
  wrapperCol: {
    xs: {
      span: 16,
    },
    sm: {
      span: 12,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const onFinish = (values) => {
  console.log("Received values of form: ", values);
};

const RegisterC = () => {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const next = () => {
    const Newcurrent = current;
    setCurrent(Newcurrent + 1);
  };

  const prev = () => {
    const Newcurrent = current;
    setCurrent(Newcurrent - 1);
  };

  const Essential = [
    "30-Day trail",
    "100 Routers",
    "Backup",
    "FOTA",
    "IoT",
    "GPS Track",
  ];

  const Deluxe = [
    "100k / month",
    "10000 Routers",
    "Backup",
    "FOTA",
    "IoT",
    "GPS Track",
  ];

  const Platinum = [
    "10000k / month",
    "unlimited Routers",
    "Backup",
    "FOTA",
    "IoT",
    "GPS Track",
  ];

  const steps = [
    {
      title: "Account Register",
      content: (
        <Form
          {...formItemLayout}
          form={form}
          name="register"
          onFinish={onFinish}
          scrollToFirstError
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
              {
                required: true,
                message: "Please input your E-mail!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: "Please input your password!",
              },
            ]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={["password"]}
            hasFeedback
            rules={[
              {
                required: true,
                message: "Please confirm your password!",
              },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    "The two passwords that you entered do not match!"
                  );
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="company"
            label="Company"
            rules={[
              {
                required: true,
                message: "Please input your company!",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="contact"
            label="Contact Person"
            rules={[
              {
                required: true,
                message: "Please input a contact person",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone Number"
            rules={[
              {
                required: true,
                message: "Please input your phone number!",
              },
            ]}
          >
            <Input
              style={{
                width: "100%",
              }}
            />
          </Form.Item>
          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" htmlType="submit">
              Register
            </Button>
          </Form.Item>
        </Form>
      ),
    },
    {
      title: "Selecte a Package",
      content: (
        <div className="site-card-wrapper">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} justify="space-around">
            <Col className="gutter-row" span={7}>
              <Card
                bordered={false}
                bodyStyle={{ padding: 0 }}
                style={{ borderRadius: "15px", overflow: "hidden" }}
                hoverable={true}
              >
                <>
                  {/* <Divider orientation="left"></Divider> */}
                  <List
                    size="large"
                    header={
                      <Fragment>
                        <div
                          className={styles.ListHeader}
                          style={{ background: "#1E90FF", color: "white" }}
                        >
                          <div className={styles.HeaderIcon}><FaFly style={{  fontSize: '55px' }}/></div>
                           <p>Essential</p> 
                        </div>
                        <Rate
                          disabled
                          defaultValue={2.5}
                          className={styles.HeaderRate}
                          
                        />
                      </Fragment>
                    }
                    footer={
                      <Fragment>
                        <div className={styles.Btnbackgroupd}><Button className={styles.planBtn} style={{ background: "#1E90FF", color:'white' }}>Select this plan!</Button></div>
                      <div
                        className={styles.ListFooter}
                        style={{ background: "#1e90ff" }}
                      >
                        {/* <a href="#"> */}
                          <span style={{ color: "white" }}>
                            See more detail!
                          </span>
                        {/* </a> */}
                      </div>
                      </Fragment>
                    }
                    bordered={false}
                    dataSource={Essential}
                    renderItem={(item) => (
                      <List.Item className={styles.listItems}>
                        <p>{item}</p>
                        {(item === "Backup" ||
                          item === "30-Day trail" ||
                          item === "100 Routers") && (
                          <GoVerified className={styles.Essentialv} />
                        )}
                        {(item === "IoT" ||
                          item === "FOTA" ||
                          item === "GPS Track") && (
                          <GoVerified className={styles.Essentialx} />
                        )}
                      </List.Item>
                    )}
                  />
                </>
              </Card>
            </Col>
            <Col className="gutter-row" span={7}>
              <Card
                bordered={false}
                bodyStyle={{ padding: 0 }}
                style={{ borderRadius: "15px", overflow: "hidden" }}
                hoverable={true}
              >
                <>
                  {/* <Divider orientation="left"></Divider> */}
                  <List
                    size="large"
                    header={
                      <Fragment>
                        <div
                          className={styles.ListHeader}
                          style={{ background: "#32CD32", color: "white" }}
                        >
                          <div className={styles.HeaderIcon} style={{ background:'#32CD32'}}><IoIosRocket style={{ fontSize: '55px' }}/></div>
                           <p>Deluxe</p> 
                        </div>
                        <Rate
                          disabled
                          defaultValue={3.5}
                          className={styles.HeaderRate}
                          
                        />
                      </Fragment>
                    }
                    footer={
                      <Fragment>
                        <div className={styles.Btnbackgroupd}><Button className={styles.planBtn} style={{ background: "#32CD32", color:'white' }}>Select this plan!</Button></div>
                      <div
                        className={styles.ListFooter}
                        style={{ background: "#32CD32" }}
                      >
                        {/* <a href="#"> */}
                          <span style={{ color: "white" }}>
                            See more detail!
                          </span>
                        {/* </a> */}
                      </div>
                      </Fragment>
                    }
                    bordered={false}
                    dataSource={Deluxe}
                    renderItem={(item) => (
                      <List.Item className={styles.listItems}>
                        <p>{item}</p>
                        {(item === "Backup" ||
                          item === "100k / month" ||
                          item === "FOTA" ||
                          item === "10000 Routers") && (
                          <GoVerified className={styles.Deluxev} />
                        )}
                        {(item === "IoT" ||
                          item === "GPS Track") && (
                          <GoVerified className={styles.Deluxex} />
                        )}
                      </List.Item>
                    )}
                  />
                </>
              </Card>
            </Col>
            <Col className="gutter-row" span={7}>
           <Card
                bordered={false}
                bodyStyle={{ padding: 0 }}
                style={{ borderRadius: "15px", overflow: "hidden" }}
                hoverable={true}
              >
                <>
                  {/* <Divider orientation="left"></Divider> */}
                  <List
                    size="large"
                    header={
                      <Fragment>
                        <div
                          className={styles.ListHeader}
                          style={{ background: "#FFD700", color: "brown" }}
                        >
                          <div className={styles.HeaderIcon} style={{background:'#FFD700'}}><FaCrown style={{ fontSize: '55px' }}/></div>
                           <p>Platinum</p> 
                        </div>
                        <Rate
                          disabled
                          defaultValue={5}
                          className={styles.HeaderRate}
                        />
                      </Fragment>
                    }
                    footer={
                      <Fragment>
                        <div className={styles.Btnbackgroupd}><Button className={styles.planBtn} style={{ background: "#FFD700", color:'brown' }}>Select this plan!</Button></div>
                      <div
                        className={styles.ListFooter}
                        style={{ background: "#FFD700" }}
                      >
                        {/* <a href="#"> */}
                          <span style={{ color: "brown" }}>
                            See more detail!
                          </span>
                        {/* </a> */}
                      </div>
                      </Fragment>
                    }
                    bordered={false}
                    dataSource={Platinum}
                    renderItem={(item) => (
                      <List.Item className={styles.listItems}>
                        <p>{item}</p>
                        {(item === "Backup" ||
                          item === "10000k / month" ||
                          item === "unlimited Routers" ||
                          item === "IoT" ||
                          item === "FOTA" ||
                          item === "GPS Track") && (
                          <GoVerified className={styles.Platinumv} />
                        )}
                      </List.Item>
                    )}
                  />
                </>
              </Card>
            </Col>
          </Row>
        </div>
      ),
    },
    {
      title: "Complete!",
      content: (
        <div>
          <Result
            status="success"
            title="Successfully register an account"
            subTitle="You can now start using ISMS server!"
            extra={[
              <Button type="primary" key="login">
                Go to Login
              </Button>,
            ]}
          />
        </div>
      ),
    },
  ];

  return (
    <Card>
      <>
        <Steps current={current}>
          {steps.map((item) => (
            <Step key={item.title} title={item.title} />
          ))}
        </Steps>
        <div className={styles.stepsContent}>{steps[current].content}</div>
        <div className={styles.stepsAction}>
          {current < steps.length - 1 && (
            <Button type="primary" onClick={() => next()}>
              Next
            </Button>
          )}
          {current === steps.length - 1 && (
            <Button
              type="primary"
              onClick={() => message.success("Processing complete!")}
            >
              Done
            </Button>
          )}
          {current > 0 && (
            <Button style={{ margin: "0 8px" }} onClick={() => prev()}>
              Previous
            </Button>
          )}
        </div>
      </>
    </Card>
  );
};

export default RegisterC;
