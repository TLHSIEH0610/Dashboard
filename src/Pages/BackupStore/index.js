import React, { Fragment } from 'react'
import AllinOne from '../../Components/_Specific/DeviceBackup/AllinOne'
import AllinOne_test from '../../Components/_Specific/DeviceBackup/AllinOne_test'
import ActionStatus from '../../Components/_Specific/DeviceBackup/ActionStatus'
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
        <Tabs defaultActiveKey="4" className={styles.tabs}>
          <TabPane
            tab={
              <span className={styles.TabPane}>
                <MdBackup className={styles.icon} />
                   Request
              </span>
            }
            key="1"
          >
            <div className={styles.wrap}>
              <AllinOne />
              <ActionStatus/>
            </div>
          </TabPane>
          <TabPane
            tab={
              <span className={styles.TabPane}>
                <MdSettingsBackupRestore className={styles.icon} />
          Repository
        </span>
            }
            key="2"
          >
            <div className={styles.wrap}>
              <CloudList />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span className={styles.TabPane}>
                <GrDocumentImage className={styles.icon} />
          FOTA
        </span>
            }
            key="3"
          >
            <div className={styles.wrap}>
              <Fota_Input />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span className={styles.TabPane}>
                <GrDocumentImage className={styles.icon} />
          Req test
        </span>
            }
            key="4"
          >
            <div className={styles.wrap}>
              <AllinOne_test />
              <ActionStatus/>
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
};

export default Backup