import React from "react";
import styles from "../topology.module.scss";
import { Form, Row, Col, Input, Divider, InputNumber } from "antd";

const BulkConfigFPeriod = ({ SubmitConfigonFinish, form }) => {
  return (
    <Form onFinish={SubmitConfigonFinish} form={form}>
      <div className={`${styles.FormWrapper} ${styles.BulkFormWrapper}`}>
        <Row gutter={24} justify="space-around">
          <Col xs={24} sm={24} md={24} lg={24} xl={10}>
            <h2>Alive </h2>
            <Divider className={styles.divider} />
            <Form.Item
              name={"alive"}
              label="Alive Period"
              rules={[{ required: true, message: "required!" }]}
            >
              <InputNumber keyboard={false} style={{width:'100%'}} placeholder="30" min={30} step={30} />
            </Form.Item>
            <h2>Status </h2>
            <Divider className={styles.divider} />
            <Form.Item
              name={"status"}
              label="Status Period"
              rules={[{ required: true, message: "required!" }]}
            >
              <Input placeholder="30" />
            </Form.Item>
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={10}>
          <h2>IoT </h2>
            <Divider className={styles.divider} />
            <Form.Item
              name={"iot"}
              label="IoT Period"
              rules={[{ required: true, message: "required!" }]}
            >
              <Input placeholder="30" />
            </Form.Item>
            <h2>GPS </h2>
            <Divider className={styles.divider} />
            <Form.Item
              name={"gps"}
              label="GPS Period"
              rules={[{ required: true, message: "required!" }]}
            >
              <Input placeholder="30" />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </Form>
  );
};

export default BulkConfigFPeriod;

///////////////////////////////////////////////////////////////////////////////////////

export function PeriodJSON(values) {
  return `"report_period":{"alive":${values.alive},"timeout":${
    values.alive + 30
  }, "status":${values.status},"iot":${values.iot},"gps":${values.gps}}`;
}