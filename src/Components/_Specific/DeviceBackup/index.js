import React, { Fragment, useState } from 'react'
import BkRsUgC from './Components/BkRsUgC'
import ActionStatusC from './Components/ActionStatus'
import RepositoryC from './Components/Repository'
import styles from "./devicebackup.module.scss";
import { Tabs } from 'antd';
import { MdBackup, MdSettingsBackupRestore } from 'react-icons/md'
import Fota_Input from '../Fota_Input/fota_input'
import { FaDatabase } from 'react-icons/fa'
import { Translator } from '../../../i18n/index'

const { TabPane } = Tabs;
const AllinOneC = () => {
  const [uploading, setUploading] = useState(false)  

  return (
    <Fragment>
      <div className={styles.container}>
        <Tabs defaultActiveKey="1" className={styles.tabs}>
          <TabPane
            tab={
              <span className={styles.TabPane}>
                <MdBackup className={styles.Tabicon} />
                    {Translator("ISMS.Upgrade")}
              </span>
            }
            key="1"
          >
            <div className={styles.wrap}>
              <BkRsUgC  uploading= {uploading} setUploading={setUploading} />
              <ActionStatusC uploading= {uploading} setUploading={setUploading} />
            </div>
          </TabPane>
          <TabPane
            tab={
              <span className={styles.TabPane}>
                <FaDatabase className={styles.Tabicon} />
          {Translator("ISMS.Repository")}
        </span>
            }
            key="2"
          >
            <div className={styles.wrap}>
              <RepositoryC uploading= {uploading} setUploading={setUploading}/>
            </div>
          </TabPane>
          <TabPane
            disabled  
            tab={
              <span className={styles.TabPane}>
                <MdSettingsBackupRestore className={styles.Tabicon} style={{color:'lightgray', fontSize:'2.4rem'}}/>
          {Translator("ISMS.FOTA")}
        </span>
            }
            key="3"
          >
            <div className={styles.wrap}>
              <Fota_Input />
            </div>
          </TabPane>
        </Tabs>
      </div>
    </Fragment>
  );
};

export default AllinOneC