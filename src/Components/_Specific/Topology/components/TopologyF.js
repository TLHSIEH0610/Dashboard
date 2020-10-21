import React from "react";
import styles from "../topology.module.scss";
import {
  MdSignalCellularConnectedNoInternet0Bar,
  MdSignalCellular1Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
} from "react-icons/md";
import {} from 'react-icons/bs'
import { ImCircleDown, ImCancelCircle } from "react-icons/im";
import { AiFillWarning } from "react-icons/ai";

export function healthIcon(health) {
  switch (health) {
    case "up":
      return (
        // <div className={styles.iconwrapper}>
          <ImCircleDown className={styles.up} />

        // </div>
      );
    case "critical":
      return (
        // <div className={styles.iconwrapper}>
          <AiFillWarning className={styles.critical} />

        // </div>
      );
    case "warning":
      return (
        // <div className={styles.iconwrapper}>
          <AiFillWarning className={styles.warning} />
        // </div>
      );
    case "offline":
      return (
        // <div className={styles.iconwrapper}>
          <ImCancelCircle className={styles.offline} />
        // </div>
      );
      default:
        return
  }

};
export function strengthIcon(strength) {
  switch (strength) {
    case "excellent":
      return (
        // <div className={styles.iconwrapper}>
          <MdSignalCellular4Bar className={styles.up} />
        // </div>
      );
    case "good":
      return (
        // <div className={styles.iconwrapper}>
          <MdSignalCellular3Bar className={styles.critical} />
        // </div>
      );
    case "fair":
      return (
        // <div className={styles.iconwrapper}>
          <MdSignalCellular1Bar className={styles.warning} />
        // </div>
      );
    case "poor":
      return (
        // <div className={styles.iconwrapper}>
          <MdSignalCellularConnectedNoInternet0Bar className={styles.offline} />
        // </div>
      );
      default:
        return
  }
}
