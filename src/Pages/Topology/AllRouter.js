import { ViewAllStatusMC } from "../../Components/_Specific/Topology/components/ViewAllStatusC";
import React, { Fragment } from "react";
import { Breadcrumb } from 'antd'
import { useHistory } from 'react-router-dom'

const AllRouter = () => {
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
          All Routers
        </Breadcrumb.Item>
      </Breadcrumb>
      <ViewAllStatusMC />
    </Fragment>
  );
};

export default AllRouter;
