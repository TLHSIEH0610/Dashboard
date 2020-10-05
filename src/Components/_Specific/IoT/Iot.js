import React, { Fragment, useEffect, useState } from "react";
import axios from "axios";
import styles from "./Iot.module.scss";
import { Card } from "antd";
import { FaTemperatureHigh, FaTruckMoving } from 'react-icons/fa'
import { ImDroplet } from 'react-icons/im'
import {MdBrightnessMedium} from 'react-icons/md'
import {SiApacheairflow} from 'react-icons/si'
import {IoMdInformationCircle} from 'react-icons/io'

const { Meta } = Card;
const IoTC = () => {

  return (
    <Fragment>
      <Card className={styles.Card} bodyStyle={{width:'100%'}}  title='IoT Summary'>
        <Card className={styles.subCard} type="inner" > 
        <Meta
            avatar={
              <FaTemperatureHigh className={styles.Icon}/>
            }
            title="Thermal"
            description="33"
          />
        </Card>
        <Card className={styles.subCard} type="inner"> 
        <Meta
            avatar={
              <ImDroplet className={styles.Icon}/>
            }
            title="Humidity"
            description="33"
          />
        </Card>
        <Card className={styles.subCard} type="inner"> 
        <Meta
            avatar={
              <MdBrightnessMedium className={styles.Icon}/>
            }
            title="Light"
            description="33"
          />
        </Card>
        <Card className={styles.subCard} type="inner"> 
        <Meta
            avatar={
              <SiApacheairflow className={styles.Icon}/>
            }
            title="Air"
            description="33"
          />
        </Card>
        <Card className={styles.subCard} type="inner"> 
        <Meta
            avatar={
              <FaTruckMoving className={styles.Icon}/>
            }
            title="Motion"
            description="33"
          />
        </Card>
        <Card className={styles.subCard} type="inner"> 
        <Meta
            avatar={
              <IoMdInformationCircle className={styles.Icon}/>
            }
            title="Others"
            description="33"
          />
        </Card>
      </Card>
    </Fragment>
  );
};

export default IoTC;
