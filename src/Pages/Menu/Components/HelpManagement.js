import React, { Fragment } from "react";
import { Descriptions, Divider } from "antd";
import styles from "../menu.module.scss";
import { RiEdit2Fill } from "react-icons/ri";
import {
  FcKey,
  FcTimeline,
  FcConferenceCall,
  FcSpeaker,
  FcFinePrint,
} from "react-icons/fc";
import { ImCross } from "react-icons/im";

const HelpManagement = () => {

  return (
    <div className={styles.helpContainer}>
      <h2 className={styles.title}>Overview</h2>
      <p>Manage Company Information, Users, Groups, Key, and Notification here.</p>
      <img
      alt=''
        className={styles.management}
        src={require("../../../image/management.png")}
      />

      <Descriptions
        // title="Router Information"
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
              <span>Create Customer</span>
            </Fragment>
          }
        >
          <p>Create a new customer in O'smart. Some default settings of device periods may also be required at this step. </p>
          {/* <p>*period alive stand for the timeout in second which O'smart will try connecting with the device continuously within this period</p> */}
          <img
          alt=''
            className={styles.createCustomer}
            style={{ display: "block" }}
            src={require("../../../image/createCustomer.png")}
          />
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Fragment>
              <span className={styles.index}>2</span>
              <span>Customer</span>
            </Fragment>
          }
        >
          Company Name 
        </Descriptions.Item>
        <Descriptions.Item
          label={
            <Fragment>
              <span className={styles.index}>3</span>
              <span>Operation</span>
            </Fragment>
          }
        >
          <h3>
            <RiEdit2Fill className={styles.EditIcon} />
            <span>Edit Customer:</span>
          </h3>
          <p>Update Customer's Information</p>
          <img
          alt=''
            className={styles.editCustomerInfo}
            src={require("../../../image/editCustomerInfo.png")}
          />
          <Divider />

          <h3>
            <FcTimeline className={styles.ViewSchemeIcon} />
            <span>Scheme:</span>
          </h3>
          <p>Currently only allow to set/update period related settings</p>
          <img
          alt=''
            className={styles.scheme}
            src={require("../../../image/scheme.png")}
          />
          <Divider />

          <h3>
            <img
            alt=''
              src={require("../../../image/customer.png")}
              className={styles.CreateUserIcon}
            />
            <span>User Management:</span>
          </h3>
          <p>Create User</p>
          <p>(1)Click 'Add User' to create more users.</p>
          <p>
            (2)Input Name, Password, Level, Group (optional, leave blanket to see
            all groups as default) then click 'Submit' button.
          </p>
          <img
          alt=''
            className={styles.createUser}
            src={require("../../../image/createUser.png")}
            style={{ display: "block" }}
          />
          <p style={{marginTop:'10px'}}>Edit User</p>
          <p>Modify user's password, groups, level, or delete users that no longer in use</p>
          <img
          alt=''
            className={styles.editUser}
            src={require("../../../image/editUser.png")}
            style={{ display: "block" }}
          />

          <Divider />

          <h3>
            <FcConferenceCall className={styles.EditGroupIcon} />
            <span>Group Management:</span>
          </h3>
          <p>Create Group</p>
          <p>A group can contain multiple devices, and users who belong to the group are only allowed to access those specific devices. </p>
          <img
          alt=''
            className={styles.createGroup}
            src={require("../../../image/createGroup.png")}
            style={{ display: "block" }}
          />
          <p style={{marginTop:'10px'}}>Edit Group</p>
          <p>Change or delete groups</p>
          <img
          alt=''
            className={styles.editGroup}
            src={require("../../../image/editGroup.png")}
            style={{ display: "block" }}
          />

          <Divider />

          <h3>
            <FcKey className={styles.TokenIcon} />
            <span>Key Management:</span>
          </h3>
          <p style={{marginTop:'10px', marginBottom:'-4px'}}>Token:</p>
          <p>Used for devices to connect to O'smart</p>
          <img
          alt=''
            className={styles.token}
            style={{ display: "block" }}
            src={require("../../../image/token.png")}
          />
          <p style={{marginTop:'10px', marginBottom:'-4px'}}>API key</p>
          <p>Google API key is for Geocoding service to reverse coordinate to location. If you are using the location function in the Topology section, you may need to apply for an API Key.</p>
          <img
          alt=''
            className={styles.APIkey}
            style={{ display: "block" }}
            src={require("../../../image/APIkey.png")}
          />
          <Divider />

          <h3>
            <FcSpeaker className={styles.NotificationIcon} />
            <span>Notification:</span>
          </h3>
          <p>Setting the criteria to be informed when alarm triggered.</p>
          <img
          alt=''
            className={styles.notification.png}
            src={require("../../../image/notification.png")}
          />
          <Divider />

          <h3>
            <FcFinePrint className={styles.ViewSchemeIcon} />
            <span>Event Log:</span>
          </h3>
          <p>Every operation log among  O'smart management will be recorded here.</p>
          <Divider />

          <h3>
            <ImCross className={styles.DeleteIcon} />
            <span>Delete Customer:</span>
          </h3>
          <p>Once the customer has been deleted, all information will be erased as well.  </p>

          <Divider />
        </Descriptions.Item>
      </Descriptions>
    </div>
  );
};

export default HelpManagement;
