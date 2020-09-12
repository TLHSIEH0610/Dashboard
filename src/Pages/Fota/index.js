import React, { Fragment } from 'react'
import Fota_Input from '../../Components/_Specific/Fota_Input/fota_input'
import styles from './fota.module.scss'

const Fota = () => {


  return (
    <Fragment>
      <div className={styles.wrap}>
       <Fota_Input/>
      </div>
    </Fragment>
  );
};

export default Fota