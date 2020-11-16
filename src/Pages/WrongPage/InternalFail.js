import React, { Fragment  } from "react";
import { Result, Button } from "antd";
import { useHistory } from "react-router-dom"

const InternalError = () => {
    let history = useHistory()
  return (
    <Fragment>
      <Result
        status="500"
        title="500"
        subTitle="Sorry, something went wrong."
        extra={<Button type="primary" onClick={()=>{history.push('/') }}>Back Home</Button>}
      />
    </Fragment>
  );
};

export default InternalError;
