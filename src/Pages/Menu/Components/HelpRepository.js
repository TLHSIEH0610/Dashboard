import React, { Fragment } from "react";
import styles from "../menu.module.scss";
import { Button, Descriptions } from "antd";
import { FcDeleteDatabase, FcDownload } from "react-icons/fc";

const HelpRepository = () => {
  return (
    <Fragment>
      <div className={styles.helpContainer}>
        <h2 className={styles.title}>File Repository</h2>
        <img
        alt=''
          className={styles.repository}
          src={require("../../../image/repository.png")}
        />
        {/* <h2 className={styles.title}>Action Request</h2> */}
        {/* <p>Allow user to batch upgrade/backup/restore</p> */}
        <Descriptions
          className={styles.Description}
          bordered={true}
          column={{ xxl: 1, xl: 1, lg: 1, md: 1, sm: 1, xs: 1 }}
        >
          <Descriptions.Item label="Item" className={styles.tableheader}>
            Description
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>1</span>
                <span>Upload</span>
              </Fragment>
            }
          >
            <p>(1)Select and upload a file from your local site</p>
            <p>(2)Select device model which the file is used for</p>
            <p>(3)Input a file name</p>
            <p>(4)Select File Type (cfg: restore, fw: upgrade, yml: setting document) </p>
            <p>*O'smart will automatically calculate an MD5 code if FileType is selected as 'fw'. You may check it in the Modal right away or view it later on by hovering upon the filename.</p>
            <img
            alt=''
              className={styles.uploadfile}
              src={require("../../../image/uploadfile.png")}
            />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>2</span>
                <span>FileName</span>
                

              </Fragment>
            }
          >
            <p>FileName, hover to view MD5 for fw file</p>
            <img
            alt=''
              className={styles.repositoryMD5}
              src={require("../../../image/repositoryMD5.png")}
            />
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>3</span>
                <span>FileType</span>
              </Fragment>
            }
          >
            <p>cfg is for restore purpose; fw is for upgrade, and ymlis for storing the setting document</p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>4</span>
                <span>Create Date</span>
              </Fragment>
            }
          >
            <p>Date of file uploaded</p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>5</span>
                <span>Download File</span>
              </Fragment>
            }
          >
            <p>
              Click <Button icon={<FcDownload />}></Button> to download file
            </p>
          </Descriptions.Item>
          <Descriptions.Item
            label={
              <Fragment>
                <span className={styles.index}>6</span>
                <span>Delete File</span>
              </Fragment>
            }
          >
            <p>
              Click <Button icon={<FcDeleteDatabase />}></Button> to delete file
            </p>
          </Descriptions.Item>
        </Descriptions>
      </div>
    </Fragment>
  );
};

export default HelpRepository;
