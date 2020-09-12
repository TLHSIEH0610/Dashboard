import React, { Fragment } from 'react'
import AllinOne from '../../Components/_Specific/DeviceBackup/AllinOne'
import styles from './backupstore.module.scss'
import { Tabs } from 'antd';
import { MdBackup, MdSettingsBackupRestore } from 'react-icons/md'
import { GrDocumentImage } from 'react-icons/gr'
import Fota_Input from '../../Components/_Specific/Fota_Input/fota_input'
import CloudList from '../../Components/_Specific/CloudLibary/cloud'

const { TabPane } = Tabs;
const Backup = () => {


  return (
    <Fragment>
      <div className={styles.container}>
        <Tabs defaultActiveKey="1" >
          <TabPane
            tab={
              <span>
                <MdBackup className={styles.icon} />
                   Request
              </span>
            }
            key="1"
          >
            <div className={styles.wrap}>
              <div><AllinOne /></div>
            </div>

          </TabPane>
          <TabPane
            tab={
              <span>
                <MdSettingsBackupRestore className={styles.icon} />
          Repository
        </span>
            }
            key="2"
          >
            <div className={styles.wrap}>
              <div><CloudList /></div>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span>
                <GrDocumentImage className={styles.icon} />
          FOTA
        </span>
            }
            key="3"
          >

            <div className={styles.wrap}>
              <div><Fota_Input /></div>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
};

export default Backup