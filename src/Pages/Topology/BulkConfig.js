import { BulkConfigMC } from "../../Components/_Specific/Topology/components/BulkConfigC";
import React, { Fragment } from "react";
import { Breadcrumb } from 'antd'
import { useHistory } from 'react-router-dom'

const BulkConfig = () => {
    const history = useHistory()
  return (
    <Fragment>
      <Breadcrumb style={{ marginBottom: "20px" }}>
        <Breadcrumb.Item style={{ fontWeight: 500, fontSize: 16 }}>
          <a href="/#" onClick={(e) => {e.preventDefault();history.push("./topology")}}>
            Topology
          </a>
        </Breadcrumb.Item>
        <Breadcrumb.Item
          style={{ color: "#1890ff", fontWeight: 500, fontSize: 16 }}
        >
          Bulk Config
        </Breadcrumb.Item>
      </Breadcrumb>
      <BulkConfigMC />
    </Fragment>
  );
};

export default BulkConfig;
