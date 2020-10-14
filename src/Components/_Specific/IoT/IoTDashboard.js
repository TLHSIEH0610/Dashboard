import React, { Fragment, useContext } from "react";
import styles from "./IoTDashboard.module.scss";
import { Card } from "antd";
import { FaTemperatureHigh } from 'react-icons/fa'
import { MdBrightnessMedium } from 'react-icons/md'
import { FcChargeBattery, FcIdea, FcInTransit, FcFlashOn } from 'react-icons/fc'
import Context from '../../../Utility/Reduxx'

const { Meta } = Card;
const IoTDashboard = () => {
  const { state } = useContext(Context)
  console.log(state.Global)
  return (
    <Fragment>
      <Card className={styles.Card}>
        <Card className={styles.subCard} type="inner" > 
        <Meta
            avatar={
              <FaTemperatureHigh className={styles.Icon}/>
            }
            title={state.Global.innerWidth>1200 && "Temperature"}
            description="40(c)"
          />
        </Card>
        <Card className={styles.subCard} type="inner"> 
        <Meta
            avatar={
              <FcFlashOn className={styles.Icon}/>
            }
            title={state.Global.innerWidth>1200 && "Voltage"}
            description="12(v)"
          />
        </Card>
        <Card className={styles.subCard} type="inner"> 
        <Meta
            avatar={
              <MdBrightnessMedium className={styles.Icon} style={{color:'red'}}/>
            }
            title={state.Global.innerWidth>1200 && "Light"}
            description="98(%)"
          />
        </Card>
        <Card className={styles.subCard} type="inner"> 
        <Meta
            avatar={
              <FcChargeBattery className={styles.Icon}/>
            }
            title={state.Global.innerWidth>1200 && "Charge"}
            description="33(w)"
          />
        </Card>
        <Card className={styles.subCard} type="inner"> 
        <Meta
            avatar={
              <FcIdea className={styles.Icon}/>
            }
            title={state.Global.innerWidth>1200 && "Load"}
            description="15(w)"
          />
        </Card>
        <Card className={styles.subCard} type="inner"> 
        <Meta
            avatar={
              <FcInTransit className={styles.Icon}/>
            }
            title={state.Global.innerWidth>1200 && "Shift"}
            description="0(m)"
          />
        </Card>
      </Card>
    </Fragment>
  );
};

export default IoTDashboard;
