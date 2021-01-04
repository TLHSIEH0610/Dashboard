import React from "react";
import styles from "../topology.module.scss";
import {
  MdSignalCellularConnectedNoInternet0Bar,
  MdSignalCellular1Bar,
  MdSignalCellular3Bar,
  MdSignalCellular4Bar,
} from "react-icons/md";
import {} from 'react-icons/bs'
import { ImCancelCircle } from "react-icons/im";
import { AiFillWarning } from "react-icons/ai";
import { FaCheckCircle } from 'react-icons/fa'

export function healthIcon(health) {
  switch (health) {
    case "up":
      return (
          <FaCheckCircle className={styles.up} />
      );
    case "critical":
      return (
          <AiFillWarning className={styles.critical} />
      );
    case "warning":
      return (
          <AiFillWarning className={styles.warning} />
      );
    case "offline":
      return (
          <ImCancelCircle className={styles.offline} />
      );
      default:
        return
  }

};
export function strengthIcon(strength) {
  switch (strength) {
    case "excellent":
      return (
          <MdSignalCellular4Bar className={styles.up} />
      );
    case "good":
      return (
          <MdSignalCellular3Bar className={styles.critical} />
      );
    case "fair":
      return (
          <MdSignalCellular1Bar className={styles.warning} />
      );
    case "poor":
      return (
          <MdSignalCellularConnectedNoInternet0Bar className={styles.offline} />
      );
      default:
        return
  }
}
